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
        val type = this.getSensorType(call.getString("type"))
        val delay = call.getInt("delay", 3)?.toEnum<SensorDelay>()!!

        if (type == null) {
            call.reject("Invalid sensor type")
            return
        }

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

    private fun getSensorType(typeStr: String?): SensorType? {
        return typeStr?.let {
            try {
                SensorType.valueOf(it)
            } catch (e: IllegalArgumentException) {
                null
            }
        }
    }

    private fun isPresent(sensor: SensorType): Boolean {
        if (sensor == SensorType.RELATIVE_ORIENTATION) {
            val accelerometerAvailable = sensorsManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER) != null
            val magnetometerAvailable = sensorsManager?.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD) != null
            return accelerometerAvailable && magnetometerAvailable
        }
        if (sensor == SensorType.ABSOLUTE_ORIENTATION) {
            val gravitySensorAvailable = sensorsManager?.getDefaultSensor(Sensor.TYPE_GRAVITY) != null
            val magnetometerAvailable = sensorsManager?.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD) != null
            return gravitySensorAvailable && magnetometerAvailable
        }
        return sensorsManager?.getDefaultSensor(sensor.type) != null
    }

    @PluginMethod
    fun getAvailableSensors(call: PluginCall) {
        val sensorsList = sensorsManager?.getSensorList(Sensor.TYPE_ALL)?.mapNotNull { SensorType.fromInt(it.type)?.name }?.distinct()?.toMutableList() ?: mutableListOf()
        if (sensorsList.contains(SensorType.MAGNETOMETER.name) && sensorsList.contains(SensorType.ACCELEROMETER.name)) sensorsList.add(SensorType.RELATIVE_ORIENTATION.name)
        if (sensorsList.contains(SensorType.MAGNETOMETER.name) && sensorsList.contains(SensorType.GRAVITY.name)) sensorsList.add(SensorType.ABSOLUTE_ORIENTATION.name)
        val list = JSArray(sensorsList)
        val ret = JSObject()
        ret.put("sensors", list)
        call.resolve(ret)
    }

    @PluginMethod
    fun start(call: PluginCall) {
        val type = this.getSensorType(call.getString("type"))
        
        if (type == null) {
            call.reject("Invalid sensor type")
            return
        }
        
        val sensorInstance = this.sensors.find { it.type == type }
        
        if (sensorInstance == null) {
            call.reject("Sensor not initialized. Call init() first.")
            return
        }
        
        sensorInstance.start()
        call.resolve()
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        val type = this.getSensorType(call.getString("type"))
        
        if (type == null) {
            call.reject("Invalid sensor type")
            return
        }
        
        val sensorInstance = this.sensors.find { it.type == type }
        
        if (sensorInstance == null) {
            call.reject("Sensor not found or not initialized")
            return
        }
        
        sensorInstance.stop()
        call.resolve()
    }
}