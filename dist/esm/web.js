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
export class SensorWeb {
    constructor(type, notify, delay = SensorDelay.NORMAL) {
        var _a;
        this.type = type;
        this.notify = notify;
        this.delay = delay;
        const windowKey = (_a = getWindowProperty(type)) !== null && _a !== void 0 ? _a : '';
        this.sensor = new (window[windowKey])({ frequency: webSensorFrequency[delay] });
    }
    start() {
        this.sensor.addEventListener('reading', () => {
            const values = JSON.parse(JSON.stringify(this.sensor));
            if (values) {
                delete values['activated'];
                delete values['hasReading'];
                delete values['onactivate'];
                delete values['onreading'];
                delete values['onerror'];
                delete values['start'];
                delete values['stop'];
            }
            this.notify(SensorType[this.type], values);
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
        sensor.start();
    }
    async stop(sensor) {
        sensor.stop();
    }
    async init({ type, delay }) {
        if (this.isPresent(type)) {
            const sensor = new SensorWeb(type, this.notifyListeners, delay);
            return sensor;
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