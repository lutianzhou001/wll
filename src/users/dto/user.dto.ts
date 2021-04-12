export class UserDto {
  constructor(object: any) {
    this.name = object.name;
    this.wechatId = object.wechatId;
    this.createDate = object.createDate;
    this.inviter = object.inviter;
    this.status = object.status;
  }
  readonly name: string;
  readonly wechatId: string;
  readonly createDate: number;
  readonly inviter: string;
  readonly status: string;
}
