import { MetricsAPITargets, MetricsStratosInfo } from '../actions/metrics-api.actions';
import { EndpointType } from '../extension-types';

export const endpointListKey = 'endpoint-list';
export interface INewlyConnectedEndpointInfo {
  account: string;
  admin: boolean;
  api_endpoint: IApiEndpointInfo;
  token_expiry: number;
  user: EndpointUser;
}

export interface IApiEndpointInfo {
  ForceQuery: boolean;
  Fragment: string;
  Host: string;
  Opaque: string;
  Path: string;
  RawPath: string;
  RawQuery: string;
  Scheme: string;
  User: object;
}
export type endpointConnectionStatus = 'connected' | 'disconnected' | 'unknown' | 'checking';
export interface EndpointModel {
  api_endpoint?: IApiEndpointInfo;
  authorization_endpoint?: string;
  cnsi_type?: EndpointType;
  sub_type?: string;
  doppler_logging_endpoint?: string;
  guid?: string;
  name: string;
  skip_ssl_validation?: boolean;
  endpoint_metadata?: any;
  token_endpoint?: string;
  client_id?: string;
  user?: EndpointUser;
  metadata?: {
    metrics?: string;
    metrics_job?: string;
    metrics_environment?: string;
    metrics_targets?: MetricsAPITargets;
    metrics_stratos?: MetricsStratosInfo;
    userInviteAllowed?: 'true' | any;
  };
  system_shared_token: boolean;
  sso_allowed: boolean;
  // These are generated client side when we login
  connectionStatus?: endpointConnectionStatus;
  metricsAvailable: boolean;
  local?: true;
  created_by: string;
}

export const SystemSharedUserGuid = '00000000-1111-2222-3333-444444444444';

export type UserScopeStrings = string;

// Metadata for the user connected to an endpoint
export interface EndpointUser {
  guid: string;
  name: string;
  admin: boolean;
  scopes?: UserScopeStrings[];
}

export interface EndpointState {
  loading: boolean;
  error: boolean;
  message: string;
}

export interface StateUpdateAction {
  type: string;
  guid: string;
  endpointType?: EndpointType;
}
