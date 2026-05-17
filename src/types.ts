export type DeviceType = 'temperature' | 'humidity' | 'power' | 'motion';
export type DeviceStatus = 'online' | 'offline' | 'alert';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  lastSeen: string;
  ownerId: string;
  assetId?: string;
  latestValues: Record<string, any>;
  metadata: Record<string, any>;
}

export interface TelemetryPoint {
  deviceId: string;
  timestamp: string;
  values: Record<string, number>;
}

export interface Alert {
  id: string;
  deviceId: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
  ownerId: string;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  ownerId: string;
}
