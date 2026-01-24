/**
 * Environment-aware logging utility
 * Only logs in development mode to prevent sensitive information leakage in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  prefix?: string;
  includeTimestamp?: boolean;
}

class Logger {
  private prefix: string;
  private includeTimestamp: boolean;
  private isDev: boolean;

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || '';
    this.includeTimestamp = options.includeTimestamp ?? false;
    this.isDev = import.meta.env.DEV;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const parts: string[] = [];
    
    if (this.includeTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }
    
    parts.push(`[${level.toUpperCase()}]`);
    
    if (this.prefix) {
      parts.push(`[${this.prefix}]`);
    }
    
    parts.push(message);
    
    return parts.join(' ');
  }

  debug(message: string, data?: unknown): void {
    if (this.isDev) {
      console.log(this.formatMessage('debug', message), data ?? '');
    }
  }

  info(message: string, data?: unknown): void {
    if (this.isDev) {
      console.info(this.formatMessage('info', message), data ?? '');
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.isDev) {
      console.warn(this.formatMessage('warn', message), data ?? '');
    }
  }

  error(message: string, error?: unknown): void {
    if (this.isDev) {
      console.error(this.formatMessage('error', message), error ?? '');
    }
    // In production, you would send to an error tracking service here
    // e.g., Sentry, LogRocket, etc.
  }
}

// Default logger instance
export const logger = new Logger();

// Factory function to create prefixed loggers
export function createLogger(prefix: string, options?: Omit<LoggerOptions, 'prefix'>): Logger {
  return new Logger({ ...options, prefix });
}

// Export class for custom instances
export { Logger };
