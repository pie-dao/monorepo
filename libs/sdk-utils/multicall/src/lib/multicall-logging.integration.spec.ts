import { logDirectory, loggerFactory, LOG_FILE_NAMES } from './multicall-logging';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'node:util'
import winston from 'winston';

const readFile = (name: string, dir = logDirectory): winston.LogEntry | winston.LogEntry[] | undefined => {
    const file = `${dir}/${name}`;
    try {
        const data = fs.readFileSync(file);
        // Buffer needs human-readable string conversion before JSON parsing
        return JSON.parse(JSON.stringify(data.toString()));
    } catch (err) {
        console.warn('Error reading file, ensure the log file has the correct permissions', err)
    }
};

const clearDir = (name: string, done: jest.DoneCallback) => {
    fs.rm(name, {
        recursive: true,
        force: true,
    }, err => {
        if (err) console.warn(err);
        else console.log('Cleared log Files successfully')
        done();
    });
}

describe('Testing logging', () => {
    jest.setTimeout(20_000);

    beforeAll(async () => {
        // await change file permissions not to break test
        const promiseExec = promisify(exec);
        await promiseExec(`chmod ugo+rwx "${logDirectory}"`);
    });

    // @dev - jest environment gotchas make this tough to split into functions without tests failing

    it('Logs errors to the errors file', done => {
        const logdir = logDirectory + 'TEST0'
        const logger = loggerFactory(logdir);
        const text = 'Jest Test Error to Logfile';
        const file = LOG_FILE_NAMES.ERROR;
        logger.error(text);
        logger.on('finish', () => {
            const readOutput = readFile(file, logdir);
            if (Array.isArray(readOutput)) throw Error('Should be a one-liner');
            expect(readOutput).toContain(text)
            logger.end();
        });        
        clearDir(logdir, done);
    });

    it('Logs info and error to the info file', done => {
        const logdir = logDirectory + 'TEST1';
        const logger = loggerFactory(logdir);
        const text = ['Jest Info log to Logfile', 'Jest Second Err log to Logfile'];
        const file = LOG_FILE_NAMES.INFO;
        logger.info(text[0]);
        logger.error(text[1]);
        logger.on('finish', () => {
            const readOutput = readFile(file, logdir);
            if (!Array.isArray(readOutput)) throw Error('Should be an array');
            expect(readOutput[0]).toContain(text[0])
            expect(readOutput[1]).toContain(text[1])
            logger.end();
        });
        clearDir(logdir, done);
    });
});