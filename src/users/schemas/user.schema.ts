import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: String,
  status: String,
  createDate: Number,
  password: String,
  name: String,
  wechatId: String,
  role: String,
  inviter: String,
});
