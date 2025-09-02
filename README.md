# Capacitor Plugin - Sensors

Get access to every sensor present in the device!

Supported Android version: `23+`\
Supported iOS version: `Not supported`\
Supported Browsers: `Chromium-based`

## Install

```bash
npm install @danyalwe/capacitor-sensors
npx cap sync
```

If you want to use the **`HEART_BEAT`** or **`HEART_RATE`** sensor, you need to request the `BODY_SENSORS` permission in your app:

```xml
<uses-permission android:name="android.permission.BODY_SENSORS" />
```

If you want to use the **`STEP_COUNTER`** or **`STEP_DETECTOR`** sensor, you need to request the `ACTIVITY_RECOGNITION` permission in your app:

```xml
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
```

## Example

The following example demonstrates how to use the Sensors plugin to access the device's accelerometer:

```ts
import { Sensors } from '@danyalwe/capacitor-sensors';

// Initialize the specific sensor and obtain 
const sensor = await Sensors.init({ type: SensorType.ACCELEROMETER });

// Start the sensor to begin receiving data
await Sensors.start({ type: SensorType.ACCELEROMETER });

// Add a listener to receive accelerometer data
Sensors.addListener('ACCELEROMETER', (data) => {
  console.log('Accelerometer data:', data);
});
```

## Todos

- [ ] Add support for iOS

## Supported methods

| Name                | Android | iOS | Web |
| :------------------ | :------ | :-- | :-- |
| init                | ✅      | ❌  | ✅  |
| getAvailableSensors | ✅      | ❌  | ✅  |
| start               | ✅      | ❌  | ✅  |
| stop                | ✅      | ❌  | ✅  |
| addListener         | ✅      | ❌  | ✅  |
| removeAllListeners  | ✅      | ❌  | ✅  |
| requestPermissions  | ✅      | ❌  | ✅  |

## Supported sensors

| Sensors                           | Android | iOS | Web |
| :-------------------------------- | :------ | :-- | :-- |
| **`MOTION_DETECTOR`**             | ✅      | ❌  | ✅  |
| **`LINEAR_ACCELERATION`**         | ✅      | ❌  | ✅  |
| **`MAGNETOMETER`**                | ✅      | ❌  | ✅  |
| **`GRAVITY`**                     | ✅      | ❌  | ✅  |
| **`GYROSCOPE`**                   | ✅      | ❌  | ✅  |
| **`AMBIENT_LIGHT`**               | ✅      | ❌  | ✅  |
| **`ACCELEROMETER`**               | ✅      | ❌  | ✅  |
| **`ABSOLUTE_ORIENTATION`**        | ✅      | ❌  | ✅  |
| **`RELATIVE_ORIENTATION`**        | ✅      | ❌  | ✅  |
| **`TEMPERATURE`**                 | ✅      | ❌  | ❌  |
| **`GAME_ROTATION_VECTOR`**        | ✅      | ❌  | ❌  |
| **`GEOMAGNETIC_ROTATION_VECTOR`** | ✅      | ❌  | ❌  |
| **`HEART_BEAT`**                  | ✅      | ❌  | ❌  |
| **`HEART_RATE`**                  | ✅      | ❌  | ❌  |
| **`POSE_6DOF`**                   | ✅      | ❌  | ❌  |
| **`PRESSURE`**                    | ✅      | ❌  | ❌  |
| **`PROXIMITY`**                   | ✅      | ❌  | ❌  |
| **`RELATIVE_HUMIDITY`**           | ✅      | ❌  | ❌  |
| **`ROTATION_VECTOR`**             | ✅      | ❌  | ❌  |
| **`SIGNIFICANT_MOTION`**          | ✅      | ❌  | ❌  |
| **`STATIONARY_DETECTOR`**         | ✅      | ❌  | ❌  |
| **`STEP_COUNTER`**                | ✅      | ❌  | ❌  |
| **`STEP_DETECTOR`**               | ✅      | ❌  | ❌  |

## API

<docgen-index>

* [`init(...)`](#init)
* [`getAvailableSensors()`](#getavailablesensors)
* [`checkPermissions()`](#checkpermissions)
* [`requestPermissions(...)`](#requestpermissions)
* [`start(...)`](#start)
* [`stop(...)`](#stop)
* [`addListener(any, ...)`](#addlistenerany-)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

The Sensors Plugin interface.

### init(...)

```typescript
init(options: SensorOptions) => any
```

Initializes the sensor plugin with the given options.

| Param         | Type                                                    | Description                                       |
| ------------- | ------------------------------------------------------- | ------------------------------------------------- |
| **`options`** | <code><a href="#sensoroptions">SensorOptions</a></code> | The options to initialize the sensor plugin with. |

**Returns:** <code>any</code>

--------------------


### getAvailableSensors()

```typescript
getAvailableSensors() => any
```

Gets a list of available sensors.

**Returns:** <code>any</code>

--------------------


### checkPermissions()

```typescript
checkPermissions() => any
```

Checks the permissions for the given sensor.

**Returns:** <code>any</code>

--------------------


### requestPermissions(...)

```typescript
requestPermissions(sensor: SensorOptions) => any
```

Requests permission to use the given sensor.

| Param        | Type                                                    | Description                           |
| ------------ | ------------------------------------------------------- | ------------------------------------- |
| **`sensor`** | <code><a href="#sensoroptions">SensorOptions</a></code> | The sensor to request permission for. |

**Returns:** <code>any</code>

--------------------


### start(...)

```typescript
start(options: { type: SensorType; }) => any
```

Starts the given sensor.

| Param         | Type                        |
| ------------- | --------------------------- |
| **`options`** | <code>{ type: any; }</code> |

**Returns:** <code>any</code>

--------------------


### stop(...)

```typescript
stop(options: { type: SensorType; }) => any
```

Stops the given sensor.

| Param         | Type                        |
| ------------- | --------------------------- |
| **`options`** | <code>{ type: any; }</code> |

**Returns:** <code>any</code>

--------------------


### addListener(any, ...)

```typescript
addListener(eventName: any, listenerFunc: (event: SensorResult) => void) => any
```

Adds a listener for the given sensor event.

| Param              | Type                                                                      | Description                                       |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------------------------- |
| **`eventName`**    | <code>any</code>                                                          | The name of the event to listen for.              |
| **`listenerFunc`** | <code>(event: <a href="#sensorresult">SensorResult</a>) =&gt; void</code> | The function to call when the event is triggered. |

**Returns:** <code>any</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => any
```

Removes all listeners for the sensor plugin.

**Returns:** <code>any</code>

--------------------


### Interfaces


#### SensorOptions

Represents the options for a sensor.

| Prop        | Type                                                | Description                        |
| ----------- | --------------------------------------------------- | ---------------------------------- |
| **`type`**  | <code><a href="#sensortype">SensorType</a></code>   | The type of sensor to use.         |
| **`delay`** | <code><a href="#sensordelay">SensorDelay</a></code> | The delay between sensor readings. |


#### SensorData

Represents the data returned by a sensor, including any additional information about the sensor.

| Prop        | Type                                                |
| ----------- | --------------------------------------------------- |
| **`infos`** | <code><a href="#sensorinfos">SensorInfos</a></code> |


#### SensorInfos

Interface representing sensor information.

| Prop             | Type                | Description                                                |
| ---------------- | ------------------- | ---------------------------------------------------------- |
| **`name`**       | <code>string</code> | The name of the sensor.                                    |
| **`vendor`**     | <code>string</code> | The vendor of the sensor.                                  |
| **`version`**    | <code>number</code> | The version of the sensor.                                 |
| **`type`**       | <code>number</code> | The type of the sensor.                                    |
| **`maxRange`**   | <code>number</code> | The maximum range of the sensor in sensor units.           |
| **`resolution`** | <code>number</code> | The resolution of the sensor in sensor units.              |
| **`power`**      | <code>number</code> | The power consumption of the sensor in milliamperes.       |
| **`minDelay`**   | <code>number</code> | The minimum delay between sensor readings in microseconds. |
| **`maxDelay`**   | <code>number</code> | The maximum delay between sensor readings in microseconds. |


#### PermissionStatus

Interface representing the permission status for various web sensors.

| Prop                         | Type                                                        |
| ---------------------------- | ----------------------------------------------------------- |
| **`accelerometer`**          | <code><a href="#permissionstate">PermissionState</a></code> |
| **`'ambient-light-sensor'`** | <code><a href="#permissionstate">PermissionState</a></code> |
| **`gyroscope`**              | <code><a href="#permissionstate">PermissionState</a></code> |
| **`magnetometer`**           | <code><a href="#permissionstate">PermissionState</a></code> |


#### SensorResult

Represents the result of a sensor reading.

| Prop            | Type                | Description                                        |
| --------------- | ------------------- | -------------------------------------------------- |
| **`accuracy`**  | <code>number</code> | The accuracy of the sensor reading, if available.  |
| **`timestamp`** | <code>number</code> | The timestamp of the sensor reading, if available. |
| **`values`**    | <code>{}</code>     | The values obtained from the sensor reading.       |


#### PluginListenerHandle

| Prop         | Type                      |
| ------------ | ------------------------- |
| **`remove`** | <code>() =&gt; any</code> |


### Type Aliases


#### SensorType

<code>(typeof SensorTypes)[number]</code>


#### SensorDelay

<code>(typeof SensorDelays)[number]</code>


#### PermissionState

<code>'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'</code>

</docgen-api>
