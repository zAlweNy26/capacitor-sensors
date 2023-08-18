package com.alwe.plugins.sensors

import android.annotation.SuppressLint
import android.hardware.Sensor
import android.os.Build
import androidx.annotation.RequiresApi

enum class SensorDelay {
    FASTEST, // Get sensor data as fast as possible
    GAME, // Rate suitable for games
    UI, // Rate suitable for user interface
    NORMAL // Default rate, suitable for screen orientation changes
}

enum class SensorType {
    LIGHT,
    ACCELEROMETER,
    TEMPERATURE,
    GAME_ROTATION_VECTOR,
    GEOMAGNETIC_ROTATION_VECTOR,
    GRAVITY,
    GYROSCOPE,
    HEART_BEAT,
    HEART_RATE,
    LINEAR_ACCELERATION,
    MAGNETIC_FIELD,
    MOTION_DETECT,
    ORIENTATION,
    POSE_6DOF,
    PRESSURE,
    PROXIMITY,
    RELATIVE_HUMIDITY,
    ROTATION_VECTOR,
    SIGNIFICANT_MOTION,
    STATIONARY_DETECT,
    STEP_COUNTER,
    STEP_DETECTOR
}

val sensorsMap = mapOf(
    SensorType.LIGHT to Sensor.TYPE_LIGHT,
    SensorType.ACCELEROMETER to Sensor.TYPE_ACCELEROMETER,
    SensorType.TEMPERATURE to Sensor.TYPE_AMBIENT_TEMPERATURE,
    SensorType.GAME_ROTATION_VECTOR to Sensor.TYPE_GAME_ROTATION_VECTOR,
    SensorType.GEOMAGNETIC_ROTATION_VECTOR to Sensor.TYPE_GEOMAGNETIC_ROTATION_VECTOR,
    SensorType.GRAVITY to Sensor.TYPE_GRAVITY,
    SensorType.GYROSCOPE to Sensor.TYPE_GYROSCOPE,
    SensorType.HEART_BEAT to Sensor.TYPE_HEART_BEAT,
    SensorType.HEART_RATE to Sensor.TYPE_HEART_RATE,
    SensorType.LINEAR_ACCELERATION to Sensor.TYPE_LINEAR_ACCELERATION,
    SensorType.MAGNETIC_FIELD to Sensor.TYPE_MAGNETIC_FIELD,
    SensorType.MOTION_DETECT to Sensor.TYPE_MOTION_DETECT,
    SensorType.ORIENTATION to Sensor.TYPE_ORIENTATION,
    SensorType.POSE_6DOF to Sensor.TYPE_POSE_6DOF,
    SensorType.PRESSURE to Sensor.TYPE_PRESSURE,
    SensorType.PROXIMITY to Sensor.TYPE_PROXIMITY,
    SensorType.RELATIVE_HUMIDITY to Sensor.TYPE_RELATIVE_HUMIDITY,
    SensorType.ROTATION_VECTOR to Sensor.TYPE_ROTATION_VECTOR,
    SensorType.SIGNIFICANT_MOTION to Sensor.TYPE_SIGNIFICANT_MOTION,
    SensorType.STATIONARY_DETECT to Sensor.TYPE_STATIONARY_DETECT,
    SensorType.STEP_COUNTER to Sensor.TYPE_STEP_COUNTER,
    SensorType.STEP_DETECTOR to Sensor.TYPE_STEP_DETECTOR,
)

inline fun <reified T : Enum<T>> Int.toEnum(): T? {
    return enumValues<T>().firstOrNull { it.ordinal == this }
}

inline fun <reified T : Enum<T>> T.toInt(): Int {
    return this.ordinal
}