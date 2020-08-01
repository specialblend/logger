/* eslint-disable camelcase */
import { Exception } from '@specialblend/exceptional';
import flatten from 'flat';

export type JsonableRecord = Record<string, any>;

export enum LogLevel {
    SILENT = -1,
    FATAL = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    DEBUG = 4,
    TRACE = 5,
    SILLY = 6,
    // eslint-disable-next-line no-inline-comments
    SECRET= 7 // this one mines bitcoin (just kidding)
}

export type LogLevelName = keyof typeof LogLevel;
export type ILogLevel = LogLevel | LogLevelName;

export interface LoggerOptions {
    name: string
    namespace: string
    level: ILogLevel,
}

export interface LogRecord {

    /* name of the logger */
    '@name': string,

    /* namespace of the logger */
    '@type': string,

    /**
     * numeric log level (0-6)
     */
    '#loglevel': LogLevel,

    /**
     * string log level
     */
    '@loglevel': LogLevelName,

    /**
     * payload
     */
    data: JsonableRecord
}

export function parse_loglevel(level: ILogLevel): [LogLevel, LogLevelName] {
    if (typeof level === 'number') {
        return [level, LogLevel[level] as LogLevelName];
    }
    return [LogLevel[level], level];
}

export function construct_record<TData extends JsonableRecord>(logger: Logger, loglevel: LogLevel, data: TData): LogRecord {
    const [, loglevel_name] = parse_loglevel(loglevel);
    const { options, metadata } = logger;
    const { name, namespace } = options;
    const type = `${name}.${namespace}`;
    return {
        ...metadata,
        '@name': name,
        '#loglevel': loglevel,
        '@loglevel': loglevel_name,
        '@type': type,
        data: {
            [namespace]: {
                ...data,
            },
        },
    };
}

export function serialize<T extends JsonableRecord>(level: LogLevel, payload: JsonableRecord): string {
    return JSON.stringify(flatten(payload));
}

function write_stderr(payload: string): void {
    return console.error(payload);
}

function write_stdout(payload: string): void {
    return console.log(payload);
}

function write(level: LogLevel, payload: string): void {
    if (level <= LogLevel.ERROR) {
        return write_stderr(payload);
    }
    return write_stdout(payload);
}

export class Logger {
    public options: LoggerOptions;
    public metadata: JsonableRecord;

    constructor(options: LoggerOptions, metadata: JsonableRecord = {}) {
        const { name, namespace, level: level } = options;
        const [loglevel] = parse_loglevel(level);
        this.options = { name, namespace, level: loglevel };
        this.metadata = metadata;
    }

    /*
     * creates a child logger which keeps the parent logger's namespace, and extends the parent logger's data.
     */
    public child(metadata: JsonableRecord): Logger {
        const __Constructor = this.constructor as new (options: LoggerOptions, metadata: JsonableRecord) => Logger;
        return new __Constructor(this.options, { ...this.metadata, ...metadata });
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
    public type(namespace: string): Logger {
        return this.sibling(namespace);
    }

    public log<TData extends Record<string, any>>(loglevel: ILogLevel, data: TData): void {
        const [level] = parse_loglevel(loglevel);
        if (level <= this.options.level) {
            const log_record = construct_record(this, level, data);
            const log_record_str = serialize<TData>(level, log_record);
            write(level, log_record_str);
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

    protected construct_record<TData extends JsonableRecord>(loglevel: LogLevel, data: TData): LogRecord {
        return construct_record(this, loglevel, data);
    }
}

export default function createLogger(options: LoggerOptions, metadata: JsonableRecord): Logger {
    return new Logger(options, metadata);
}
