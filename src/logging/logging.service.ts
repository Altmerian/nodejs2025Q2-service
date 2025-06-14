import { Injectable, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '../config/config.service';

@Injectable()
export class LoggingService {
  private readonly logLevelPriority: Record<LogLevel, number> = {
    fatal: 0,
    error: 1,
    warn: 2,
    log: 3,
    debug: 4,
    verbose: 5,
  };

  private currentLogLevel: LogLevel;
  private logDir: string;
  private maxFileSize: number;
  private currentLogFile: string;
  private errorLogFile: string;

  constructor(private readonly configService: ConfigService) {
    this.currentLogLevel = this.configService.logLevel as LogLevel;
    this.logDir = this.configService.logDir;
    this.maxFileSize = this.configService.logMaxSizeKb * 1024; // Convert KB to bytes

    this.ensureLogDirectory();
    this.initializeLogFiles();
  }

  fatal(message: string, context?: string, trace?: string): void {
    this.logMessage('fatal', message, context, trace);
  }

  error(message: string, context?: string, trace?: string): void {
    this.logMessage('error', message, context, trace);
  }

  warn(message: string, context?: string): void {
    this.logMessage('warn', message, context);
  }

  log(message: string, context?: string): void {
    this.logMessage('log', message, context);
  }

  debug(message: string, context?: string): void {
    this.logMessage('debug', message, context);
  }

  verbose(message: string, context?: string): void {
    this.logMessage('verbose', message, context);
  }

  private logMessage(level: LogLevel, message: string, context?: string, trace?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const formattedMessage = this.formatMessage(timestamp, level, message, context, trace);

    // Always log to stdout
    console.log(formattedMessage);

    // Write to file
    this.writeToFile(formattedMessage, level);
  }

  private shouldLog(level: LogLevel): boolean {
    const currentPriority = this.logLevelPriority[this.currentLogLevel];
    const messagePriority = this.logLevelPriority[level];
    return messagePriority <= currentPriority;
  }

  private formatMessage(timestamp: string, level: LogLevel, message: string, context?: string, trace?: string): string {
    const contextStr = context ? ` [${context}]` : '';
    const levelStr = `[${level.toUpperCase()}]`;
    const traceStr = trace ? `\n${trace}` : '';
    return `${timestamp} ${levelStr}${contextStr} ${message}${traceStr}`;
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private initializeLogFiles(): void {
    const timestamp = this.getFileTimestamp();
    this.currentLogFile = path.join(this.logDir, `${timestamp}-app.log`);
    this.errorLogFile = path.join(this.logDir, 'error.log');

    this.cleanupOldFiles();
  }

  private getFileTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
  }

  private writeToFile(message: string, level: LogLevel): void {
    try {
      // Check if rotation is needed
      this.rotateLogFileIfNeeded();

      // Write to main log file
      fs.appendFileSync(this.currentLogFile, message + '\n');

      // Also write errors to error.log
      if (level === 'error' || level === 'fatal') {
        fs.appendFileSync(this.errorLogFile, message + '\n');
      }
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private rotateLogFileIfNeeded(): void {
    try {
      if (!fs.existsSync(this.currentLogFile)) {
        return;
      }

      const stats = fs.statSync(this.currentLogFile);
      if (stats.size >= this.maxFileSize) {
        // Create new log file
        const timestamp = this.getFileTimestamp();
        this.currentLogFile = path.join(this.logDir, `${timestamp}-app.log`);

        // Clean up old files if more than 10
        this.cleanupOldFiles();
      }
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  private cleanupOldFiles(): void {
    try {
      const files = fs
        .readdirSync(this.logDir)
        .filter((file) => file.endsWith('-app.log'))
        .map((file) => ({
          name: file,
          path: path.join(this.logDir, file),
          mtime: fs.statSync(path.join(this.logDir, file)).mtime,
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      console.log(`Found ${files.length} app log files, max allowed: 10`);

      // Keep only the 10 most recent files
      if (files.length > 10) {
        const filesToDelete = files.slice(10);
        console.log(`Deleting ${filesToDelete.length} old log files`);

        for (const file of filesToDelete) {
          fs.unlinkSync(file.path);
          console.log(`Deleted old log file: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old log files:', error);
    }
  }
}
