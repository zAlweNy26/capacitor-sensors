import { WebPlugin } from '@capacitor/core';
import type { SensorsPlugin, SensorOptions, PermissionStatus, SensorData } from './definitions';
import { SensorType } from './definitions';
export declare class SensorsWeb extends WebPlugin implements SensorsPlugin {
    private sensors;
    checkPermissions(): Promise<PermissionStatus>;
    requestPermissions(sensor: SensorOptions): Promise<PermissionStatus>;
    start(options: SensorOptions): Promise<void>;
    stop(options: SensorOptions): Promise<void>;
    init({ type, delay }: SensorOptions): Promise<SensorData | undefined>;
    getAvailableSensors(): Promise<{
        sensors: SensorType[];
    }>;
    private isPresent;
}
