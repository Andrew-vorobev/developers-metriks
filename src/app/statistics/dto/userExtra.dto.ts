export class UserExtraDto {
  id: number;
  username: string;
  name: string;
  state: string;
  avatar_url: string;
  web_url: string;
  created_at: Date | string;
  bio: string;
  location: string;
  public_email?: string;
  skype: string;
  linkedin: string;
  twitter: string;
  discord: string;
  website_url: string;
  organization: string;
  job_title: string;
  pronouns?: string[];
  bot: false;
  work_information?: string;
  followers: 0;
  following: 0;
  is_followed: false;
  local_time?: null;
  last_sign_in_at: Date | string;
  confirmed_at: Date | string;
  last_activity_on: Date | string;
  email: string;
  theme_id: 1;
  color_scheme_id: 1;
  projects_limit: 100000;
  current_sign_in_at: Date | string;
  identities: [];
  can_create_group: true;
  can_create_project: true;
  two_factor_enabled: false;
  external: false;
  private_profile: false;
  commit_email: string;
  shared_runners_minutes_limit?: number;
  extra_shared_runners_minutes_limit?: number;
  message?: string;
}
