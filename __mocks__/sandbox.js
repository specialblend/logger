/* eslint-disable @typescript-eslint/no-var-requires */

(function sandbox() {
    const { Logger, LoggerLevel } = require('../lib/Logger');
    const appLogger = new Logger({ name: 'myApp', namespace: 'app', level: LoggerLevel.fatal });
    appLogger.silly({
        message: 'you are awesome.',
        foo: 'test foo',
    });
    appLogger.trace({
        message: 'I talk too much.',
        bar: 'test bar',
    });
    appLogger.info({
        message: 'I am working just fine.',
        baz: 'test baz',
    });
    appLogger.debug({
        message: 'Here is more information about stuff when stuff broke.',
        foo: 'test foo',
    });
    appLogger.warn({
        message: 'This shouldn\'t be happening. You should be ashamed of yourself.',
        bar: 'test bar',
    });
    appLogger.error({
        message: 'I am not quite dying, but something really bad happened. Fix me.',
        baz: 'test baz',
    });
    appLogger.fatal({
        message: 'I am dying because I can\'t handle this error.',
        faz: 'test faz',
    });
}());
