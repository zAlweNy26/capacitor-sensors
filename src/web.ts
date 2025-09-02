import { WebPlugin } from '@capacitor/core';

import type {
  SensorsPlugin,
  SensorOptions,
  PermissionStatus,
  SensorResult,
  SensorData,
  SensorType,
  SensorDelay,
} from './definitions';
import { SensorTypes } from './definitions';

const webSupportedSensors = {
  AbsoluteOrientationSensor: 'ABSOLUTE_ORIENTATION',
  Accelerometer: 'ACCELEROMETER',
  AmbientLightSensor: 'AMBIENT_LIGHT',
  GravitySensor: 'GRAVITY',
  Gyroscope: 'GYROSCOPE',
  LinearAccelerationSensor: 'LINEAR_ACCELERATION',
  Magnetometer: 'MAGNETOMETER',
  RelativeOrientationSensor: 'RELATIVE_ORIENTATION',
  ondevicemotion: 'MOTION_DETECTOR',
} satisfies Record<string, SensorType>;

const webSensorFrequency: Record<SensorDelay, number> = {
  FASTEST: 0,
  GAME: 15,
  UI: 30,
  NORMAL: 60,
};

const webNeededPerms = {
  ABSOLUTE_ORIENTATION: ['accelerometer', 'gyroscope', 'magnetometer'],
  ACCELEROMETER: ['accelerometer'],
  AMBIENT_LIGHT: ['ambient-light-sensor'],
  GRAVITY: ['accelerometer'],
  GYROSCOPE: ['gyroscope'],
  LINEAR_ACCELERATION: ['accelerometer'],
  MAGNETOMETER: ['magnetometer'],
  RELATIVE_ORIENTATION: ['accelerometer', 'gyroscope'],
  TEMPERATURE: [],
  GAME_ROTATION_VECTOR: [],
  GEOMAGNETIC_ROTATION_VECTOR: [],
  HEART_BEAT: [],
  HEART_RATE: [],
  MOTION_DETECTOR: [],
  POSE_6DOF: [],
  PRESSURE: [],
  PROXIMITY: [],
  RELATIVE_HUMIDITY: [],
  ROTATION_VECTOR: [],
  SIGNIFICANT_MOTION: [],
  STATIONARY_DETECTOR: [],
  STEP_COUNTER: [],
  STEP_DETECTOR: [],
} satisfies Record<SensorType, (keyof PermissionStatus)[]>;

const getWindowProperty = (type: SensorType) =>
  Object.entries(webSupportedSensors).find(([, value]) => value === type)?.[0] as keyof typeof webSupportedSensors;

class WebSensor implements SensorData {
  private sensor: Sensor | undefined;
  private abortController: AbortController = new AbortController();

  constructor(
    public notify: (eventName: SensorType, data: SensorResult) => void,
    public type: SensorType,
    public delay: SensorDelay = 'NORMAL',
  ) {
    const windowKey = getWindowProperty(type);
    if (!windowKey || windowKey === 'ondevicemotion') return;
    this.sensor = new (window as any)[windowKey]({ frequency: webSensorFrequency[delay] });
  }

  start(): void {
    this.abortController = new AbortController();
    if (this.type == 'MOTION_DETECTOR' || !this.sensor) {
      window.addEventListener(
        'devicemotion',
        (ev) => {
          const x = ev.accelerationIncludingGravity?.x || 0;
          const y = ev.accelerationIncludingGravity?.y || 0;
          const z = ev.accelerationIncludingGravity?.z || 0;

          const result = {
            accuracy: 0,
            timestamp: ev.timeStamp,
            values: [x, y, z],
          } satisfies SensorResult;

          this.notify(this.type, result);
        },
        { signal: this.abortController.signal },
      );
    } else {
      const sensor = this.sensor;
      this.sensor.addEventListener('reading', () => {
        const values: number[] = [];
        if ('illuminance' in sensor) values.push(sensor.illuminance as number);
        if ('quaternion' in sensor) values.push(...(sensor.quaternion as number[]));
        if ('x' in sensor) values.push(sensor.x as number);
        if ('y' in sensor) values.push(sensor.y as number);
        if ('z' in sensor) values.push(sensor.z as number);

        const result = {
          accuracy: 0,
          timestamp: sensor.timestamp || 0,
          values,
        } satisfies SensorResult;

        this.notify(this.type, result);
      });
      this.sensor.start();
    }
  }

  stop(): void {
    this.sensor?.removeEventListener('reading', null);
    this.abortController.abort('stop');
    this.sensor?.stop();
  }
}

export class SensorsWeb extends WebPlugin implements SensorsPlugin {
  private sensors: WebSensor[] = [];

  private onSensorData = (eventName: SensorType, data: SensorResult): void => {
    this.notifyListeners(eventName, data, true);
  };

  async checkPermissions(): Promise<PermissionStatus> {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      throw this.unavailable('Permissions API not available in this browser.');
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

  async requestPermissions(options: { type: SensorType }): Promise<PermissionStatus> {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      throw this.unavailable('Permissions API not available in this browser.');
    }
    const permission = await Promise.all(
      webNeededPerms[options.type].map((p) => navigator.permissions.query({ name: p as PermissionName })),
    );
    return permission.reduce((p, c) => {
      return {
        ...p,
        [c.name]: c.state,
      };
    }, {} as PermissionStatus);
  }

  async start(options: { type: SensorType }): Promise<void> {
    const sensor = this.sensors.find((s) => s.type === options.type);
    if (!sensor) throw this.unavailable(`Sensor of type ${options.type} not initialized.`);
    sensor.start();
  }

  async stop(options: { type: SensorType }): Promise<void> {
    const sensor = this.sensors.find((s) => s.type === options.type);
    if (!sensor) throw this.unavailable(`Sensor of type ${options.type} not initialized.`);
    sensor.stop();
  }

  async init({ type, delay }: SensorOptions): Promise<SensorData | undefined> {
    if (this.isPresent(type)) {
      const sensor = new WebSensor(this.onSensorData, type, delay);
      this.sensors.push(sensor);
      return { type, delay };
    }
    return { type, delay };
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
    if (SensorTypes.includes(type)) {
      const windowKey = getWindowProperty(type);
      if (windowKey) return windowKey in window;
      return false;
    }
    return false;
  }
}
