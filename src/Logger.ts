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
        return new Logger(this.options, { ... data });
    }

    /*
     * creates a sibling logger which extends the sibling logger's options and data, but sets the namespace.
     */
    public sibling(namespace: string): Logger {
        const options = {
            ... this.options,
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

    protected construct_message<T extends JsonableRecord>(level: LoggerLevel, data: T) {
        const { options, metadata } = this;
        const { name, namespace } = options;
        const type = `${name}.${namespace}`;
        const message = {
            ... metadata,
            name,
            level,
            type,
            [type]: {
                ... data,
            },
        };
        return message;
    }

    protected serialize<T extends JsonableRecord>(level: LoggerLevel, payload: JsonableRecord) {
        return JSON.stringify(payload);
    }

    protected format<T extends Record<string, any>>(level: LoggerLevel, data: T) {
        return this.serialize(level, this.construct_message<T>(level, data));
    }

    public log<T extends Record<string, any>>(level: LoggerLevel, data: T): void {
        const payload_record = this.construct_message(level, data);
        const payload_str = this.serialize<T>(level, payload_record);
        console.log(payload_record);
    }

}

export default function createLogger(options: LoggerOptions, metadata: JsonableRecord) {
    return new Logger(options, metadata);
}
