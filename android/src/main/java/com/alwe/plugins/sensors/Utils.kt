package com.alwe.plugins.sensors

import android.hardware.Sensor

enum class SensorDelay {
    FASTEST, // Get sensor data as fast as possible
    GAME, // Rate suitable for games
    UI, // Rate suitable for user interface
    NORMAL // Default rate, suitable for screen orientation changes
}

enum class SensorType(val type: Int) {
    LIGHT(Sensor.TYPE_LIGHT),
    ACCELEROMETER(Sensor.TYPE_ACCELEROMETER),
    TEMPERATURE(Sensor.TYPE_AMBIENT_TEMPERATURE),
    GAME_ROTATION_VECTOR(Sensor.TYPE_GAME_ROTATION_VECTOR),
    GEOMAGNETIC_ROTATION_VECTOR(Sensor.TYPE_GEOMAGNETIC_ROTATION_VECTOR),
    GRAVITY(Sensor.TYPE_GRAVITY),
    GYROSCOPE(Sensor.TYPE_GYROSCOPE),
    HEART_BEAT(Sensor.TYPE_HEART_BEAT),
    HEART_RATE(Sensor.TYPE_HEART_RATE),
    LINEAR_ACCELERATION(Sensor.TYPE_LINEAR_ACCELERATION),
    MAGNETIC_FIELD(Sensor.TYPE_MAGNETIC_FIELD),
    MOTION_DETECT(Sensor.TYPE_MOTION_DETECT),
    ORIENTATION(Sensor.TYPE_ORIENTATION),
    POSE_6DOF(Sensor.TYPE_POSE_6DOF),
    PRESSURE(Sensor.TYPE_PRESSURE),
    PROXIMITY(Sensor.TYPE_PROXIMITY),
    RELATIVE_HUMIDITY(Sensor.TYPE_RELATIVE_HUMIDITY),
    ROTATION_VECTOR(Sensor.TYPE_ROTATION_VECTOR),
    SIGNIFICANT_MOTION(Sensor.TYPE_SIGNIFICANT_MOTION),
    STATIONARY_DETECT(Sensor.TYPE_STATIONARY_DETECT),
    STEP_COUNTER(Sensor.TYPE_STEP_COUNTER),
    STEP_DETECTOR(Sensor.TYPE_STEP_DETECTOR)
}

inline fun <reified T : Enum<T>> Int.toEnum(): T? {
    return enumValues<T>().firstOrNull { it.ordinal == this }
}