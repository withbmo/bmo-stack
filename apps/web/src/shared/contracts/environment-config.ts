export type EnvironmentConfig = EnvironmentConfig1 & EnvironmentConfig2;
export type EnvironmentConfig1 = {
  [k: string]: unknown;
};

export interface EnvironmentConfig2 {
  schema_version: 1;
  instanceType: 'on-demand' | 'spot';
  configMode: 'preset' | 'custom';
  zone: 'us-east-1a' | 'us-east-1b' | 'eu-west-1a';
  serverPresetId?: string | null;
  serverPreset?: ServerPreset | null;
  custom?: CustomConfig | null;
  envVars: EnvVar[];
}
export interface ServerPreset {
  id: string;
  label: string;
  region: string;
  cpu: string;
  memory: string;
  storage: string;
  network: string;
}
export interface CustomConfig {
  cpuCores: number;
  memory: CustomMemory;
  storage: CustomStorage;
  network: CustomNetwork;
}
export interface CustomMemory {
  size: number;
  unit: 'GB' | 'TB';
}
export interface CustomStorage {
  size: number;
  unit: 'GB' | 'TB';
  type: 'SSD' | 'HDD';
}
export interface CustomNetwork {
  speed: number;
  unit: 'Gbps' | 'Mbps';
}
export interface EnvVar {
  key: string;
  value: string;
}
