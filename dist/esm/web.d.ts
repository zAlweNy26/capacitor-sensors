import { WebPlugin } from '@capacitor/core';
import type { SensorsPlugin, SensorOptions, SensorData, WebPermissionStatus } from './definitions';
import { SensorDelay, SensorType } from './definitions';
export declare class SensorWeb implements SensorData {
    type: SensorType;
    notify: (eventName: string, data: any) => void;
    delay: SensorDelay;
    private sensor;
    constructor(type: SensorType, notify: (eventName: string, data: any) => void, delay?: SensorDelay);
    start(): void;
    stop(): void;
}
export declare class SensorsWeb extends WebPlugin implements SensorsPlugin {
    requestPermissions(sensor: SensorData): Promise<WebPermissionStatus>;
    start(sensor: SensorWeb): Promise<void>;
    stop(sensor: SensorWeb): Promise<void>;
    init({ type, delay }: SensorOptions): Promise<SensorWeb | undefined>;
    getAvailableSensors(): Promise<{
        sensors: SensorType[];
    }>;
    private isPresent;
}
