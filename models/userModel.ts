import mongoose, { Schema, Document } from "mongoose";


export interface User extends Document {
    username: string;
    name: string;
    email: string;
    image: string;
    link: string;
    createdAt: Date;
}

const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
    },
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    image: {
        type: String,
    },
    link: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel

