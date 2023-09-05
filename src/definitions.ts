import type { PermissionState, PluginListenerHandle } from '@capacitor/core';

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

export enum SensorType {
  AMBIENT_LIGHT,
  ACCELEROMETER,
  TEMPERATURE,
  GAME_ROTATION_VECTOR,
  GEOMAGNETIC_ROTATION_VECTOR,
  GRAVITY,
  GYROSCOPE,
  HEART_BEAT,
  HEART_RATE,
  LINEAR_ACCELERATION,
  MAGNETOMETER,
  MOTION_DETECTOR,
  POSE_6DOF,
  PRESSURE,
  PROXIMITY,
  RELATIVE_HUMIDITY,
  ROTATION_VECTOR,
  SIGNIFICANT_MOTION,
  STATIONARY_DETECTOR,
  STEP_COUNTER,
  STEP_DETECTOR,
  ABSOLUTE_ORIENTATION,
  RELATIVE_ORIENTATION,
}

export type SensorEvent = keyof typeof SensorType;

export interface SensorOptions {
  type: SensorType;
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

export interface SensorResult {
  accuracy?: number;
  timestamp?: number;
  values: number[];
}

export interface SensorsPlugin {
  init(options: SensorOptions): Promise<SensorData | undefined>;
  getAvailableSensors(): Promise<{
    sensors: SensorType[];
  }>;
  requestPermissions(sensor: SensorData): Promise<WebPermissionStatus>;
  start(sensor: SensorData): Promise<void>;
  stop(sensor: SensorData): Promise<void>;
  addListener(eventName: SensorEvent, listenerFunc: (event: SensorResult) => void): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}
