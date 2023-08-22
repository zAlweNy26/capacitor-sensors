package com.alwe.plugins.sensors

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorManager
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin


@CapacitorPlugin(name = "Sensors")
class SensorsPlugin : Plugin() {
    private var sensors: ArrayList<SensorInstance> = arrayListOf()

    companion object {
        var sensorsManager: SensorManager? = null
    }

    override fun load() {
        super.load()
        sensorsManager = this.context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    }

    @PluginMethod
    fun init(call: PluginCall) {
        val type = call.getInt("type")?.toEnum<SensorType>()!!
        val delay = call.getInt("delay", 3)?.toEnum<SensorDelay>()!!

        if (type.name == "ABSOLUTE_ORIENTATION" || type.name == "RELATIVE_ORIENTATION") {
            call.unimplemented("The absolute/relative orientation is not implemented!")
        }

        if (!isPresent(type)) {
            call.resolve()
            return
        }

        var newSensor = this.sensors.find { it.type == type }

        if (newSensor == null) {
            newSensor = SensorInstance(::notifyListeners, type, delay)
            this.sensors.add(newSensor)
        }

        call.resolve(newSensor.init())
    }

    private fun isPresent(sensor: SensorType): Boolean {
        return sensorsManager?.getDefaultSensor(sensor.type) != null
    }

    @PluginMethod
    fun getAvailableSensors(call: PluginCall) {
        val sensorsList = sensorsManager?.getSensorList(Sensor.TYPE_ALL)?.map { it.type } ?: listOf()
        val list = JSArray(sensorsList)
        val ret = JSObject()
        ret.put("sensors", list)
        call.resolve(ret)
    }

    @PluginMethod
    fun start(call: PluginCall) {
        val sensor = call.data.getInt("type").toEnum<SensorType>()!!
        this.sensors.find { it.type == sensor }?.start()
    }

    @PluginMethod
    override fun requestPermissions(call: PluginCall) {
        call.unimplemented("There is no need of permissions for the sensors in Android!")
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        val sensor = call.data.getInt("type").toEnum<SensorType>()!!
        this.sensors.find { it.type == sensor }?.stop()
    }
}