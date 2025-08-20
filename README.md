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
* [`requestPermissions(...)`](#requestpermissions)
* [`start(...)`](#start)
* [`stop(...)`](#stop)
* [`addListener(...)`](#addlistener)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### init(...)

```typescript
init(options: SensorOptions) => Promise<SensorData | undefined>
```

| Param         | Type                                                    |
| ------------- | ------------------------------------------------------- |
| **`options`** | <code><a href="#sensoroptions">SensorOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#sensordata">SensorData</a>&gt;</code>

--------------------


### getAvailableSensors()

```typescript
getAvailableSensors() => Promise<{ sensors: SensorType[]; }>
```

**Returns:** <code>Promise&lt;{ sensors: SensorType[]; }&gt;</code>

--------------------


### requestPermissions(...)

```typescript
requestPermissions(sensor: SensorData) => Promise<WebPermissionStatus>
```

| Param        | Type                                              |
| ------------ | ------------------------------------------------- |
| **`sensor`** | <code><a href="#sensordata">SensorData</a></code> |

**Returns:** <code>Promise&lt;<a href="#webpermissionstatus">WebPermissionStatus</a>&gt;</code>

--------------------


### start(...)

```typescript
start(sensor: SensorData) => Promise<void>
```

| Param        | Type                                              |
| ------------ | ------------------------------------------------- |
| **`sensor`** | <code><a href="#sensordata">SensorData</a></code> |

--------------------


### stop(...)

```typescript
stop(sensor: SensorData) => Promise<void>
```

| Param        | Type                                              |
| ------------ | ------------------------------------------------- |
| **`sensor`** | <code><a href="#sensordata">SensorData</a></code> |

--------------------


### addListener(...)

```typescript
addListener(eventName: SensorEvent, listenerFunc: (event: SensorResult) => void) => Promise<PluginListenerHandle>
```

| Param              | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code><a href="#sensorevent">SensorEvent</a></code> |
| **`listenerFunc`** | <code>(event: <a href="#SensorResult">SensorResult</a>) =&gt; void</code>                                                                                                                                                                                                                                                                                                                                                                                                 |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

--------------------


### Interfaces


#### SensorData

| Prop        | Type                                                |
| ----------- | --------------------------------------------------- |
| **`infos`** | <code><a href="#sensorinfos">SensorInfos</a></code> |


#### SensorInfos

| Prop             | Type                |
| ---------------- | ------------------- |
| **`vendor`**     | <code>string</code> |
| **`version`**    | <code>number</code> |
| **`type`**       | <code>number</code> |
| **`maxRange`**   | <code>number</code> |
| **`resolution`** | <code>number</code> |
| **`power`**      | <code>number</code> |
| **`minDelay`**   | <code>number</code> |
| **`maxDelay`**   | <code>number</code> |


#### SensorOptions

| Prop        | Type                                                |
| ----------- | --------------------------------------------------- |
| **`type`**  | <code><a href="#sensortype">SensorType</a></code>   |
| **`delay`** | <code><a href="#sensordelay">SensorDelay</a></code> |


#### WebPermissionStatus

| Prop                         | Type                                                        |
| ---------------------------- | ----------------------------------------------------------- |
| **`accelerometer`**          | <code><a href="#permissionstate">PermissionState</a></code> |
| **`'ambient-light-sensor'`** | <code><a href="#permissionstate">PermissionState</a></code> |
| **`gyroscope`**              | <code><a href="#permissionstate">PermissionState</a></code> |
| **`magnetometer`**           | <code><a href="#permissionstate">PermissionState</a></code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### SensorResult

| Prop            | Type                  |
| --------------- | --------------------- |
| **`accuracy`**  | <code>number</code>   |
| **`timestamp`** | <code>number</code>   |
| **`values`**    | <code>number[]</code> |


### Type Aliases


#### PermissionState

<code>'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'</code>


#### SensorEvent

<code>keyof typeof <a href="#sensortype">SensorType</a></code>


### Enums


#### SensorType

| Members                           |
| --------------------------------- |
| **`AMBIENT_LIGHT`**               |
| **`ACCELEROMETER`**               |
| **`TEMPERATURE`**                 |
| **`GAME_ROTATION_VECTOR`**        |
| **`GEOMAGNETIC_ROTATION_VECTOR`** |
| **`GRAVITY`**                     |
| **`GYROSCOPE`**                   |
| **`HEART_BEAT`**                  |
| **`HEART_RATE`**                  |
| **`LINEAR_ACCELERATION`**         |
| **`MAGNETOMETER`**                |
| **`MOTION_DETECTOR`**             |
| **`POSE_6DOF`**                   |
| **`PRESSURE`**                    |
| **`PROXIMITY`**                   |
| **`RELATIVE_HUMIDITY`**           |
| **`ROTATION_VECTOR`**             |
| **`SIGNIFICANT_MOTION`**          |
| **`STATIONARY_DETECTOR`**         |
| **`STEP_COUNTER`**                |
| **`STEP_DETECTOR`**               |
| **`ABSOLUTE_ORIENTATION`**        |
| **`RELATIVE_ORIENTATION`**        |


#### SensorDelay

| Members       |
| ------------- |
| **`FASTEST`** |
| **`GAME`**    |
| **`UI`**      |
| **`NORMAL`**  |

</docgen-api>
