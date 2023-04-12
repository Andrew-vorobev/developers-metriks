export class UserDto {
  constructor(
    public id: number,
    public username: string,
    public name: string,
    public state: string,
    public avatar_url: string,
    public web_url: string
  ) {}
}
