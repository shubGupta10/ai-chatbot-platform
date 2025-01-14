import mongoose, {Schema, Document, model, models} from "mongoose";

export interface ChatBot extends Document {
    userId: string;
    name: string;
    description: string;
    contextData: Map<string, string>;
    createdAt: Date;
    updatedAt: Date;
}


const ChatBotSchema = new Schema<ChatBot>({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contextData: {
        type: Map,
        of: String,
        required: [true, "Context data is required!"]
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
})

export const chatbotModel = models.ChatBot || model<ChatBot>('ChatBot', ChatBotSchema);