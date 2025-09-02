import type { PermissionStatus, SensorData, SensorOptions, SensorsPlugin, SensorType } from './definitions';
import { WebPlugin } from '@capacitor/core';
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
    init(options: SensorOptions): Promise<SensorData | undefined>;
    getAvailableSensors(): Promise<{
        sensors: SensorType[];
    }>;
    private isPresent;
}
