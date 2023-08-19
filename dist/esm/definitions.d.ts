import type { PermissionState, Plugin, PluginListenerHandle } from '@capacitor/core';
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
    MOTION_DETECT = 11,
    ORIENTATION = 12,
    POSE_6DOF = 13,
    PRESSURE = 14,
    PROXIMITY = 15,
    RELATIVE_HUMIDITY = 16,
    ROTATION_VECTOR = 17,
    SIGNIFICANT_MOTION = 18,
    STATIONARY_DETECTOR = 19,
    STEP_COUNTER = 20,
    STEP_DETECTOR = 21,
    ABSOLUTE_ORIENTATION = 22,
    RELATIVE_ORIENTATION = 23
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
export interface SensorsPlugin extends Omit<Plugin, 'addListener'> {
    init(options: SensorOptions): Promise<SensorData | undefined>;
    getAvailableSensors(): Promise<{
        sensors: SensorType[];
    }>;
    requestPermissions(sensor: SensorData): Promise<WebPermissionStatus>;
    start(sensor: SensorData): Promise<void>;
    stop(sensor: SensorData): Promise<void>;
    addListener(eventName: SensorEvent, listenerFunc: (...args: any[]) => void): Promise<PluginListenerHandle>;
}
