import { WebPlugin } from '@capacitor/core';

import type { SensorsPlugin, SensorOptions, SensorData, WebPermissionStatus } from './definitions';
import { SensorDelay, WebSensorType } from './definitions';

const webSupportedSensors: Record<string, WebSensorType> = {
  AbsoluteOrientationSensor: WebSensorType.ABSOLUTE_ORIENTATION,
  Accelerometer: WebSensorType.ACCELEROMETER,
  AmbientLightSensor: WebSensorType.AMBIENT_LIGHT,
  GravitySensor: WebSensorType.GRAVITY,
  Gyroscope: WebSensorType.GYROSCOPE,
  LinearAccelerationSensor: WebSensorType.LINEAR_ACCELERATION,
  Magnetometer: WebSensorType.MAGNETOMETER,
  RelativeOrientationSensor: WebSensorType.RELATIVE_ORIENTATION,
};

const webSensorFrequency: Record<SensorDelay, number> = {
  [SensorDelay.FASTEST]: 0,
  [SensorDelay.GAME]: 15,
  [SensorDelay.UI]: 30,
  [SensorDelay.NORMAL]: 60,
};

const webNeededPerms: Record<WebSensorType, (keyof WebPermissionStatus)[]> = {
  [WebSensorType.ABSOLUTE_ORIENTATION]: ['accelerometer', 'gyroscope', 'magnetometer'],
  [WebSensorType.ACCELEROMETER]: ['accelerometer'],
  [WebSensorType.AMBIENT_LIGHT]: ['ambient-light-sensor'],
  [WebSensorType.GRAVITY]: ['accelerometer'],
  [WebSensorType.GYROSCOPE]: ['gyroscope'],
  [WebSensorType.LINEAR_ACCELERATION]: ['accelerometer'],
  [WebSensorType.MAGNETOMETER]: ['magnetometer'],
  [WebSensorType.RELATIVE_ORIENTATION]: ['accelerometer', 'gyroscope'],
};

const getWindowProperty = (type: WebSensorType) =>
  Object.keys(webSupportedSensors).find((key) => webSupportedSensors[key] === type);

export class SensorWeb implements SensorData {
  private sensor!: Sensor;

  constructor(
    public type: WebSensorType,
    public notify: (eventName: string, data: any) => void,
    public delay: SensorDelay = SensorDelay.NORMAL,
  ) {
    const windowKey = getWindowProperty(type);
    if (windowKey) {
      this.sensor = new (window as any)[windowKey]({ frequency: webSensorFrequency[delay] });
    }
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
      this.notify(WebSensorType[this.type], values);
    });
    this.sensor.start();
  }

  stop(): void {
    this.sensor.removeEventListener('reading', null);
    this.sensor.stop();
  }
}

export class SensorsWeb extends WebPlugin implements SensorsPlugin {
  async requestPermissions(sensor: SensorData): Promise<WebPermissionStatus[]> {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      this.unavailable('Permissions API not available in this browser.');
    }
    const sensorType = sensor.type as WebSensorType;
    const permission = await Promise.all(
      webNeededPerms[sensorType].map((p) => navigator.permissions.query({ name: p as PermissionName })),
    );
    return permission as unknown as WebPermissionStatus[];
  }

  async start(sensor: SensorWeb): Promise<void> {
    sensor.start();
  }

  async stop(sensor: SensorWeb): Promise<void> {
    sensor.stop();
  }

  async init({ type, delay }: SensorOptions): Promise<SensorWeb | undefined> {
    const webType = type as WebSensorType;
    if (this.isPresent(webType)) {
      const sensor = new SensorWeb(webType, this.notifyListeners, delay);
      return sensor;
    }
    return undefined;
  }

  async getAvailableSensors(): Promise<{ sensors: WebSensorType[] }> {
    const sensorsList = Object.entries(webSupportedSensors)
      .filter(([sensorName]) => sensorName in window)
      .map(([, sensorType]) => sensorType);
    return {
      sensors: sensorsList,
    };
  }

  private isPresent(type: WebSensorType) {
    if (type in WebSensorType) {
      const windowKey = getWindowProperty(type);
      if (windowKey) return windowKey in window;
      return false;
    }
    return false;
  }
}
