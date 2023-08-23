import { WebPlugin } from '@capacitor/core';
import type { SensorsPlugin, SensorOptions, WebPermissionStatus } from './definitions';
import { SensorDelay, SensorType, SensorData } from './definitions';
declare class WebSensor implements SensorData {
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
    start(sensor: WebSensor): Promise<void>;
    stop(sensor: WebSensor): Promise<void>;
    init({ type, delay }: SensorOptions): Promise<SensorData | undefined>;
    getAvailableSensors(): Promise<{
        sensors: SensorType[];
    }>;
    private isPresent;
}
export {};
