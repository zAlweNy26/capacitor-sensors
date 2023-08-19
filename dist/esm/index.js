import { registerPlugin } from '@capacitor/core';
const Sensors = registerPlugin('Sensors', {
    web: () => import('./web').then((m) => new m.SensorsWeb()),
});
export * from './definitions';
export { Sensors };
//# sourceMappingURL=index.js.map