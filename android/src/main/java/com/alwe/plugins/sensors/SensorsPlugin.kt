package com.alwe.plugins.sensors

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorManager
import android.util.Log
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin


@CapacitorPlugin(name = "Sensors")
class SensorsPlugin : Plugin() {
    private var sensors: ArrayList<SensorInstance> = arrayListOf()
    private var sensorsManager: SensorManager? = null
    
    @PluginMethod
    fun init(call: PluginCall) {
        val type = call.getInt("type")?.toEnum<SensorType>()!!
        val delay = call.getInt("delay", 3)?.toEnum<SensorDelay>()!!

        if (!isPresent(type.toInt())) {
            call.resolve()
            return
        }

        this.sensors.add(SensorInstance(::notifyListeners, sensorsManager!!, type, delay))

        call.resolve(this.sensors.last().init())
    }

    private fun isPresent(sensor: Int): Boolean {
        if (sensorsManager == null) {
            sensorsManager = this.context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        }
        val realEnum = sensorsMap[sensor.toEnum()] ?: return false
        return sensorsManager?.getDefaultSensor(realEnum) != null
    }

    @PluginMethod
    fun getAvailableSensors(call: PluginCall) {
        if (sensorsManager == null) {
            sensorsManager = this.context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        }
        val sensorsList = sensorsManager?.getSensorList(Sensor.TYPE_ALL)?.map { it.type } ?: listOf()
        val list = JSArray(sensorsList)
        val ret = JSObject()
        ret.put("sensors", list)
        call.resolve(ret)
    }

    @PluginMethod
    fun start(call: PluginCall) {
        val sensor = call.data.getString("type")
        this.sensors.find { it.type.name == sensor }?.start()
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        val sensor = call.data.getString("type")
        this.sensors.find { it.type.name == sensor }?.stop()
    }
}