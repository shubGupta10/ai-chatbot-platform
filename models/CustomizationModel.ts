import { Schema, model, Document } from 'mongoose';

interface Message {
  sender: 'ai' | 'user';  
  content: string;
  timestamp: Date;
}

interface Customization extends Document {
  chatbotId: string;
  userId: string;
  greetingMessage: string;
  theme: 'light' | 'dark' | 'custom'; 
  avatarUrl: string | null;
  fontFamily: string;
  backgroundColor: string;  
  textColor: string; 
  buttonColor: string; 
  otherSettings: {
    messagesHistory: Message[];
    [key: string]: any; 
  };
}

const customizationSchema = new Schema<Customization>({
  chatbotId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  greetingMessage: { type: String, default: 'Hello! How can I assist you today?' },
  theme: { type: String, enum: ['light', 'dark', 'custom'], default: 'light' },
  avatarUrl: { type: String, default: null },
  fontFamily: { type: String, default: 'Arial' },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#000000' }, 
  buttonColor: { type: String, default: '#4CAF50' }, 
  otherSettings: {
    messagesHistory: { type: [Object], default: [] }, 
  },
});

// Create the model
const CustomizationModel = model<Customization>('Customization', customizationSchema);

export default CustomizationModel;
