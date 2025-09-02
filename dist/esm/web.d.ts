import { WebPlugin } from '@capacitor/core';
import type { SensorsPlugin, SensorOptions, PermissionStatus, SensorData, SensorType } from './definitions';
export declare class SensorsWeb extends WebPlugin implements SensorsPlugin {
    private sensors;
    private onSensorData;
    checkPermissions(): Promise<PermissionStatus>;
    requestPermissions(options: {
        type: SensorType;
    }): Promise<PermissionStatus>;
    start(options: {
        type: SensorType;
    }): Promise<void>;
    stop(options: {
        type: SensorType;
    }): Promise<void>;
    init({ type, delay }: SensorOptions): Promise<SensorData | undefined>;
    getAvailableSensors(): Promise<{
        sensors: SensorType[];
    }>;
    private isPresent;
}
