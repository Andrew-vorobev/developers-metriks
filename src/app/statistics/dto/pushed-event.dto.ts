export class PushedEventDto {
  action_name: string;
  author: {
    id: number;
    username: string;
    name: string;
    state: string;
    avatar_url: string;
    web_url: string;
  };
  author_id: 14167428;
  author_username: 'Jocty';
  created_at: string;
  id: 2578179393;
  project_id: 44837134;
  push_data: {
    commit_count: number;
    action: 'pushed';
    ref_type: 'branch';
    commit_from: 'a623641e41beb68f8a184a76f5a82f69c73b5a19';
    commit_to: '56983afcf4ee1b2656c9367925dac5d38e0aea01';
  };
  target_id: null;
  target_iid: null;
  target_title: null;
  target_type: null;
}
