import type { PermissionState, PluginListenerHandle } from '@capacitor/core';
/**
 * Interface representing the permission status for various web sensors.
 */
export interface PermissionStatus {
    accelerometer: PermissionState;
    'ambient-light-sensor': PermissionState;
    gyroscope: PermissionState;
    magnetometer: PermissionState;
}
/**
 * Enum representing the delay rates for sensor data.
 */
export declare enum SensorDelay {
    /**
     * Get sensor data as fast as possible.
     */
    FASTEST = 0,
    /**
     * Rate suitable for games.
     */
    GAME = 1,
    /**
     * Rate suitable for user interface.
     */
    UI = 2,
    /**
     * Default rate, suitable for screen orientation changes.
     */
    NORMAL = 3
}
/**
 * Enum representing the types of sensors available in the application.
 */
export declare enum SensorType {
    AMBIENT_LIGHT = 0,
    ACCELEROMETER = 1,
    TEMPERATURE = 2,
    GAME_ROTATION_VECTOR = 3,
    GEOMAGNETIC_ROTATION_VECTOR = 4,
    GRAVITY = 5,
    GYROSCOPE = 6,
    HEART_BEAT = 7,
    HEART_RATE = 8,
    LINEAR_ACCELERATION = 9,
    MAGNETOMETER = 10,
    MOTION_DETECTOR = 11,
    POSE_6DOF = 12,
    PRESSURE = 13,
    PROXIMITY = 14,
    RELATIVE_HUMIDITY = 15,
    ROTATION_VECTOR = 16,
    SIGNIFICANT_MOTION = 17,
    STATIONARY_DETECTOR = 18,
    STEP_COUNTER = 19,
    STEP_DETECTOR = 20,
    ABSOLUTE_ORIENTATION = 21,
    RELATIVE_ORIENTATION = 22
}
/**
 * Represents the event names for sensor data.
 */
export type SensorEvent = keyof typeof SensorType;
/**
 * Represents the options for a sensor.
 */
export interface SensorOptions {
    /**
     * The type of sensor to use.
     */
    type: SensorType;
    /**
     * The delay between sensor readings.
     */
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
     * @param options The options to initialize the sensor plugin with.
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
     * Checks the permissions for the given sensor.
     * @returns A Promise that resolves to the permission status.
     */
    checkPermissions(): Promise<PermissionStatus>;
    /**
     * Requests permission to use the given sensor.
     * @param sensor The sensor to request permission for.
     * @returns A Promise that resolves to the permission status.
     */
    requestPermissions(sensor: SensorOptions): Promise<PermissionStatus>;
    /**
     * Starts the given sensor.
     * @param sensor The sensor to start.
     * @returns A Promise that resolves when the sensor has started.
     */
    start(sensor: SensorOptions): Promise<void>;
    /**
     * Stops the given sensor.
     * @param sensor The sensor to stop.
     * @returns A Promise that resolves when the sensor has stopped.
     */
    stop(sensor: SensorOptions): Promise<void>;
    /**
     * Adds a listener for the given sensor event.
     * @param eventName The name of the event to listen for.
     * @param listenerFunc The function to call when the event is triggered.
     * @returns A Promise that resolves to a handle for the listener.
     */
    addListener(eventName: SensorEvent, listenerFunc: (event: SensorResult) => void): Promise<PluginListenerHandle>;
    /**
     * Removes all listeners for the sensor plugin.
     * @returns A Promise that resolves when all listeners have been removed.
     */
    removeAllListeners(): Promise<void>;
}
