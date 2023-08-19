'use strict';

var core = require('@capacitor/core');

exports.SensorDelay = void 0;
(function (SensorDelay) {
    SensorDelay[SensorDelay["FASTEST"] = 0] = "FASTEST";
    SensorDelay[SensorDelay["GAME"] = 1] = "GAME";
    SensorDelay[SensorDelay["UI"] = 2] = "UI";
    SensorDelay[SensorDelay["NORMAL"] = 3] = "NORMAL";
})(exports.SensorDelay || (exports.SensorDelay = {}));
exports.SensorType = void 0;
(function (SensorType) {
    SensorType[SensorType["AMBIENT_LIGHT"] = 0] = "AMBIENT_LIGHT";
    SensorType[SensorType["ACCELEROMETER"] = 1] = "ACCELEROMETER";
    SensorType[SensorType["TEMPERATURE"] = 2] = "TEMPERATURE";
    SensorType[SensorType["GAME_ROTATION_VECTOR"] = 3] = "GAME_ROTATION_VECTOR";
    SensorType[SensorType["GEOMAGNETIC_ROTATION_VECTOR"] = 4] = "GEOMAGNETIC_ROTATION_VECTOR";
    SensorType[SensorType["GRAVITY"] = 5] = "GRAVITY";
    SensorType[SensorType["GYROSCOPE"] = 6] = "GYROSCOPE";
    SensorType[SensorType["HEART_BEAT"] = 7] = "HEART_BEAT";
    SensorType[SensorType["HEART_RATE"] = 8] = "HEART_RATE";
    SensorType[SensorType["LINEAR_ACCELERATION"] = 9] = "LINEAR_ACCELERATION";
    SensorType[SensorType["MAGNETOMETER"] = 10] = "MAGNETOMETER";
    SensorType[SensorType["MOTION_DETECT"] = 11] = "MOTION_DETECT";
    SensorType[SensorType["ORIENTATION"] = 12] = "ORIENTATION";
    SensorType[SensorType["POSE_6DOF"] = 13] = "POSE_6DOF";
    SensorType[SensorType["PRESSURE"] = 14] = "PRESSURE";
    SensorType[SensorType["PROXIMITY"] = 15] = "PROXIMITY";
    SensorType[SensorType["RELATIVE_HUMIDITY"] = 16] = "RELATIVE_HUMIDITY";
    SensorType[SensorType["ROTATION_VECTOR"] = 17] = "ROTATION_VECTOR";
    SensorType[SensorType["SIGNIFICANT_MOTION"] = 18] = "SIGNIFICANT_MOTION";
    SensorType[SensorType["STATIONARY_DETECTOR"] = 19] = "STATIONARY_DETECTOR";
    SensorType[SensorType["STEP_COUNTER"] = 20] = "STEP_COUNTER";
    SensorType[SensorType["STEP_DETECTOR"] = 21] = "STEP_DETECTOR";
    SensorType[SensorType["ABSOLUTE_ORIENTATION"] = 22] = "ABSOLUTE_ORIENTATION";
    SensorType[SensorType["RELATIVE_ORIENTATION"] = 23] = "RELATIVE_ORIENTATION";
})(exports.SensorType || (exports.SensorType = {}));

const Sensors = core.registerPlugin('Sensors', {
    web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.SensorsWeb()),
});

const webSupportedSensors = {
    AbsoluteOrientationSensor: exports.SensorType.ABSOLUTE_ORIENTATION,
    Accelerometer: exports.SensorType.ACCELEROMETER,
    AmbientLightSensor: exports.SensorType.AMBIENT_LIGHT,
    GravitySensor: exports.SensorType.GRAVITY,
    Gyroscope: exports.SensorType.GYROSCOPE,
    LinearAccelerationSensor: exports.SensorType.LINEAR_ACCELERATION,
    Magnetometer: exports.SensorType.MAGNETOMETER,
    RelativeOrientationSensor: exports.SensorType.RELATIVE_ORIENTATION,
};
const webSensorFrequency = {
    [exports.SensorDelay.FASTEST]: 0,
    [exports.SensorDelay.GAME]: 15,
    [exports.SensorDelay.UI]: 30,
    [exports.SensorDelay.NORMAL]: 60,
};
const webNeededPerms = {
    [exports.SensorType.ABSOLUTE_ORIENTATION]: ['accelerometer', 'gyroscope', 'magnetometer'],
    [exports.SensorType.ACCELEROMETER]: ['accelerometer'],
    [exports.SensorType.AMBIENT_LIGHT]: ['ambient-light-sensor'],
    [exports.SensorType.GRAVITY]: ['accelerometer'],
    [exports.SensorType.GYROSCOPE]: ['gyroscope'],
    [exports.SensorType.LINEAR_ACCELERATION]: ['accelerometer'],
    [exports.SensorType.MAGNETOMETER]: ['magnetometer'],
    [exports.SensorType.RELATIVE_ORIENTATION]: ['accelerometer', 'gyroscope'],
};
const getWindowProperty = (type) => Object.keys(webSupportedSensors).find((key) => webSupportedSensors[key] === type);
class SensorWeb {
    constructor(type, notify, delay = exports.SensorDelay.NORMAL) {
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
            this.notify(exports.SensorType[this.type], values);
        });
        this.sensor.start();
    }
    stop() {
        this.sensor.removeEventListener('reading', null);
        this.sensor.stop();
    }
}
class SensorsWeb extends core.WebPlugin {
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
        if (type in exports.SensorType) {
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
    SensorWeb: SensorWeb,
    SensorsWeb: SensorsWeb
});

exports.Sensors = Sensors;
//# sourceMappingURL=plugin.cjs.js.map