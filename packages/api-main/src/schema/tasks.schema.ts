import mongoose, { InferSchemaType, Schema, Types } from 'mongoose'

export const SCHEMA_NAME = 'user_tasks'

export const TaskDataSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 255,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
      default: '',
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    due_date: {
      type: Date,
      default: null,
    },
    completed_at: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
)

export type TaskDataData = InferSchemaType<typeof TaskDataSchema>

export const TaskSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    _userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    data: {
      type: TaskDataSchema,
      required: true,
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

export type TaskData = InferSchemaType<typeof TaskSchema>

export const Task = mongoose.model(SCHEMA_NAME, TaskSchema)
