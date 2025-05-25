import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const sessionStore = {
  async set(data: any, ttl: number): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    await redis.set(sessionId, JSON.stringify(data), "EX", ttl);
    return sessionId;
  },

  async get(sessionId: string): Promise<any | null> {
    const data = await redis.get(sessionId);
    return data ? JSON.parse(data) : null;
  },

  async delete(sessionId: string): Promise<void> {
    await redis.del(sessionId);
  },
};

export default sessionStore;
