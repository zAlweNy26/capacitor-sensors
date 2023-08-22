import type { PermissionState, PluginListenerHandle } from '@capacitor/core';
export interface WebPermissionStatus {
    accelerometer: PermissionState;
    'ambient-light-sensor': PermissionState;
    gyroscope: PermissionState;
    magnetometer: PermissionState;
}
export declare enum SensorDelay {
    FASTEST = 0,
    GAME = 1,
    UI = 2,
    NORMAL = 3
}
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
export interface SensorListenerResult {
    accuracy: number;
    timestamp: number;
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
    addListener(eventName: SensorEvent, listenerFunc: (event: SensorListenerResult) => void): Promise<PluginListenerHandle>;
    removeAllListeners(): Promise<void>;
}
