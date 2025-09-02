import type { SensorsPlugin } from './definitions';

import { registerPlugin } from '@capacitor/core';

const Sensors = registerPlugin<SensorsPlugin>('Sensors', {
  web: () => import('./web').then((m) => new m.SensorsWeb()),
});

export * from './definitions';
export { Sensors };
