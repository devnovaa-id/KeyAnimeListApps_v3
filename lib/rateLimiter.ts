// lib/rateLimiter.ts
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number = 3;
  private readonly timeWindow: number = 1000; // 1 second

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    
    // Remove requests outside the current time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      // Remove the oldest request after waiting
      this.requests.shift();
    }
    
    this.requests.push(Date.now());
  }
}

export const rateLimiter = new RateLimiter();