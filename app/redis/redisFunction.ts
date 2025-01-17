import { NextResponse } from 'next/server';
import redisClient from './redisClient';
import redis from './UpstashClient';

export const getCachedChatbots = async (userId: string) => {
  try {
    const cachedData = await redisClient.get(`user:${userId}:chatbots`);

    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Error fetching from Redis:', error);
    return null;
  }
};

export const setCachedChatbots = async (userId: string, data: any) => {
  try {
    await redisClient.setEx(`user:${userId}:chatbots`, 7200, JSON.stringify(data)); // TTL = 7200 seconds (2 hours)
  } catch (error) {
    console.error('Error saving to Redis:', error);
  }
};

export const SetSingleChatbot = async (userId: string, chatbotId: string, data: any) => {
  try {
    await redisClient.setEx(`user:${userId}:chatbot:${chatbotId}`, 7200, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving single chatbot", error);
  }
};

export const getSingleChatbot = async (userId: string, chatbotId: string) => {
  try {
    const singleChatbot = await redisClient.get(`user:${userId}:chatbot:${chatbotId}`);
    if (singleChatbot) {
      return JSON.parse(singleChatbot);
    }
    return null;
  } catch (error) {
    console.error("Error fetching single chatbot", error);
    return null;
  }
};

export const getCachedSessions = async (userId: string, chatbotId: string) => {
  try {
    const cachedSessions = await redisClient.get(`${userId}:${chatbotId}`);
    if (cachedSessions) {
      return JSON.parse(cachedSessions);
    }
    return null;
  } catch (error) {
    console.error('Error fetching from Redis:', error);
    return null;
  }
};

export const setCachedSessions = async (userId: string, chatbotId: string, sessions: any) => {
  try {
    await redisClient.setEx(`${userId}:${chatbotId}`, 7200, JSON.stringify(sessions)); // TTL = 1 hour
  } catch (error) {
    console.error('Error saving to Redis:', error);
  }
};

export const getCachedSessionDetails = async (sessionId: string) => {
  try {
    const cachedSessionDetails = await redisClient.get(sessionId);
    if (cachedSessionDetails) {
      return JSON.parse(cachedSessionDetails);
    }
    return null;
  } catch (error) {
    console.error('Error fetching from Redis:', error);
    return null;
  }
};

export const setCachedSessionDetails = async (sessionId: string, sessionDetails: any) => {
  try {
    await redisClient.setEx(sessionId, 3600, JSON.stringify(sessionDetails)); // TTL = 1 hour
  } catch (error) {
    console.error('Error saving to Redis:', error);
  }
};


export const setContextData = async (key: string, data: any, expiration?: number) => {
  try {
    if (expiration) {
      await redis.set(key, JSON.stringify(data), { ex: expiration })
    } else {
      await redis.set(key, JSON.stringify(data));
    }
    return NextResponse.json({
      message: "ContextData stored in redis"
    }, { status: 200 })
  } catch (error) {
    console.error("Error storing data in Redis:", error);
    throw error;
  }
}

export const getContextData = async (key: string): Promise<any> => {
  try {
    const response = await redis.get(key);
    if (typeof response === 'string') {
      return JSON.parse(response);
    } else {
      console.log(`No data found for key: ${key}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching context data from Redis:", error);
    return null;
  }
}