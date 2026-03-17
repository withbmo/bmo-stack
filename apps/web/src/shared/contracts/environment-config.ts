export type ConfigMode = 'preset' | 'custom';
export type Ec2Architecture = 'x86_64' | 'arm64';
export type MarketType = 'on-demand' | 'spot';
export type RootVolumeType = 'gp3' | 'st1' | 'sc1';

export interface ServerPreset {
  id: string;
  label: string;
  region: string;
  instanceType: string;
  cpu: string;
  memory: string;
  storage: string;
  network: string;
}

export type EnvironmentConfig = EnvironmentConfig1 & EnvironmentConfig2;
export type EnvironmentConfig1 = {
  [k: string]: unknown;
};

export interface EnvironmentConfig2 {
  schema_version: 1;
  // Legacy key: originally used as market type. Keep for backward compatibility.
  instanceType: MarketType;
  // Preferred key: market type.
  marketType?: MarketType;
  configMode: ConfigMode;
  zone: 'us-east-1a' | 'us-east-1b' | 'eu-west-1a';
  architecture?: Ec2Architecture;
  /** Used in custom mode to launch exact EC2 instance type (e.g. "t3.small"). */
  ec2InstanceType?: string | null;
  rootVolume?: { sizeGiB: number; type: RootVolumeType };
  serverPresetId?: string | null;
  serverPreset?: ServerPreset | null;
  custom?: CustomConfig | null;
  envVars: EnvVar[];
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
