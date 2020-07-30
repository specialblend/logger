import { Exception } from '@specialblend/exceptional';
import flatten from 'flat';

export enum LoggerLevel {
    fatal,
    error,
    debug,
    warn,
    info,
    trace,
    silly,
}

export interface LoggerOptions {
    name: string
    namespace: string
    level: LoggerLevel,
}

export type JsonableRecord = Record<string, any>;

export class Logger {
    private options: LoggerOptions;
    private metadata: JsonableRecord;

    constructor(options: LoggerOptions, metadata: JsonableRecord = {}) {
        const { name, namespace, level = LoggerLevel.silly } = options;
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

    public log<TData extends Record<string, any>>(level: LoggerLevel, data: TData): void {
        if (level <= this.options.level) {
            const payloadRecord = this.constructMessage(level, data);
            const payloadStr = this.serialize<TData>(level, payloadRecord);
            this.write(level, payloadStr);
        }
    }

    public fatal<TData>(data: TData): void {
        return this.log(LoggerLevel.fatal, data);
    }

    public error<TData>(data: TData): void {
        this.log(LoggerLevel.error, data);
    }

    public warn<TData>(data: TData): void {
        this.log(LoggerLevel.warn, data);
    }

    public debug<TData>(data: TData): void {
        this.log(LoggerLevel.debug, data);
    }

    public info<TData>(data: TData): void {
        this.log(LoggerLevel.info, data);
    }

    public trace<TData>(data: TData): void {
        this.log(LoggerLevel.trace, data);
    }

    public silly<TData>(data: TData): void {
        this.log(LoggerLevel.silly, data);
    }

    public exception<TException extends Exception<TData, TError>, TData = Record<string, any>, TError = Error>(ex: TException, level: LoggerLevel = LoggerLevel.error): void {
        const { message, code, data, err } = ex;
        if (typeof err === 'undefined') {
            return this.log(level, { message, code, data });
        }
        const { message: _message, stack } = err as unknown as Error;
        return this.log(level, { message, code, data, err: { message: _message, stack } });
    }

    protected constructMessage<T extends JsonableRecord>(level: LoggerLevel, data: T) {
        const { options, metadata } = this;
        const { name, namespace } = options;
        const type = `${name}.${namespace}`;
        return {
            ...metadata,
            name,
            level,
            type,
            [type]: {
                ...data,
            },
        };
    }

    protected serialize<T extends JsonableRecord>(level: LoggerLevel, payload: JsonableRecord): string {
        return JSON.stringify(flatten(payload));
    }

    protected writeStdErr(payload: string): void {
        return console.error(payload);
    }

    protected writeStdOut(payload: string): void {
        return console.log(payload);
    }

    protected write(level: LoggerLevel, payload: string): void {
        if (level <= LoggerLevel.error) {
            return this.writeStdErr(payload);
        }
        return this.writeStdOut(payload);
    }
}

export default function createLogger(options: LoggerOptions, metadata: JsonableRecord): Logger {
    return new Logger(options, metadata);
}
