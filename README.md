# @dongminyu/segway-ble-manager
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAndrewDongminYoo%2Fsegway-ble-manager.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FAndrewDongminYoo%2Fsegway-ble-manager?ref=badge_shield)


`react-native-segway-ble-manager` is a React Native library for managing Bluetooth Low Energy (BLE) connections with Segway devices.
`react-native-segway-ble-manager` provides an easy-to-use API for connecting to and communicating with Segway devices over BLE.
The library supports both Android and iOS platforms and includes features such as device discovery, connection management, and data transfer.
With `react-native-segway-ble-manager`, developers can easily integrate Segway device control into their React Native applications.

## Project Overview

This project is an extreme enhancement of a previously existing native module at our company. The previous module imported all methods directly from an imported module. Additionally, it wasn't type-safe, causing some errors. So I tried improving the module, and created a new native module that uses the new architecture of React Native. This module allows developers to connect to Segway vehicles, query and manipulate vehicle information, and subscribe to events generated by the device.

## Installation

```shell
# if you use pure npm (what a classic!),
npm install @dongminyu/react-native-segway-ble-manager
```

```shell
# or if you prefer to use Yarn (I love it's parallel install feature),
yarn add @dongminyu/react-native-segway-ble-manager
```

```shell
# or if you use pnpm (it's fast and efficient),
pnpm add @dongminyu/react-native-segway-ble-manager
```

## Permission Setting

- in iOS

  ```xml
      <!-- iOS 13 and newer, include the `NSBluetoothAlwaysUsageDescription` -->
      <key>NSBluetoothAlwaysUsageDescription</key>
      <string>Use Bluetooth when it needs to control the scooter</string>
      <!-- iOS 12 and earlier, include `NSBluetoothPeripheralUsageDescription` -->
      <key>NSBluetoothPeripheralUsageDescription</key>
      <string>Use Bluetooth peripherals to control the scooter</string>
      <key>NSLocationWhenInUseUsageDescription</key>
      <string>Accesses location data to measure the distance</string>
  ```

- Android 설정

  ```xml
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.BLUETOOTH" />
  <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
  <uses-feature
    android:name="android.hardware.bluetooth_le"
    android:required="true" />
  ```

## Simple Example Code

Here's an example code snippet that demonstrates how to use the `react-native-segway-ble-manager` module to connect to a Segway vehicle, unlock it, and then disconnect from it:

```typescript
import {
  connect,
  disconnect,
  init,
  openBatteryCover,
  openSaddle,
  openTailBox,
  queryVehicleInformation,
  queryIoTInformation,
} from '@dongminyu/segway-ble-manager';

const BLE_INIT_SECRET_KEY = 'MY_SECRET_KEY';
const BLE_INIT_OPERATION_CODE = 'MY_OPERATOR_CODE';
const deviceMac = 'DEVICE_MAC_ADDRESS';
const deviceKey = 'DEVICE_KEY';
const iotImei = 'IOT_IMEI';

React.useEffect(() => {
  init(BLE_INIT_SECRET_KEY, BLE_INIT_OPERATION_CODE, true);
  // get required permissions
  getRequiredPermissions();
}, []);

React.useEffect(() => {
  let intervalId: number;
  if (timer > 0) {
    intervalId = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);
  }
  return () => {
    setLoading(false);
    return clearInterval(intervalId);
  };
}, [timer]);
```

In this example, we first import the necessary modules, including the `Spec` interface from the `react-native-segway-ble-manager` module. We then create a new instance of the `NativeEventEmitter` class, passing in the `BleManager` module as an argument.

Next, we define some configuration variables, such as the `secretKey`, `operatorCode`, `deviceMac`, `deviceKey`, and `iotImei`. We then initialize the `BleManager` module, passing in the `secretKey`, `operatorCode`, and a boolean value indicating whether to use debug mode.

Once the `BleManager` is initialized, we call the `connect` method, passing in the `deviceMac`, `deviceKey`, and `iotImei`. We then define two event listeners, one for when the Segway vehicle is connected (`onConnected`), and one for when it is disconnected (`onDisconnected`).

When the Segway vehicle is connected, we call the `unLock` method to unlock it. Once it is unlocked, we log a message to the console, and then call the `disconnect` method to disconnect from the vehicle.

Finally, when the vehicle is disconnected, we log another message to the console and remove the event listeners to prevent memory leaks.

This is just a simple example, but it should give you an idea of how the `react-native-segway-ble-manager` module can be used to connect to and control a Segway vehicle.

## Type Definition and Backward Compatibility

The New Architecture actually provides high-performance native modules that are supported by React Native version 0.69 and above, but cannot be imported from old-versioned environments. To compensate for this, we've prepared some backward compatibility settings.

This is a description of how we implemented them, and is not a requirement to use the modules. However, the New Architecture (Fabric, TurboModule) is Facebook's answer to various technical performance requests from the developers of React Native, so it is certain that more application projects and ReactNative libraries will be developed using it in the future.

```typescript
/// index.tsx
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const SegwayBleManagerModule = isTurboModuleEnabled
  ? require('./NativeSegwayBleManager').default
  : NativeModules.SegwayBleManager;
```

The above Typescript code is part of the code that bridges to the JavaScript application. It checks to see if turboModuleProxy is declared as a property of the Global variable (it's a double underbar variable that JavaScript doesn't explicitly declare; it's injected from the C++ module), checks to see if the application has New Architecture enabled, and if so, it takes the form of fetching the module that extends TurboModule by index from NativeModules, otherwise. There is a difference in performance, but all other behavior and data types match.

```groovy
android {
   sourceSets {
      main {
         jniLibs.srcDirs += ["lib"]
         //noinspection GroovyImplicitNullArgumentCall
         if (isNewArchitectureEnabled()) {
            java.srcDirs += [
               "src/newarch",
               // This is needed to build Kotlin project with NewArch enabled
               "${project.buildDir}/generated/source/codegen/java"
            ]
         } else {
            java.srcDirs += ["src/oldarch"]
         }
      }
   }
}
```

The code above is part of the Android build script file. isNewArchitectureEnabled checks to see if the new architecture variable is set to true from the environment variables, and then imports the NativeModuleSpec abstract class from the new arch directory in the src folder and the configuration files from ReactNativeCodeGen. If it returns false, the abstract classes in old arch declared by the developer directly are imported. The two classes have exactly the same name and key properties, but the internal implementation differs from the turbo module.

```diagram
android
├─ build.gradle
├─ gradle.properties
└─ src
   ├─ main
   │  ├─ AndroidManifest.xml
   │  ├─ java
   │  │  └─ com
   │  │    └─ gBike
   │  │       └─ segwayBleManager
   │  │        ├─ SegwayBleManagerModule.kt
   │  │        └─ SegwayBleManagerPackage.kt
   │  └─ newArch
   │      └─ SegwayBleManagerSpec.kt
   └──── oldArch
          └─ SegwayBleManagerSpec.kt
/// no need to think about to implement which class.
```

The diagram above represents the actual structure of that directory. Both interfaces have the name SegwayBleManagerSpec.kt and depending on your setup, SegwayBleManagerModule.kt is imported with just a simple class name.

## Vehicle & IoT Module Status

This code is written in TypeScript and defines several interfaces for a vehicle's information and an IoT device's information. It also includes an enumeration for supported event names.

The `Scooter` interface defines the properties for a scooter, such as its number, device MAC address, device key, and IMEI.

```typescript
export interface Scooter {
  number: string;
  deviceMac: string;
  deviceKey: string;
  iotImei: string;
}
```

The `VehicleInfo` interface defines the properties for a vehicle's information, such as the percentage value of battery, speed mode, current speed, total range, and remaining range. It also includes some deprecated properties that are available in Android but will be deprecated in Java and don't exist in iOS. These deprecated properties are replaced by new properties such as `powerPercent` and `speedMode`.

```typescript
export interface VehicleInfo {
  powerPercent: number;
  speedMode: number;
  currentSpeed: number;
  totalRange: number;
  remainingRange: number;
}
```

The `IoTInformation` interface defines the properties for an IoT device's information, such as low and high voltage of the battery, power status, and version numbers. It also includes some deprecated properties that will be deprecated in Java or iOS and are replaced by new properties such as `majorVersionNumber`, `minorVersionNumber`, and `updateTimes`.

```typescript
export interface IoTInformation {
  lowBatteryVoltage: number;
  highBatteryVoltage: number;
  powerStatus: number;
  majorVersionNumber: number;
  minorVersionNumber: number;
  versionRevisions: number;
  modifiedTimes: number;
  updateTimes: number;
  isLocked: boolean;
  voltage: number;
}
```

Finally, the `EventNames` enumeration defines the supported event names, which must be the same as the native module's event names.

```typescript
export enum Events {
  CONNECT = 'ConnectResult',
  DISCONNECT = 'DisconnectResult',
  INITIALIZE = 'InitializeResult',
  IOT_INFO = 'IoTInfoResult',
  LOCK = 'LockResult',
  OPEN_COVER = 'OpenCoverResult',
  OPEN_SADDLE = 'OpenSaddleResult',
  OPEN_TAIL_BOX = 'OpenTailBoxResult',
  UNLOCK = 'UnlockResult',
  VEHICLE_INFO = 'VehicleInfoResult',
}
```

## Detail of Interfaces

The module's interface consists of the following methods:

### `getConstants()`

This method returns a constant object with the following properties:

- `supportedEvents`: an array of supported event types
- `moduleName`: the name of the module

### `init(secretKey: string, operatorCode: string, isDebug: boolean): Promise<boolean>`

This method initializes the module with the secret key, operator code, and a flag to indicate whether the module should run in debug mode. It returns a promise that resolves to a boolean value indicating whether initialization was successful.

### `connect(deviceMac: string, deviceKey: string, iotImei: string): void`

This method establishes a connection to the Segway vehicle with the specified MAC address, device key, and IoT IMEI.

### `disconnect(): Promise<boolean>`

This method disconnects from the Segway vehicle and returns a promise that resolves to a boolean value indicating whether disconnection was successful.

### `unLock(): Promise<boolean>`

This method unlocks the Segway vehicle and returns a promise that resolves to a boolean value indicating whether unlocking was successful.

### `lock(): Promise<boolean>`

This method locks the Segway vehicle and returns a promise that resolves to a boolean value indicating whether locking was successful.

### `openBatteryCover(): Promise<boolean>`

This method opens the battery cover of the Segway vehicle and returns a promise that resolves to a boolean value indicating whether the operation was successful.

### `openSaddle(): Promise<boolean>`

This method opens the saddle of the Segway vehicle and returns a promise that resolves to a boolean value indicating whether the operation was successful.

### `openTailBox(): Promise<boolean>`

This method opens the tail box of the Segway vehicle and returns a promise that resolves to a boolean value indicating whether the operation was successful.

### `queryVehicleInformation(listener): void`

This method queries the Segway vehicle for information about the device, such as the firmware version, serial number, and battery level.

### `queryIoTInformation(listener): void`

This method queries the Segway vehicle for IoT information, such as the device's network status, signal strength, and IMEI.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAndrewDongminYoo%2Fsegway-ble-manager.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FAndrewDongminYoo%2Fsegway-ble-manager?ref=badge_large)