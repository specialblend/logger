import { Exception } from '@specialblend/exceptional';
import flatten from 'flat';

export enum LogLevel {
    FATAL,
    ERROR,
    WARN,
    INFO,
    DEBUG,
    TRACE,
    SILLY,
}

export type LogLevelName = keyof typeof LogLevel;
export type ILogLevel = LogLevel | LogLevelName;

export interface LoggerOptions {
    name: string
    namespace: string
    level: ILogLevel,
}

export type JsonableRecord = Record<string, any>;

export function parseLogLevel(logLevel: ILogLevel): [LogLevel, string] {
    if (typeof logLevel === 'number') {
        return [logLevel, LogLevel[logLevel]];
    }
    return [LogLevel[logLevel], logLevel];
}

export class Logger {
    private options: LoggerOptions;
    private metadata: JsonableRecord;

    constructor(options: LoggerOptions, metadata: JsonableRecord = {}) {
        const { name, namespace, level: _level } = options;
        const [level] = parseLogLevel(_level);
        this.options = { name, namespace, level };
        this.metadata = metadata;
    }

    /*
     * creates a child logger which keeps the parent logger's namespace, and extends the parent logger's data.
     */
    public child(metadata: JsonableRecord): Logger {
        const __Constructor = this.constructor as new (options: LoggerOptions, metadata: JsonableRecord) => Logger;
        return new __Constructor(this.options, { ... this.metadata, ... metadata });
    }

    /*
     * creates a sibling logger which extends the sibling logger's options and data, but sets the namespace.
     */
    public sibling(namespace: string): Logger {
        const options = {
            ...this.options,
            namespace,
        };
        const __Constructor = this.constructor as new (options: LoggerOptions, metadata: JsonableRecord) => Logger;
        return new __Constructor(options, this.metadata);
    }

    /*
     * alias of sibling
     */
    public type(namespace: string) {
        return this.sibling(namespace);
    }

    public log<TData extends Record<string, any>>(logLevel: ILogLevel, data: TData): void {
        const [level] = parseLogLevel(logLevel);
        if (level <= this.options.level) {
            const payloadRecord = this.constructMessage(level, data);
            const payloadStr = this.serialize<TData>(level, payloadRecord);
            this.write(level, payloadStr);
        }
    }

    public fatal<TData>(data: TData): void {
        return this.log(LogLevel.FATAL, data);
    }

    public error<TData>(data: TData): void {
        this.log(LogLevel.ERROR, data);
    }

    public warn<TData>(data: TData): void {
        this.log(LogLevel.WARN, data);
    }

    public debug<TData>(data: TData): void {
        this.log(LogLevel.DEBUG, data);
    }

    public info<TData>(data: TData): void {
        this.log(LogLevel.INFO, data);
    }

    public trace<TData>(data: TData): void {
        this.log(LogLevel.TRACE, data);
    }

    public silly<TData>(data: TData): void {
        this.log(LogLevel.SILLY, data);
    }

    public exception<TException extends Exception<TData, TError>, TData = Record<string, any>, TError = Error>(ex: TException, level: LogLevel = LogLevel.ERROR): void {
        const { message, code, data, err } = ex;
        if (typeof err === 'undefined') {
            return this.log(level, { message, code, data });
        }
        const { message: _message, stack } = err as unknown as Error;
        return this.log(level, { message, code, data, err: { message: _message, stack } });
    }

    protected constructMessage<T extends JsonableRecord>(loglevel: LogLevel, data: T) {
        const [, level] = parseLogLevel(loglevel);
        const { options, metadata } = this;
        const { name, namespace } = options;
        const type = `${name}.${namespace}`;
        return {
            ...metadata,
            name,
            log_level: loglevel,
            level,
            type,
            [type]: {
                ...data,
            },
        };
    }

    protected serialize<T extends JsonableRecord>(level: LogLevel, payload: JsonableRecord): string {
        return JSON.stringify(flatten(payload));
    }

    protected writeStdErr(payload: string): void {
        return console.error(payload);
    }

    protected writeStdOut(payload: string): void {
        return console.log(payload);
    }

    protected write(level: LogLevel, payload: string): void {
        if (level <= LogLevel.ERROR) {
            return this.writeStdErr(payload);
        }
        return this.writeStdOut(payload);
    }
}

export default function createLogger(options: LoggerOptions, metadata: JsonableRecord): Logger {
    return new Logger(options, metadata);
}
