import { GenericException } from '@specialblend/exceptional';

import { Logger, LogLevel } from './src/Logger';

(function main() {

    const logger = new Logger({ name: 'myApp', namespace: 'app', level: LogLevel.SILLY });
    logger.type('panic').fatal({
        message: '.',
        foo: 'sedxfrghj',
    });

    logger.type('unhandled_error').error({
        message: 'i caught an unhandled error.',
        baz: 'test baz',
        err: new Error('oops!'),
    });

    logger.type('creating_product').trace({
        message: 'i am about to create a new product by calling the foo-products api.',
        url: 'https://foo-api.example.com/api/products',
        product: {
            name: 'test product #1',
            sku: '12345',
        },
    });
    logger.debug({
        message: 'Here is more information about stuff when stuff broke.',
        foo: 'test foo',
    });
    logger.warn({
        message: 'This shouldn\'t be happening. You should be ashamed of yourself.',
        bar: 'test bar',
    });
    logger.info({
        message: 'ok. i am now connected to postgres.',
        host: 'https://postgres-backend.example.com',
    });
    logger.type('random_thought').silly({
        message: 'you are awesome.',
        foo: 'test foo',
    });

    class MissingTokenEx extends GenericException {}

    logger.exception(
        new MissingTokenEx(
            'request is missing auth token. please review'
        ),
        LogLevel.ERROR
    );

}());
