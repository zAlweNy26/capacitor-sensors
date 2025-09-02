package com.alwe.plugins.sensors

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorManager
import android.util.Log
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject

class Orientation(
    override val plugin: SensorsPlugin,
    override val type: SensorType,
    override val delay: SensorDelay = SensorDelay.NORMAL
) : PluginSensor {
    private var sensorAccelerometer = SensorsPlugin.sensorsManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    private var sensorMagnetometer = SensorsPlugin.sensorsManager?.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)
    private var sensorGravity = SensorsPlugin.sensorsManager?.getDefaultSensor(Sensor.TYPE_GRAVITY)
    private var orientationValues = FloatArray(3)
    private var accelerometerData = FloatArray(3)
    private var magnetometerData = FloatArray(3)
    private var gravityData = FloatArray(3)
    private var rMatrix = FloatArray(9)
    private var iMatrix = FloatArray(9)

    override fun init(): JSObject {
        val ret = JSObject()
        ret.put("infos", null)
        ret.put("type", this.type.name)
        ret.put("delay", this.delay.name)
        return ret
    }

    override fun start() {
        when (this.type) {
            SensorType.RELATIVE_ORIENTATION -> {
                SensorsPlugin.sensorsManager?.registerListener(this, this.sensorAccelerometer, this.delay.ordinal)
                SensorsPlugin.sensorsManager?.registerListener(this, this.sensorMagnetometer, this.delay.ordinal)
            }
            SensorType.ABSOLUTE_ORIENTATION -> {
                SensorsPlugin.sensorsManager?.registerListener(this, this.sensorMagnetometer, this.delay.ordinal)
                SensorsPlugin.sensorsManager?.registerListener(this, this.sensorGravity, this.delay.ordinal)
            }
            else -> return
        }
        Log.d("Start", "Sensor: " + this.type.name)
    }

    override fun stop() {
        SensorsPlugin.sensorsManager?.unregisterListener(this)
        Log.d("Stop", "Sensor: " + this.type.name)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        val content = JSObject()

        if (event != null) {
            when (event.sensor?.type) {
                Sensor.TYPE_ACCELEROMETER -> accelerometerData = event.values.clone()
                Sensor.TYPE_MAGNETIC_FIELD -> magnetometerData = event.values.clone()
                Sensor.TYPE_GRAVITY -> gravityData = event.values.clone()
                else -> return
            }

            if (SensorManager.getRotationMatrix(rMatrix, iMatrix,
                    if (this.type == SensorType.RELATIVE_ORIENTATION) accelerometerData else gravityData,
                    magnetometerData)) {
                SensorManager.getOrientation(rMatrix, orientationValues)

                content.put("accuracy", event.accuracy)
                content.put("timestamp", event.timestamp) // nanoseconds
                content.put("values", JSArray(orientationValues))

                this.plugin.notify(this.type.name, content, true)
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}