export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SOS_ACTIVE = 'SOS_ACTIVE',
  EMERGENCY_OPS = 'EMERGENCY_OPS',
  OPS = 'OPS',
  PROFILE = 'PROFILE',
  FAKE_CALL = 'FAKE_CALL',
  PERMISSIONS_SETUP = 'PERMISSIONS_SETUP',
  ALERTS = 'ALERTS',
  COVERT_RECORD = 'COVERT_RECORD',
  SAFE_ROUTE = 'SAFE_ROUTE'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Guardian {
  id: string;
  name: string;
  location: Coordinates;
  status: 'active' | 'inactive';
}

export interface DangerZone {
  id: string;
  coords: Coordinates;
  radius: number;
  riskLevel: 'high' | 'moderate';
}