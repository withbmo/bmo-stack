import type {
  BuildPlan,
  ProjectSpec,
  RoutePlan,
  RoutePlanEntry,
  RuntimePlan,
  RuntimePlanService,
  StringMap,
} from './types';

function mergeEnv(...segments: Array<StringMap | undefined>): StringMap {
  return Object.assign({}, ...segments.filter(Boolean));
}

export function createBuildPlan(spec: ProjectSpec): BuildPlan {
  return {
    artifacts: spec.artifacts
      .filter((artifact) => artifact.build?.command)
      .map((artifact) => ({
        artifactId: artifact.id,
        kind: artifact.kind,
        path: artifact.path,
        command: artifact.build!.command,
        outputDir: artifact.build?.outputDir,
        env: artifact.env,
        devCommand: artifact.dev?.command,
        devPort: artifact.dev?.port,
      })),
  };
}

export function createRuntimePlan(
  spec: ProjectSpec,
  environmentName = spec.deployment.defaultEnvironment,
): RuntimePlan {
  const environment = spec.environments[environmentName];
  const enabledResources = spec.resources.filter((resource) => resource.enabled);

  const services: RuntimePlanService[] = spec.services.map((service) => {
    const artifact = spec.artifacts.find((candidate) => candidate.id === service.artifact);
    const bindingEntries = spec.bindings.filter((binding) => binding.service === service.id);

    return {
      serviceId: service.id,
      artifactId: service.artifact,
      kind: service.kind,
      public: service.public,
      command: service.run?.command ?? artifact?.dev?.command,
      port: service.run?.port ?? artifact?.dev?.port,
      env: mergeEnv(artifact?.env, environment?.env, service.env),
      secrets: service.secrets,
      healthcheck: service.healthcheck,
      static: service.static,
      bindings: bindingEntries
        .filter((binding) => {
          const resource = enabledResources.find((candidate) => candidate.id === binding.resource);
          if (!resource) return !binding.whenEnabled;
          return true;
        })
        .map((binding) => ({
          resourceId: binding.resource,
          inject: binding.inject,
        })),
    };
  });

  return {
    environment: environmentName,
    services,
    resources: enabledResources,
  };
}

export function createRoutePlan(spec: ProjectSpec): RoutePlan {
  const routes: RoutePlanEntry[] = spec.routes.map((route) => {
    const service = spec.services.find((candidate) => candidate.id === route.service);

    return {
      serviceId: route.service,
      path: route.path,
      stripPrefix: route.stripPrefix,
      host: route.host,
      public: service?.public ?? false,
    };
  });

  return {
    router: spec.deployment.router,
    routes,
  };
}

export function createProjectPlans(spec: ProjectSpec, environmentName = spec.deployment.defaultEnvironment) {
  return {
    buildPlan: createBuildPlan(spec),
    runtimePlan: createRuntimePlan(spec, environmentName),
    routePlan: createRoutePlan(spec),
  };
}
