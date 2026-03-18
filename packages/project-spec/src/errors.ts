export interface ProjectSpecIssue {
  path: string;
  message: string;
}

export class ProjectSpecError extends Error {
  readonly issues: ProjectSpecIssue[];

  constructor(message: string, issues: ProjectSpecIssue[]) {
    super(message);
    this.name = 'ProjectSpecError';
    this.issues = issues;
  }
}
