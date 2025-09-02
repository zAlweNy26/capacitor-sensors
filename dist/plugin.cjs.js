'use strict';

var core = require('@capacitor/core');

/**
 * Array of possible sensor delays.
 */
const SensorDelays = ['FASTEST', 'GAME', 'UI', 'NORMAL'];
/**
 * Array representing the types of sensors available in the application.
 */
const SensorTypes = [
    'AMBIENT_LIGHT',
    'ACCELEROMETER',
    'TEMPERATURE',
    'GAME_ROTATION_VECTOR',
    'GEOMAGNETIC_ROTATION_VECTOR',
    'GRAVITY',
    'GYROSCOPE',
    'HEART_BEAT',
    'HEART_RATE',
    'LINEAR_ACCELERATION',
    'MAGNETOMETER',
    'MOTION_DETECTOR',
    'POSE_6DOF',
    'PRESSURE',
    'PROXIMITY',
    'RELATIVE_HUMIDITY',
    'ROTATION_VECTOR',
    'SIGNIFICANT_MOTION',
    'STATIONARY_DETECTOR',
    'STEP_COUNTER',
    'STEP_DETECTOR',
    'ABSOLUTE_ORIENTATION',
    'RELATIVE_ORIENTATION',
];

const Sensors = core.registerPlugin('Sensors', {
    web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.SensorsWeb()),
});

const webSupportedSensors = {
    AbsoluteOrientationSensor: 'ABSOLUTE_ORIENTATION',
    Accelerometer: 'ACCELEROMETER',
    AmbientLightSensor: 'AMBIENT_LIGHT',
    GravitySensor: 'GRAVITY',
    Gyroscope: 'GYROSCOPE',
    LinearAccelerationSensor: 'LINEAR_ACCELERATION',
    Magnetometer: 'MAGNETOMETER',
    RelativeOrientationSensor: 'RELATIVE_ORIENTATION',
    ondevicemotion: 'MOTION_DETECTOR',
};
const webSensorFrequency = {
    FASTEST: 0,
    GAME: 15,
    UI: 30,
    NORMAL: 60,
};
const webNeededPerms = {
    ABSOLUTE_ORIENTATION: ['accelerometer', 'gyroscope', 'magnetometer'],
    ACCELEROMETER: ['accelerometer'],
    AMBIENT_LIGHT: ['ambient-light-sensor'],
    GRAVITY: ['accelerometer'],
    GYROSCOPE: ['gyroscope'],
    LINEAR_ACCELERATION: ['accelerometer'],
    MAGNETOMETER: ['magnetometer'],
    RELATIVE_ORIENTATION: ['accelerometer', 'gyroscope'],
    TEMPERATURE: [],
    GAME_ROTATION_VECTOR: [],
    GEOMAGNETIC_ROTATION_VECTOR: [],
    HEART_BEAT: [],
    HEART_RATE: [],
    MOTION_DETECTOR: [],
    POSE_6DOF: [],
    PRESSURE: [],
    PROXIMITY: [],
    RELATIVE_HUMIDITY: [],
    ROTATION_VECTOR: [],
    SIGNIFICANT_MOTION: [],
    STATIONARY_DETECTOR: [],
    STEP_COUNTER: [],
    STEP_DETECTOR: [],
};
const getWindowProperty = (type) => { var _a; return (_a = Object.entries(webSupportedSensors).find(([, value]) => value === type)) === null || _a === void 0 ? void 0 : _a[0]; };
class WebSensor {
    constructor(notify, type, delay = 'NORMAL') {
        this.notify = notify;
        this.type = type;
        this.delay = delay;
        this.abortController = new AbortController();
        const windowKey = getWindowProperty(type);
        if (!windowKey || windowKey === 'ondevicemotion')
            return;
        this.sensor = new window[windowKey]({ frequency: webSensorFrequency[delay] });
    }
    start() {
        this.abortController = new AbortController();
        if (this.type == 'MOTION_DETECTOR' || !this.sensor) {
            window.addEventListener('devicemotion', (ev) => {
                var _a, _b, _c;
                const x = ((_a = ev.accelerationIncludingGravity) === null || _a === void 0 ? void 0 : _a.x) || 0;
                const y = ((_b = ev.accelerationIncludingGravity) === null || _b === void 0 ? void 0 : _b.y) || 0;
                const z = ((_c = ev.accelerationIncludingGravity) === null || _c === void 0 ? void 0 : _c.z) || 0;
                const result = {
                    accuracy: 0,
                    timestamp: ev.timeStamp,
                    values: [x, y, z],
                };
                this.notify(this.type, result);
            }, { signal: this.abortController.signal });
        }
        else {
            const sensor = this.sensor;
            this.sensor.addEventListener('reading', () => {
                const values = [];
                if ('illuminance' in sensor)
                    values.push(sensor.illuminance);
                if ('quaternion' in sensor)
                    values.push(...sensor.quaternion);
                if ('x' in sensor)
                    values.push(sensor.x);
                if ('y' in sensor)
                    values.push(sensor.y);
                if ('z' in sensor)
                    values.push(sensor.z);
                const result = {
                    accuracy: 0,
                    timestamp: sensor.timestamp || 0,
                    values,
                };
                this.notify(this.type, result);
            });
            this.sensor.start();
        }
    }
    stop() {
        var _a, _b;
        (_a = this.sensor) === null || _a === void 0 ? void 0 : _a.removeEventListener('reading', null);
        this.abortController.abort('stop');
        (_b = this.sensor) === null || _b === void 0 ? void 0 : _b.stop();
    }
}
class SensorsWeb extends core.WebPlugin {
    constructor() {
        super(...arguments);
        this.sensors = [];
        this.onSensorData = (eventName, data) => {
            this.notifyListeners(eventName, data, true);
        };
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
    async requestPermissions(options) {
        if (typeof navigator === 'undefined' || !navigator.permissions) {
            throw this.unavailable('Permissions API not available in this browser.');
        }
        const permission = await Promise.all(webNeededPerms[options.type].map((p) => navigator.permissions.query({ name: p })));
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
            const sensor = new WebSensor(this.onSensorData, type, delay);
            this.sensors.push(sensor);
            return { type, delay };
        }
        return { type, delay };
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
        if (SensorTypes.includes(type)) {
            const windowKey = getWindowProperty(type);
            if (windowKey)
                return windowKey in window;
            return false;
        }
        return false;
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    SensorsWeb: SensorsWeb
});

exports.SensorDelays = SensorDelays;
exports.SensorTypes = SensorTypes;
exports.Sensors = Sensors;
//# sourceMappingURL=plugin.cjs.js.map
