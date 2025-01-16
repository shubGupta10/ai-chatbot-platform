import { GoogleAuth } from 'google-auth-library';

const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
  project_id: process.env.GOOGLE_PROJECT_ID,
};

const auth = new GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

export const client = await auth.getClient();
