import mongoose, { InferSchemaType, Schema, Types } from 'mongoose'

export const SCHEMA_NAME = 'users'

export const UserSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    first_name: {
      type: String,
      default: '',
      maxlength: 255,
    },
    last_name: {
      type: String,
      default: '',
      maxlength: 255,
    },
    email: {
      type: String,
      default: '',
      maxlength: 300,
      unique: true,
    },
    password: {
      type: String,
      default: '',
      maxlength: 300,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: SCHEMA_NAME,
  },
)

export type UserData = InferSchemaType<typeof UserSchema>

export const User = mongoose.model(SCHEMA_NAME, UserSchema)
