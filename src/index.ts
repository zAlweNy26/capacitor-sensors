import { registerPlugin } from '@capacitor/core';

import type { SensorsPlugin } from './definitions';

const Sensors = registerPlugin<SensorsPlugin>('Sensors', {
  web: () => import('./web').then((m) => new m.SensorsWeb()),
});

export * from './definitions';
export { Sensors };
