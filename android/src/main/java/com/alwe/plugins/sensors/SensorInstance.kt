package com.alwe.plugins.sensors

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.util.Log
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject

class SensorInstance(
    override val plugin: SensorsPlugin,
    override val type: SensorType,
    override val delay: SensorDelay = SensorDelay.NORMAL
) : PluginSensor {
    private var sensor = SensorsPlugin.sensorsManager?.getDefaultSensor(type.type)

    override fun init(): JSObject {
        val infos = JSObject()
        infos.put("name", sensor?.name)
        infos.put("vendor", sensor?.vendor)
        infos.put("version", sensor?.version)
        infos.put("type", sensor?.type)
        infos.put("maxRange", sensor?.maximumRange) // sensor unit
        infos.put("resolution", sensor?.resolution) // sensor unit
        infos.put("power", sensor?.power) // milliampere
        infos.put("minDelay", sensor?.minDelay) // microseconds
        infos.put("maxDelay", sensor?.maxDelay) // microseconds

        val ret = JSObject()
        ret.put("infos", infos)
        ret.put("type", this.type.name)
        ret.put("delay", this.delay.name)
        return ret
    }

    override fun start() {
        if (this.sensor != null) {
            SensorsPlugin.sensorsManager?.registerListener(this, this.sensor, this.delay.ordinal)
            Log.d("Start", "Sensor: " + this.type.name)
        }
    }

    override fun stop() {
        SensorsPlugin.sensorsManager?.unregisterListener(this)
        Log.d("Stop", "Sensor: " + this.type.name)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        val content = JSObject()

        if (event != null) {
            content.put("accuracy", event.accuracy)
            content.put("timestamp", event.timestamp) // nanoseconds
            content.put("values", JSArray(event.values))

            this.plugin.notify(this.type.name, content, true)
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}