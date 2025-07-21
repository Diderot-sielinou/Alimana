// utils/logger.ts
export const logError = (error: unknown, context: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[${context}]`, error);
  }
  // Optional: send error to your backend / third-party later
};
