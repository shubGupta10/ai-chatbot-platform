import mongoose, { Schema, Document } from "mongoose";


export interface Admin extends Document {
    username: string;
    email: string;
    password: string;
    image: string;
    createdAt: Date;
}

const AdminSchema: Schema<Admin> = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const AdminModel = (mongoose.models.User as mongoose.Model<Admin>) || mongoose.model<Admin>("User", AdminSchema)

export default AdminModel

