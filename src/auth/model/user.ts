import { Schema, Document } from 'mongoose';
import { IsString, IsEmail, MinLength, Validator } from 'class-validator';

export const userSchema = new Schema({
  name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: { type: String, select: false }
});

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
}
