import winston from 'winston';
import { FileTransportOptions } from 'winston/lib/winston/transports';
import path from 'path';

export const logDirectory = path.join(__dirname, '.log__sdk');
export const LOG_FILE_NAMES = {
    INFO: 'combined.log',
    ERROR: 'error.log',
    REJECT: 'error.log',
    EXCEPTION: 'error.log'
}

// https://github.com/winstonjs/winston/blob/master/docs/transports.md#file-transport
const baseFileTransportOptions: FileTransportOptions = {
    maxsize: 1024 * 1000, // 1MB
    maxFiles: 1,
    tailable: true,
};

export const loggerFactory = (dirname: string = logDirectory) => winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
            ...baseFileTransportOptions, 
            filename: LOG_FILE_NAMES.ERROR, 
            level: 'error',
            dirname,
        }),
      new winston.transports.File({ 
            ...baseFileTransportOptions,
            dirname,
            filename: LOG_FILE_NAMES.INFO
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ 
            ...baseFileTransportOptions,
            dirname,
            filename: LOG_FILE_NAMES.REJECT
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({ 
            ...baseFileTransportOptions,
            dirname,
            filename: LOG_FILE_NAMES.EXCEPTION })
    ],
  });
  

// the basic logger
export const logger = loggerFactory();

// If not in production then log to the console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
};