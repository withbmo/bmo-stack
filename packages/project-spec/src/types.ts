export type StringMap = Record<string, string>;

export interface RuntimeSpec {
  modules: string[];
}

export interface DeploymentSpec {
  target: string;
  router: string;
  defaultEnvironment: string;
}

export interface ArtifactBuildSpec {
  command: string;
  outputDir?: string;
}

export interface ArtifactDevSpec {
  command?: string;
  port?: number;
}

export interface ArtifactSpec {
  id: string;
  kind: string;
  path: string;
  build?: ArtifactBuildSpec;
  dev?: ArtifactDevSpec;
  env: StringMap;
}

export interface ServiceRunSpec {
  command?: string;
  port?: number;
}

export interface ServiceStaticSpec {
  publicDir: string;
  spa: boolean;
  indexFile: string;
}

export interface HealthcheckSpec {
  path?: string;
  command?: string;
  intervalSeconds: number;
  timeoutSeconds: number;
}

export interface ServiceSpec {
  id: string;
  artifact: string;
  kind: string;
  public: boolean;
  env: StringMap;
  secrets: string[];
  run?: ServiceRunSpec;
  static?: ServiceStaticSpec;
  healthcheck?: HealthcheckSpec;
}

export interface RouteSpec {
  service: string;
  path: string;
  stripPrefix: boolean;
  host?: string;
}

export interface ResourceSpec {
  id: string;
  kind: string;
  mode: string;
  version?: string;
  enabled: boolean;
  config: Record<string, string | number | boolean>;
}

export interface BindingSpec {
  service: string;
  resource: string;
  whenEnabled: boolean;
  inject: Record<string, string>;
}

export interface EnvironmentSpec {
  domain?: string;
  env: StringMap;
}

export interface ProjectMetadataSpec {
  id: string;
  name: string;
  description?: string;
  metadata: Record<string, string>;
}

export interface ProjectSpec {
  version: number;
  project: ProjectMetadataSpec;
  runtime: RuntimeSpec;
  deployment: DeploymentSpec;
  artifacts: ArtifactSpec[];
  services: ServiceSpec[];
  routes: RouteSpec[];
  resources: ResourceSpec[];
  bindings: BindingSpec[];
  environments: Record<string, EnvironmentSpec>;
}

export interface BuildPlanArtifact {
  artifactId: string;
  kind: string;
  path: string;
  command: string;
  outputDir?: string;
  env: StringMap;
  devCommand?: string;
  devPort?: number;
}

export interface BuildPlan {
  artifacts: BuildPlanArtifact[];
}

export interface RuntimePlanService {
  serviceId: string;
  artifactId: string;
  kind: string;
  public: boolean;
  command?: string;
  port?: number;
  env: StringMap;
  secrets: string[];
  healthcheck?: HealthcheckSpec;
  static?: ServiceStaticSpec;
  bindings: Array<{
    resourceId: string;
    inject: Record<string, string>;
  }>;
}

export interface RuntimePlan {
  environment: string;
  services: RuntimePlanService[];
  resources: ResourceSpec[];
}

export interface RoutePlanEntry {
  serviceId: string;
  path: string;
  stripPrefix: boolean;
  host?: string;
  public: boolean;
}

export interface RoutePlan {
  router: string;
  routes: RoutePlanEntry[];
}

export interface AdapterServiceInput {
  service: RuntimePlanService;
  routes: RoutePlanEntry[];
}

export interface ProjectAdapter<T> {
  compile(input: {
    spec: ProjectSpec;
    buildPlan: BuildPlan;
    runtimePlan: RuntimePlan;
    routePlan: RoutePlan;
  }): T;
}
