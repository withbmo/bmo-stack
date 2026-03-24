import { Injectable } from '@nestjs/common';
import {
  createProjectPlans,
  parseProjectSpec,
  type ProjectSpec,
  validateProjectSpec,
} from '@pytholit/project-spec';

@Injectable()
export class ProjectSpecService {
  parseToml(tomlSource: string): ProjectSpec {
    return validateProjectSpec(parseProjectSpec(tomlSource));
  }

  buildPlans(tomlSource: string, environmentName?: string) {
    const spec = this.parseToml(tomlSource);
    return {
      spec,
      ...createProjectPlans(spec, environmentName),
    };
  }
}
