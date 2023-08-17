import { WebPlugin } from '@capacitor/core';

import type { SensorsPlugin } from './definitions';

export class SensorsWeb extends WebPlugin implements SensorsPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
