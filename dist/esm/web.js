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
    constructor(notify, type, delay = SensorDelay.NORMAL) {
        var _a;
        this.notify = notify;
        this.type = type;
        this.delay = delay;
        this.abortController = new AbortController();
        const windowKey = (_a = getWindowProperty(type)) !== null && _a !== void 0 ? _a : '';
        this.sensor = new window[windowKey]({ frequency: webSensorFrequency[delay] });
    }
    start() {
        this.abortController = new AbortController();
        if (this.type == SensorType.MOTION_DETECTOR) {
            window.addEventListener('devicemotion', (ev) => {
                var _a, _b, _c;
                const x = ((_a = ev.accelerationIncludingGravity) === null || _a === void 0 ? void 0 : _a.x) || 0;
                const y = ((_b = ev.accelerationIncludingGravity) === null || _b === void 0 ? void 0 : _b.y) || 0;
                const z = ((_c = ev.accelerationIncludingGravity) === null || _c === void 0 ? void 0 : _c.z) || 0;
                const result = {
                    accuracy: -1,
                    timestamp: ev.timeStamp,
                    values: [x, y, z],
                };
                this.notify(SensorType[this.type], result);
            }, { signal: this.abortController.signal });
        }
        else {
            this.sensor.addEventListener('reading', () => {
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
                    timestamp: this.sensor.timestamp || -1,
                    values,
                };
                this.notify(SensorType[this.type], result);
            });
        }
        this.sensor.start();
    }
    stop() {
        this.sensor.removeEventListener('reading', null);
        this.abortController.abort('stop');
        this.sensor.stop();
    }
}
export class SensorsWeb extends WebPlugin {
    constructor() {
        super(...arguments);
        this.sensors = [];
    }
    async checkPermissions() {
        if (typeof navigator === 'undefined' || !navigator.permissions) {
            throw this.unavailable('Permissions API not available in this browser.');
        }
        const allPerms = [].concat(...Object.values(webNeededPerms));
        const uniquePerms = Array.from(new Set(allPerms));
        const permission = await Promise.all(uniquePerms.map((p) => navigator.permissions.query({ name: p })));
        return permission.reduce((p, c) => {
            return Object.assign(Object.assign({}, p), { [c.name]: c.state });
        }, {});
    }
    async requestPermissions(sensor) {
        if (typeof navigator === 'undefined' || !navigator.permissions) {
            throw this.unavailable('Permissions API not available in this browser.');
        }
        const permission = await Promise.all(webNeededPerms[sensor.type].map((p) => navigator.permissions.query({ name: p })));
        return permission.reduce((p, c) => {
            return Object.assign(Object.assign({}, p), { [c.name]: c.state });
        }, {});
    }
    async start(options) {
        const sensor = this.sensors.find((s) => s.type === options.type);
        if (!sensor)
            throw this.unavailable(`Sensor of type ${options.type} not initialized.`);
        sensor.start();
    }
    async stop(options) {
        const sensor = this.sensors.find((s) => s.type === options.type);
        if (!sensor)
            throw this.unavailable(`Sensor of type ${options.type} not initialized.`);
        sensor.stop();
    }
    async init({ type, delay }) {
        if (this.isPresent(type)) {
            const sensor = new WebSensor(this.notifyListeners, type, delay);
            this.sensors.push(sensor);
            return { type, delay };
        }
        return;
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