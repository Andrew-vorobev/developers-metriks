export interface IUserStat {
  id?: number;
  username?: string;
  avatar_url?: string;
  mostActiveWeekday: number;
  editStats: number[];
  commitsCount: number;
  name?: string;
  reviewsCount?: number;
  programingLanguages?: Set<string>;
}
