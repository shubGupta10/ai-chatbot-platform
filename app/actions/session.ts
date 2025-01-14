export async function addSession(sessionData: {
    sessionId: string;
    userId: string;
    chatbotId: string;
    userAction: string;
    sessionStart?: Date;
    sessionEnd?: Date;
    duration?: number;
  }) {
    try {
      const response = await fetch("/api/session/add-new-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add session: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error adding session:", error.message);
      throw error;
    }
  }