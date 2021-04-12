import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  status: string;
  createDate: number;
  password: string;
  name: string;
  wechatId: string;
  role: string;
  inviter: string;
}
