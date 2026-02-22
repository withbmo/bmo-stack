export interface Feature {
  id: string;
  title: string;
  description: string;
  pythonCode: string;
  icon: string;
}

export interface Stat {
  label: string;
  value: string;
  detail?: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  meta: string;
  icon: string;
}

export type ResourceType = 'readme' | 'skill';

export interface HubResource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  author: string;
  stars: number;
  forks: number;
  tags: string[];
  updatedAt: string;
  verified?: boolean;
}
