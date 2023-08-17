export interface SensorsPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
