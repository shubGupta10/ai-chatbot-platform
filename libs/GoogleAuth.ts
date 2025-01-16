import { GoogleAuth } from 'google-auth-library';

export const authenticateGoogle = async () => {
  // Parse the credentials from the environment variable
  const credentialsEnv = process.env.GOOGLE_VERTEX_AI_WEB_CREDENTIALS;
  if (!credentialsEnv) {
    throw new Error('GOOGLE_VERTEX_AI_WEB_CREDENTIALS environment variable is not defined');
  }
  const credentials = JSON.parse(credentialsEnv);

  // Initialize GoogleAuth with the credentials object
  const auth = new GoogleAuth({
    credentials,  // Pass the parsed credentials object
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],  
  });

  // Get the authenticated client
  const client = await auth.getClient();
  return client;
};

// Example usage in an API route
export default async function handler(req: any, res: any) {
  try {
    const client = await authenticateGoogle();
    res.status(200).json({ message: "Authenticated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Authentication failed", details: error.message });
  }
}
