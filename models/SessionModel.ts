import mongoose, { model, Schema, Document } from "mongoose";

interface Session extends Document {
  sessionId: string;
  userId: string;
  chatbotId: string;
  sessionStart: Date;
  sessionEnd?: Date;
  duration?: number;
  ipAddress?: string;
  location?: string;
  userAction: string;
  interactionData?: string;
}

const sessionSchema = new Schema<Session>({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  chatbotId: { type: String, required: true },
  sessionStart: { type: Date, default: Date.now },
  sessionEnd: { type: Date },
  duration: { type: Number },
  ipAddress: { type: String },
  location: { type: String },
  userAction: { type: String, required: true },
  interactionData: { type: String },
});

const SessionModel =
  (mongoose.models.Session as mongoose.Model<Session>) ||
  model<Session>("Session", sessionSchema);

export default SessionModel;
