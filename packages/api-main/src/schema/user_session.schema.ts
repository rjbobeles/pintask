import mongoose, { InferSchemaType, Schema, Types } from 'mongoose'

export const SCHEMA_NAME = 'user_sessions'

export const UserAgentDataSchema = new Schema(
  {
    browser: {
      type: String,
      maxlength: 255,
      default: '',
    },
    version: {
      type: String,
      maxlength: 255,
      default: '',
    },
    os: {
      type: String,
      maxlength: 255,
      default: '',
    },
    platform: {
      type: String,
      maxlength: 255,
      default: '',
    },
    source: {
      type: String,
      maxlength: 255,
      default: '',
    },
  },
  { _id: false },
)

export type UserAgentData = InferSchemaType<typeof UserAgentDataSchema>

export const UserSessionSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    _userId: {
      type: Types.ObjectId,
      ref: 'User',
    },
    device_id: {
      type: String,
      default: '',
    },
    nonce: {
      type: String,
      minlength: 60,
      maxlength: 70,
      default: '',
    },
    ip_address: {
      type: String,
      maxlength: 100,
      default: '',
    },
    user_agent: {
      type: UserAgentDataSchema,
    },
    last_used_at: {
      type: Date,
      default: Date.now,
    },
    invalidated_at: {
      type: Date,
      default: null,
    },
    expires_at: {
      type: Date,
      default: () => new Date((Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60) * 1000),
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

export type UserSessionData = InferSchemaType<typeof UserSessionSchema>

export const UserSession = mongoose.model(SCHEMA_NAME, UserSessionSchema)
