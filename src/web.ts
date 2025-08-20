import { WebPlugin } from '@capacitor/core';

import type { SensorsPlugin, SensorOptions, PermissionStatus, SensorResult, SensorData } from './definitions';
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
  ondevicemotion: SensorType.MOTION_DETECTOR,
};

const webSensorFrequency: Record<SensorDelay, number> = {
  [SensorDelay.FASTEST]: 0,
  [SensorDelay.GAME]: 15,
  [SensorDelay.UI]: 30,
  [SensorDelay.NORMAL]: 60,
};

const webNeededPerms: Record<number, (keyof PermissionStatus)[]> = {
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

class WebSensor implements SensorData {
  private sensor!: Sensor;

  constructor(
    public type: SensorType,
    public notify: (eventName: string, data: any) => void,
    public delay: SensorDelay = SensorDelay.NORMAL,
  ) {
    const windowKey = getWindowProperty(type) ?? '';
    this.sensor = new (window as any)[windowKey]({ frequency: webSensorFrequency[delay] });
  }

  start(): void {
    this.sensor.addEventListener('reading', () => {
      const values: number[] = [];
      if ('illuminance' in this.sensor) values.push(this.sensor.illuminance as number);
      if ('quaternion' in this.sensor) values.push(...(this.sensor.quaternion as number[]));
      if ('x' in this.sensor) values.push(this.sensor.x as number);
      if ('y' in this.sensor) values.push(this.sensor.y as number);
      if ('z' in this.sensor) values.push(this.sensor.z as number);

      const result = {
        accuracy: -1,
        timestamp: this.sensor.timestamp ?? -1,
        values,
      } satisfies SensorResult;

      this.notify(SensorType[this.type], result);
    });
    this.sensor.start();
  }

  stop(): void {
    this.sensor.removeEventListener('reading', null);
    this.sensor.stop();
  }
}

export class SensorsWeb extends WebPlugin implements SensorsPlugin {
  async checkPermissions(): Promise<PermissionStatus> {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      this.unavailable('Permissions API not available in this browser.');
    }
    const allPerms = ([] as (keyof PermissionStatus)[]).concat(...Object.values(webNeededPerms));
    const uniquePerms = Array.from(new Set(allPerms));
    const permission = await Promise.all(
      uniquePerms.map((p) => navigator.permissions.query({ name: p as PermissionName })),
    );
    return permission.reduce((p, c) => {
      return {
        ...p,
        [c.name]: c.state,
      };
    }, {} as PermissionStatus);
  }

  async requestPermissions(sensor: SensorData): Promise<PermissionStatus> {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      this.unavailable('Permissions API not available in this browser.');
    }
    const permission = await Promise.all(
      webNeededPerms[sensor.type].map((p) => navigator.permissions.query({ name: p as PermissionName })),
    );
    return permission.reduce((p, c) => {
      return {
        ...p,
        [c.name]: c.state,
      };
    }, {} as PermissionStatus);
  }

  async start(sensor: WebSensor): Promise<void> {
    if (sensor.type == SensorType.MOTION_DETECTOR) {
      window.ondevicemotion = () => {
        this.notifyListeners(SensorType[sensor.type], [1]);
      };
    } else sensor.start();
  }

  async stop(sensor: WebSensor): Promise<void> {
    sensor.stop();
  }

  async init({ type, delay }: SensorOptions): Promise<SensorData | undefined> {
    if (this.isPresent(type)) {
      if (type == SensorType.MOTION_DETECTOR) {
        const sensor = { type } satisfies SensorData;
        return sensor;
      } else {
        const sensor = new WebSensor(type, this.notifyListeners, delay);
        return sensor;
      }
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
