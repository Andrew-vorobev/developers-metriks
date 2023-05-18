export class ProjectDto {
  public id: number;
  public description?: string;
  public name_with_namespace: string;
  public created_at: string;
  public topics: string[];
  public avatal_url?: string;
  public creator_id: number;
  public _links: {
    self: string;
    issues: string;
    merge_requests: string;
    repo_branches: string;
    labels: string;
    events: string;
    members: string;
    cluster_agents: string;
  };
}
