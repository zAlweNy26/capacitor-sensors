# Capacitor Plugin - Sensors

Get access to every sensor present in the device!

## Install

```bash
npm install @alwe/sensors
npx cap sync
```

## Todos

- [ ] Add iOS support
- [ ] Improve code readability

## API

<docgen-index>

* [`init(...)`](#init)
* [`getAvailableSensors()`](#getavailablesensors)
* [`requestPermissions(...)`](#requestpermissions)
* [`start(...)`](#start)
* [`stop(...)`](#stop)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### init(...)

```typescript
init(options: SensorOptions) => Promise<Sensor | undefined>
```

| Param         | Type                                                    |
| ------------- | ------------------------------------------------------- |
| **`options`** | <code><a href="#sensoroptions">SensorOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#sensor">Sensor</a>&gt;</code>

--------------------


### getAvailableSensors()

```typescript
getAvailableSensors() => Promise<{ sensors: (SensorType | WebSensorType)[]; }>
```

**Returns:** <code>Promise&lt;{ sensors: (<a href="#sensortype">SensorType</a> | <a href="#websensortype">WebSensorType</a>)[]; }&gt;</code>

--------------------


### requestPermissions(...)

```typescript
requestPermissions(sensor: Sensor) => Promise<WebPermissionStatus[]>
```

| Param        | Type                                      |
| ------------ | ----------------------------------------- |
| **`sensor`** | <code><a href="#sensor">Sensor</a></code> |

**Returns:** <code>Promise&lt;WebPermissionStatus[]&gt;</code>

--------------------


### start(...)

```typescript
start(sensor: Sensor) => Promise<void>
```

| Param        | Type                                      |
| ------------ | ----------------------------------------- |
| **`sensor`** | <code><a href="#sensor">Sensor</a></code> |

--------------------


### stop(...)

```typescript
stop(sensor: Sensor) => Promise<void>
```

| Param        | Type                                      |
| ------------ | ----------------------------------------- |
| **`sensor`** | <code><a href="#sensor">Sensor</a></code> |

--------------------


### Interfaces


#### Sensor

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

| Prop        | Type                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------- |
| **`type`**  | <code><a href="#sensortype">SensorType</a> \| <a href="#websensortype">WebSensorType</a></code> |
| **`delay`** | <code><a href="#sensordelay">SensorDelay</a></code>                                             |


#### WebPermissionStatus

| Prop                         | Type                                                        |
| ---------------------------- | ----------------------------------------------------------- |
| **`'accelerometer'`**        | <code><a href="#permissionstate">PermissionState</a></code> |
| **`'ambient-light-sensor'`** | <code><a href="#permissionstate">PermissionState</a></code> |
| **`'gyroscope'`**            | <code><a href="#permissionstate">PermissionState</a></code> |
| **`'magnetometer'`**         | <code><a href="#permissionstate">PermissionState</a></code> |


### Type Aliases


#### PermissionState

<code>'prompt' | 'prompt-with-rationale' | 'granted' | 'denied'</code>


### Enums


#### SensorType

| Members                           |
| --------------------------------- |
| **`LIGHT`**                       |
| **`ACCELEROMETER`**               |
| **`TEMPERATURE`**                 |
| **`GAME_ROTATION_VECTOR`**        |
| **`GEOMAGNETIC_ROTATION_VECTOR`** |
| **`GRAVITY`**                     |
| **`GYROSCOPE`**                   |
| **`HEART_BEAT`**                  |
| **`HEART_RATE`**                  |
| **`LINEAR_ACCELERATION`**         |
| **`MAGNETIC_FIELD`**              |
| **`MOTION_DETECT`**               |
| **`ORIENTATION`**                 |
| **`POSE_6DOF`**                   |
| **`PRESSURE`**                    |
| **`PROXIMITY`**                   |
| **`RELATIVE_HUMIDITY`**           |
| **`ROTATION_VECTOR`**             |
| **`SIGNIFICANT_MOTION`**          |
| **`STATIONARY_DETECT`**           |
| **`STEP_COUNTER`**                |
| **`STEP_DETECTOR`**               |


#### WebSensorType

| Members                    |
| -------------------------- |
| **`ACCELEROMETER`**        |
| **`AMBIENT_LIGHT`**        |
| **`GYROSCOPE`**            |
| **`MAGNETOMETER`**         |
| **`GRAVITY`**              |
| **`ABSOLUTE_ORIENTATION`** |
| **`LINEAR_ACCELERATION`**  |
| **`RELATIVE_ORIENTATION`** |


#### SensorDelay

| Members       |
| ------------- |
| **`FASTEST`** |
| **`GAME`**    |
| **`UI`**      |
| **`NORMAL`**  |

</docgen-api>
