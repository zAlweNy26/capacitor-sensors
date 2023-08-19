import type { PermissionState, Plugin, PluginListenerHandle } from '@capacitor/core';

export interface WebPermissionStatus {
  accelerometer: PermissionState;
  'ambient-light-sensor': PermissionState;
  gyroscope: PermissionState;
  magnetometer: PermissionState;
}

export enum SensorDelay {
  FASTEST, // Get sensor data as fast as possible
  GAME, // Rate suitable for games
  UI, // Rate suitable for user interface
  NORMAL, // Default rate, suitable for screen orientation changes
}

export enum WebSensorType {
  ACCELEROMETER,
  AMBIENT_LIGHT,
  GYROSCOPE,
  MAGNETOMETER,
  GRAVITY,
  ABSOLUTE_ORIENTATION,
  LINEAR_ACCELERATION,
  RELATIVE_ORIENTATION,
}

export enum SensorType {
  LIGHT,
  ACCELEROMETER,
  TEMPERATURE,
  GAME_ROTATION_VECTOR,
  GEOMAGNETIC_ROTATION_VECTOR,
  GRAVITY,
  GYROSCOPE,
  HEART_BEAT,
  HEART_RATE,
  LINEAR_ACCELERATION,
  MAGNETIC_FIELD,
  MOTION_DETECT,
  ORIENTATION,
  POSE_6DOF,
  PRESSURE,
  PROXIMITY,
  RELATIVE_HUMIDITY,
  ROTATION_VECTOR,
  SIGNIFICANT_MOTION,
  STATIONARY_DETECT,
  STEP_COUNTER,
  STEP_DETECTOR,
}

export interface SensorOptions {
  type: SensorType | WebSensorType;
  delay?: SensorDelay;
}

export interface SensorInfos {
  vendor: string;
  version: number;
  type: number;
  maxRange: number;
  resolution: number;
  power: number;
  minDelay: number;
  maxDelay: number;
}

export interface SensorData extends SensorOptions {
  infos?: SensorInfos;
}

type EventType = keyof typeof SensorType | keyof typeof WebSensorType;

export interface SensorsPlugin extends Omit<Plugin, 'addListener'> {
  init(options: SensorOptions): Promise<SensorData | undefined>;
  getAvailableSensors(): Promise<{
    sensors: (SensorType | WebSensorType)[];
  }>;
  requestPermissions(sensor: SensorData): Promise<WebPermissionStatus[]>;
  start(sensor: SensorData): Promise<void>;
  stop(sensor: SensorData): Promise<void>;
  addListener(eventName: EventType, listenerFunc: (...args: any[]) => void): Promise<PluginListenerHandle>;
}
