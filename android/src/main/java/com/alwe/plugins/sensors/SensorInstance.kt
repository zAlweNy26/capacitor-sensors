package com.alwe.plugins.sensors

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.util.Log
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject

class SensorInstance(
    private val notify: (eventName: String, data: JSObject, retainUntilConsumed: Boolean) -> Unit,
    val type: SensorType,
    private val delay: SensorDelay = SensorDelay.NORMAL
) : SensorEventListener {
    private var sensor = SensorsPlugin.sensorsManager?.getDefaultSensor(type.type)

    fun init(): JSObject {
        val infos = JSObject()
        infos.put("vendor", sensor?.vendor)
        infos.put("version", sensor?.version)
        infos.put("type", sensor?.type)
        infos.put("maxRange", sensor?.maximumRange)
        infos.put("resolution", sensor?.resolution)
        infos.put("power", sensor?.power)
        infos.put("minDelay", sensor?.minDelay)
        infos.put("maxDelay", sensor?.maxDelay)

        val ret = JSObject()
        ret.put("infos", infos)
        ret.put("type", this.type.ordinal)
        ret.put("delay", this.delay.ordinal)
        return ret
    }

    fun start() {
        if (this.sensor != null) {
            SensorsPlugin.sensorsManager?.registerListener(this, this.sensor, this.delay.ordinal)
            Log.d("Start", "Sensor: " + this.type.name)
        }
    }

    fun stop() {
        SensorsPlugin.sensorsManager?.unregisterListener(this)
        Log.d("Stop", "Sensor: " + this.type.name)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        val content = JSObject()

        content.put("accuracy", event?.accuracy)
        content.put("timestamp", event?.timestamp)
        content.put("values", JSArray(event?.values))

        notify(this.type.name, content, true)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}