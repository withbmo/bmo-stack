

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
