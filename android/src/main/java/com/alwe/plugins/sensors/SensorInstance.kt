package com.alwe.plugins.sensors

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.util.Log
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject

class SensorInstance(
    private val notify: (eventName: String, data: JSObject) -> Unit,
    private val manager: SensorManager,
    val type: SensorType,
    private val delay: SensorDelay = SensorDelay.NORMAL
) : SensorEventListener {
    private var sensor = sensorsMap[type]?.let { manager.getDefaultSensor(it) }

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
        ret.put("type", this.type)
        ret.put("delay", this.delay)
        return ret
    }

    fun start() {
        if (this.sensor != null) {
            this.manager.registerListener(this, this.sensor, this.delay.toInt())
            Log.d("Start", "Sensor: " + this.type.toString())
        }
    }

    fun stop() {
        this.manager.unregisterListener(this)
        Log.d("Stop", "Sensor: " + this.type.toString())
    }

    override fun onSensorChanged(event: SensorEvent?) {
        val content = JSObject()

        content.put("accuracy", event?.accuracy)
        content.put("timestamp", event?.timestamp)
        content.put("values", JSArray(event?.values))

        this.notify(this.type.name, content)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}