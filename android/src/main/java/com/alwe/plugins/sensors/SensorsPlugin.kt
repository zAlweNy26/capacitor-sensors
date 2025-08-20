package com.alwe.plugins.sensors

import android.Manifest
import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorManager
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission


@CapacitorPlugin(
    name = "Sensors",
    permissions = [
        Permission(
            alias = "sensors",
            strings = [
                Manifest.permission.BODY_SENSORS,
                Manifest.permission.ACTIVITY_RECOGNITION
            ]
        )
    ]
)
class SensorsPlugin : Plugin() {
    private var sensors: ArrayList<PluginSensor> = arrayListOf()

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

        if (!isPresent(type)) {
            call.resolve()
            return
        }

        var newSensor = this.sensors.find { it.type == type }

        if (newSensor == null) {
            newSensor = if (type == SensorType.ABSOLUTE_ORIENTATION || type == SensorType.RELATIVE_ORIENTATION) {
                Orientation(this, type, delay)
            } else {
                SensorInstance(this, type, delay)
            }
            this.sensors.add(newSensor)
        }

        call.resolve(newSensor.init())
    }

    fun notify(eventName: String, data: JSObject, retainUntilConsumed: Boolean): Unit {
        return notifyListeners(eventName, data, retainUntilConsumed)
    }

    private fun isPresent(sensor: SensorType): Boolean {
        return sensorsManager?.getDefaultSensor(sensor.type) != null
    }

    @PluginMethod
    fun getAvailableSensors(call: PluginCall) {
        val sensorsList = sensorsManager?.getSensorList(Sensor.TYPE_ALL)?.map { SensorType.fromInt(it.type)?.ordinal } ?: listOf()
        val list = JSArray(sensorsList)
        val ret = JSObject()
        ret.put("sensors", list)
        call.resolve(ret)
    }

    @PluginMethod
    fun start(call: PluginCall) {
        val sensor = call.data.getInt("type").toEnum<SensorType>()
        
        if (sensor == null) {
            call.reject("Invalid sensor type")
            return
        }
        
        val sensorInstance = this.sensors.find { it.type == sensor }
        
        if (sensorInstance == null) {
            call.reject("Sensor not initialized. Call init() first.")
            return
        }
        
        sensorInstance.start()
        call.resolve()
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        val sensor = call.data.getInt("type").toEnum<SensorType>()
        
        if (sensor == null) {
            call.reject("Invalid sensor type")
            return
        }
        
        val sensorInstance = this.sensors.find { it.type == sensor }
        
        if (sensorInstance == null) {
            call.reject("Sensor not found or not initialized")
            return
        }
        
        sensorInstance.stop()
        call.resolve()
    }
}