import { WebPlugin } from '@capacitor/core';

import type { SensorsPlugin, SensorOptions, SensorData, WebPermissionStatus } from './definitions';
import { SensorDelay, SensorType } from './definitions';

const webSupportedSensors: Record<string, SensorType> = {
  AbsoluteOrientationSensor: SensorType.ABSOLUTE_ORIENTATION,
  Accelerometer: SensorType.ACCELEROMETER,
  AmbientLightSensor: SensorType.AMBIENT_LIGHT,
  GravitySensor: SensorType.GRAVITY,
  Gyroscope: SensorType.GYROSCOPE,
  LinearAccelerationSensor: SensorType.LINEAR_ACCELERATION,
  Magnetometer: SensorType.MAGNETOMETER,
  RelativeOrientationSensor: SensorType.RELATIVE_ORIENTATION,
};

const webSensorFrequency: Record<SensorDelay, number> = {
  [SensorDelay.FASTEST]: 0,
  [SensorDelay.GAME]: 15,
  [SensorDelay.UI]: 30,
  [SensorDelay.NORMAL]: 60,
};

const webNeededPerms: Record<number, (keyof WebPermissionStatus)[]> = {
  [SensorType.ABSOLUTE_ORIENTATION]: ['accelerometer', 'gyroscope', 'magnetometer'],
  [SensorType.ACCELEROMETER]: ['accelerometer'],
  [SensorType.AMBIENT_LIGHT]: ['ambient-light-sensor'],
  [SensorType.GRAVITY]: ['accelerometer'],
  [SensorType.GYROSCOPE]: ['gyroscope'],
  [SensorType.LINEAR_ACCELERATION]: ['accelerometer'],
  [SensorType.MAGNETOMETER]: ['magnetometer'],
  [SensorType.RELATIVE_ORIENTATION]: ['accelerometer', 'gyroscope'],
};

const getWindowProperty = (type: SensorType) =>
  Object.keys(webSupportedSensors).find((key) => webSupportedSensors[key] === type);

export class SensorWeb implements SensorData {
  private sensor!: Sensor;

  constructor(
    public type: SensorType,
    public notify: (eventName: string, data: any) => void,
    public delay: SensorDelay = SensorDelay.NORMAL,
  ) {
    const windowKey = getWindowProperty(type) ?? '';
    this.sensor = new ((window as any)[windowKey])({ frequency: webSensorFrequency[delay] });
  }

  start(): void {
    this.sensor.addEventListener('reading', () => {
      const values = JSON.parse(JSON.stringify(this.sensor));
      if (values) {
        delete values['activated'];
        delete values['hasReading'];
        delete values['onactivate'];
        delete values['onreading'];
        delete values['onerror'];
        delete values['start'];
        delete values['stop'];
      }
      this.notify(SensorType[this.type], values);
    });
    this.sensor.start();
  }

  stop(): void {
    this.sensor.removeEventListener('reading', null);
    this.sensor.stop();
  }
}

export class SensorsWeb extends WebPlugin implements SensorsPlugin {
  async requestPermissions(sensor: SensorData): Promise<WebPermissionStatus> {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      this.unavailable('Permissions API not available in this browser.');
    }
    const permission = await Promise.all(
      webNeededPerms[sensor.type].map((p) => navigator.permissions.query({ name: p as PermissionName })),
    );
    return permission.reduce((p, c) => {
      return {
        ...p,
        [c.name]: c.state
      }
    }, {} as WebPermissionStatus)
  }

  async start(sensor: SensorWeb): Promise<void> {
    sensor.start();
  }

  async stop(sensor: SensorWeb): Promise<void> {
    sensor.stop();
  }

  async init({ type, delay }: SensorOptions): Promise<SensorWeb | undefined> {
    if (this.isPresent(type)) {
      const sensor = new SensorWeb(type, this.notifyListeners, delay);
      return sensor;
    }
    return undefined;
  }

  async getAvailableSensors(): Promise<{ sensors: SensorType[] }> {
    const sensorsList = Object.entries(webSupportedSensors)
      .filter(([sensorName]) => sensorName in window)
      .map(([, sensorType]) => sensorType);
    return {
      sensors: sensorsList,
    };
  }

  private isPresent(type: SensorType) {
    if (type in SensorType) {
      const windowKey = getWindowProperty(type);
      if (windowKey) return windowKey in window;
      return false;
    }
    return false;
  }
}
