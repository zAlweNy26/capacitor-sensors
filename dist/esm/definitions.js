/**
 * Enum representing the delay rates for sensor data.
 */
export var SensorDelay;
(function (SensorDelay) {
    /**
     * Get sensor data as fast as possible.
     */
    SensorDelay[SensorDelay["FASTEST"] = 0] = "FASTEST";
    /**
     * Rate suitable for games.
     */
    SensorDelay[SensorDelay["GAME"] = 1] = "GAME";
    /**
     * Rate suitable for user interface.
     */
    SensorDelay[SensorDelay["UI"] = 2] = "UI";
    /**
     * Default rate, suitable for screen orientation changes.
     */
    SensorDelay[SensorDelay["NORMAL"] = 3] = "NORMAL";
})(SensorDelay || (SensorDelay = {}));
/**
 * Enum representing the types of sensors available in the application.
 */
export var SensorType;
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
    SensorType[SensorType["MOTION_DETECTOR"] = 11] = "MOTION_DETECTOR";
    SensorType[SensorType["POSE_6DOF"] = 12] = "POSE_6DOF";
    SensorType[SensorType["PRESSURE"] = 13] = "PRESSURE";
    SensorType[SensorType["PROXIMITY"] = 14] = "PROXIMITY";
    SensorType[SensorType["RELATIVE_HUMIDITY"] = 15] = "RELATIVE_HUMIDITY";
    SensorType[SensorType["ROTATION_VECTOR"] = 16] = "ROTATION_VECTOR";
    SensorType[SensorType["SIGNIFICANT_MOTION"] = 17] = "SIGNIFICANT_MOTION";
    SensorType[SensorType["STATIONARY_DETECTOR"] = 18] = "STATIONARY_DETECTOR";
    SensorType[SensorType["STEP_COUNTER"] = 19] = "STEP_COUNTER";
    SensorType[SensorType["STEP_DETECTOR"] = 20] = "STEP_DETECTOR";
    SensorType[SensorType["ABSOLUTE_ORIENTATION"] = 21] = "ABSOLUTE_ORIENTATION";
    SensorType[SensorType["RELATIVE_ORIENTATION"] = 22] = "RELATIVE_ORIENTATION";
})(SensorType || (SensorType = {}));
//# sourceMappingURL=definitions.js.map