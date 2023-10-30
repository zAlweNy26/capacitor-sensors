import type { PermissionState, PluginListenerHandle } from '@capacitor/core';

/**
 * Interface representing the permission status for various web sensors.
 */
export interface WebPermissionStatus {
  accelerometer: PermissionState;
  'ambient-light-sensor': PermissionState;
  gyroscope: PermissionState;
  magnetometer: PermissionState;
}

/**
 * Enum representing the delay rates for sensor data.
 */
export enum SensorDelay {
  /**
   * Get sensor data as fast as possible.
   */
  FASTEST,

  /**
   * Rate suitable for games.
   */
  GAME,

  /**
   * Rate suitable for user interface.
   */
  UI,

  /**
   * Default rate, suitable for screen orientation changes.
   */
  NORMAL,
}

/**
 * Enum representing the types of sensors available in the application.
 */
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

/**
 * Interface representing sensor information.
 */
export interface SensorInfos {
  /**
   * The vendor of the sensor.
   */
  vendor: string;
  /**
   * The version of the sensor.
   */
  version: number;
  /**
   * The type of the sensor.
   */
  type: number;
  /**
   * The maximum range of the sensor.
   */
  maxRange: number;
  /**
   * The resolution of the sensor.
   */
  resolution: number;
  /**
   * The power consumption of the sensor.
   */
  power: number;
  /**
   * The minimum delay between sensor readings.
   */
  minDelay: number;
  /**
   * The maximum delay between sensor readings.
   */
  maxDelay: number;
}

/**
 * Represents the data returned by a sensor, including any additional information about the sensor.
 */
export interface SensorData extends SensorOptions {
  infos?: SensorInfos;
}

/**
 * Represents the result of a sensor reading.
 */
export interface SensorResult {
  /**
   * The accuracy of the sensor reading, if available.
   */
  accuracy?: number;
  /**
   * The timestamp of the sensor reading, if available.
   */
  timestamp?: number;
  /**
   * The values obtained from the sensor reading.
   */
  values: number[];
}

/**
 * The Sensors Plugin interface.
 */
export interface SensorsPlugin {
  /**
   * Initializes the sensor plugin with the given options.
   * @param options - The options to initialize the sensor plugin with.
   * @returns A Promise that resolves to the sensor data, or undefined if initialization failed.
   */
  init(options: SensorOptions): Promise<SensorData | undefined>;

  /**
   * Gets a list of available sensors.
   * @returns A Promise that resolves to an object containing the available sensors.
   */
  getAvailableSensors(): Promise<{
    sensors: SensorType[];
  }>;

  /**
   * Requests permission to use the given sensor.
   * @param sensor - The sensor to request permission for.
   * @returns A Promise that resolves to the permission status.
   */
  requestPermissions(sensor: SensorData): Promise<WebPermissionStatus>;

  /**
   * Starts the given sensor.
   * @param sensor - The sensor to start.
   * @returns A Promise that resolves when the sensor has started.
   */
  start(sensor: SensorData): Promise<void>;

  /**
   * Stops the given sensor.
   * @param sensor - The sensor to stop.
   * @returns A Promise that resolves when the sensor has stopped.
   */
  stop(sensor: SensorData): Promise<void>;

  /**
   * Adds a listener for the given sensor event.
   * @param eventName - The name of the event to listen for.
   * @param listenerFunc - The function to call when the event is triggered.
   * @returns A Promise that resolves to a handle for the listener.
   */
  addListener(eventName: SensorEvent, listenerFunc: (event: SensorResult) => void): Promise<PluginListenerHandle>;

  /**
   * Removes all listeners for the sensor plugin.
   * @returns A Promise that resolves when all listeners have been removed.
   */
  removeAllListeners(): Promise<void>;
}
