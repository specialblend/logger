/* eslint-disable @typescript-eslint/no-var-requires */
(function sandbox() {
    const { Logger } = require('../lib/Logger');
    const loggerOptions = {
        name: 'foo',
        namespace: 'bar',
    };
    const metadata = {
        instanceId: '4d65f7yg8ui',
    };
    const logger = new Logger(loggerOptions, metadata);
    logger.error({
        alpha: 'test.alpha',
        bravo: 'test.bravo',
    });
}());
