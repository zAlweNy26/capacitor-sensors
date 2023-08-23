import { WebPlugin } from '@capacitor/core';
import { SensorDelay, SensorType } from './definitions';
const webSupportedSensors = {
    AbsoluteOrientationSensor: SensorType.ABSOLUTE_ORIENTATION,
    Accelerometer: SensorType.ACCELEROMETER,
    AmbientLightSensor: SensorType.AMBIENT_LIGHT,
    GravitySensor: SensorType.GRAVITY,
    Gyroscope: SensorType.GYROSCOPE,
    LinearAccelerationSensor: SensorType.LINEAR_ACCELERATION,
    Magnetometer: SensorType.MAGNETOMETER,
    RelativeOrientationSensor: SensorType.RELATIVE_ORIENTATION,
    ondevicemotion: SensorType.MOTION_DETECTOR,
};
const webSensorFrequency = {
    [SensorDelay.FASTEST]: 0,
    [SensorDelay.GAME]: 15,
    [SensorDelay.UI]: 30,
    [SensorDelay.NORMAL]: 60,
};
const webNeededPerms = {
    [SensorType.ABSOLUTE_ORIENTATION]: ['accelerometer', 'gyroscope', 'magnetometer'],
    [SensorType.ACCELEROMETER]: ['accelerometer'],
    [SensorType.AMBIENT_LIGHT]: ['ambient-light-sensor'],
    [SensorType.GRAVITY]: ['accelerometer'],
    [SensorType.GYROSCOPE]: ['gyroscope'],
    [SensorType.LINEAR_ACCELERATION]: ['accelerometer'],
    [SensorType.MAGNETOMETER]: ['magnetometer'],
    [SensorType.RELATIVE_ORIENTATION]: ['accelerometer', 'gyroscope'],
};
const getWindowProperty = (type) => Object.keys(webSupportedSensors).find((key) => webSupportedSensors[key] === type);
class WebSensor {
    constructor(type, notify, delay = SensorDelay.NORMAL) {
        var _a;
        this.type = type;
        this.notify = notify;
        this.delay = delay;
        const windowKey = (_a = getWindowProperty(type)) !== null && _a !== void 0 ? _a : '';
        this.sensor = new window[windowKey]({ frequency: webSensorFrequency[delay] });
    }
    start() {
        this.sensor.addEventListener('reading', () => {
            var _a;
            const values = [];
            if ('illuminance' in this.sensor)
                values.push(this.sensor.illuminance);
            if ('quaternion' in this.sensor)
                values.push(...this.sensor.quaternion);
            if ('x' in this.sensor)
                values.push(this.sensor.x);
            if ('y' in this.sensor)
                values.push(this.sensor.y);
            if ('z' in this.sensor)
                values.push(this.sensor.z);
            const result = {
                accuracy: -1,
                timestamp: (_a = this.sensor.timestamp) !== null && _a !== void 0 ? _a : -1,
                values,
            };
            this.notify(SensorType[this.type], result);
        });
        this.sensor.start();
    }
    stop() {
        this.sensor.removeEventListener('reading', null);
        this.sensor.stop();
    }
}
export class SensorsWeb extends WebPlugin {
    async requestPermissions(sensor) {
        if (typeof navigator === 'undefined' || !navigator.permissions) {
            this.unavailable('Permissions API not available in this browser.');
        }
        const permission = await Promise.all(webNeededPerms[sensor.type].map((p) => navigator.permissions.query({ name: p })));
        return permission.reduce((p, c) => {
            return Object.assign(Object.assign({}, p), { [c.name]: c.state });
        }, {});
    }
    async start(sensor) {
        if (sensor.type == SensorType.MOTION_DETECTOR) {
            window.ondevicemotion = () => {
                this.notifyListeners(SensorType[sensor.type], [1]);
            };
        }
        else
            sensor.start();
    }
    async stop(sensor) {
        sensor.stop();
    }
    async init({ type, delay }) {
        if (this.isPresent(type)) {
            if (type == SensorType.MOTION_DETECTOR) {
                const sensor = { type };
                return sensor;
            }
            else {
                const sensor = new WebSensor(type, this.notifyListeners, delay);
                return sensor;
            }
        }
        return undefined;
    }
    async getAvailableSensors() {
        const sensorsList = Object.entries(webSupportedSensors)
            .filter(([sensorName]) => sensorName in window)
            .map(([, sensorType]) => sensorType);
        return {
            sensors: sensorsList,
        };
    }
    isPresent(type) {
        if (type in SensorType) {
            const windowKey = getWindowProperty(type);
            if (windowKey)
                return windowKey in window;
            return false;
        }
        return false;
    }
}
//# sourceMappingURL=web.js.map