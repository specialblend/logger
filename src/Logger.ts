import flatten from 'flat';

export enum LoggerLevel {
    fatal,
    error,
    warn,
    debug,
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
        const { name, namespace, level } = options;
        this.options = { name, namespace, level };
        this.metadata = metadata;
    }

    /*
     * creates a child logger which keeps the parent logger's namespace, and extends the parent logger's data.
     */
    public child(data: JsonableRecord): Logger {
        return new Logger(this.options, { ...data });
    }

    /*
     * creates a sibling logger which extends the sibling logger's options and data, but sets the namespace.
     */
    public sibling(namespace: string): Logger {
        const options = {
            ...this.options,
            namespace,
        };
        return new Logger(options, this.metadata);
    }

    /*
     * alias of sibling
     */
    public type(namespace: string) {
        return this.sibling(namespace);
    }

    public log<TData extends Record<string, any>>(level: LoggerLevel, data: TData): void {
        const payload_record = this.construct_message(level, data);
        const payload_str = this.serialize<TData>(level, payload_record);
        this.write(level, payload_str);
    }

    public fatal<TData>(data: TData): void {
        return this.log(LoggerLevel.fatal, data);
    }

    public error<TData>(data: TData): void {
        return this.log(LoggerLevel.error, data);
    }

    public warn<TData>(data: TData) {
        return this.log(LoggerLevel.warn, data);
    }

    public debug<TData>(data: TData) {
        return this.log(LoggerLevel.debug, data);
    }

    public info<TData>(data: TData) {
        return this.log(LoggerLevel.info, data);
    }

    public trace<TData>(data: TData) {
        return this.log(LoggerLevel.trace, data);
    }

    public silly<TData>(data: TData) {
        return this.log(LoggerLevel.silly, data);
    }

    protected construct_message<T extends JsonableRecord>(level: LoggerLevel, data: T) {
        const { options, metadata } = this;
        const { name, namespace } = options;
        const type = `${name}.${namespace}`;
        const message = {
            ...metadata,
            name,
            level,
            type,
            [type]: {
                ...data,
            },
        };
        return message;
    }

    protected serialize<T extends JsonableRecord>(level: LoggerLevel, payload: JsonableRecord): string {
        return JSON.stringify(flatten(payload));
    }

    protected write(level: LoggerLevel, payload: string) {
        if (level <= LoggerLevel.error) {
            return console.error(payload);
        }
        return console.log(payload);
    }
}

export default function createLogger(options: LoggerOptions, metadata: JsonableRecord) {
    return new Logger(options, metadata);
}
