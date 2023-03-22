import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getConstants?(): {
    supportedEvents: string[];
    moduleName: string;
  };
  init(secretKey: string, operatorCode: string, isDebug: boolean): void;
  connect(bleMac: string, bleKey: string, iotImei: string): boolean;
  disconnect(): boolean;
  unLock(): boolean;
  lock(): boolean;
  openBatteryCover(): boolean;
  openSaddle(): boolean;
  openTailBox(): boolean;
  queryVehicleInformation(): void;
  queryIotInformation(): void;
  addListener(eventType: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SegwayBleManager') as Spec;
