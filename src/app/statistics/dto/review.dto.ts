import { UserDto } from './user.dto';

export class ReviewDto {
  public user: UserDto;
  public state: string;
  public created_at: string;
}
