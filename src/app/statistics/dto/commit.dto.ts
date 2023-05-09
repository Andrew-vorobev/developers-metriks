export class CommitDto {
  public id: string;
  public short_id: string;
  public created_at: string;
  public parent_ids: string[];
  public title: string;
  public message: string;
  public author_name: string;
  public author_email: string;
  public authored_date: string;
  public committer_name: string;
  public committer_email: string;
  public committed_date: string;
  public trailers: object;
  public web_url: string;
}
