/**
 * am i javascript that thinks it's rust?
 */
/* eslint-disable camelcase */

import 'jest-extended';

import cuid from 'cuid';

import { Logger, LoggerOptions, LogLevel } from './src/Logger';

async function moodring(logger: Logger, mood = Math.round(Math.random() * 7)) {

    logger.type('moodring_thinking').silly({
        message: 'Magic Mirror, on the wall, who, now, is the fairest one of all?',
        mood: -1,
    });

    const level = LogLevel[mood];

    logger.type('moodring_ready').info({
        mood,
    });

    logger.type('moodring_acting').silly({
        message: 'i am tipsy.',
        mood,
    });

    if (mood < 1) {

        logger.type('moodring_acting').fatal({
            message: 'i am dead.',
            mood,
        });

        throw new TypeError;

    }

    if (mood < 2) {

        logger.type('moodring_acting').error({
            message: 'am i dead?',
            mood,
        });

        throw new Error;

    }

    if (mood < 3) {

        logger.type('moodring_acting').warn({
            message: 'i am not good.',
            mood,
        });

        Promise.reject();

    }

    if (mood < 4) {

        logger.type('moodring_acting').info({
            message: 'i am okay.',
            mood,
        });

    }

    if (mood < 5) {

        logger.type('moodring_acting').debug({
            message: 'i am good.',
            mood,
        });

    }

    if (mood < 6) {

        logger.type('moodring_acting').trace({
            message: 'i am great.',
            mood,
        });

    }

    logger.type('moodring_complete').debug({
        mood,
    });
}

describe('Logger', () => {
    const logger_options: LoggerOptions = {
        level: LogLevel.SILLY,
        name: 'parabellum',
        namespace: 'boot',
    };
    const logger_metadata = {
        instance_id: cuid(),
    };
    const logger = new Logger(logger_options, logger_metadata);
    test('namespace: boot', async() => {
        await (async function boot() {

            const config = {
                env: {
                    PORT: process.env.PORT,
                    NODE_ENV: process.env.NODE_ENV,
                },
            };

            try {
                logger.trace({
                    message: 'i am about to boot the server with this configuration.',
                    config,
                });

                await moodring(logger, 0);

                logger.info({
                    message: 'ok. i have booted the server with this configuration.',
                    config,
                });

            } catch (err) {

                const { message, stack } = err;

                logger.error({
                    message: 'an unhandled error has occured',
                    err: {
                        message,
                        stack,
                    },
                    config,
                });

                console.error(err);
            }
        }());
    });
    test('namespace: custom', async() => {
        await (async function boot() {

            const config = {
                env: {
                    PORT: process.env.PORT,
                    NODE_ENV: process.env.NODE_ENV,
                },
            };

            try {
                logger.type('app_booting').trace({
                    message: 'i am about to boot the server with this configuration.',
                    config,
                });

                await moodring(logger, 0);

                logger.type('app_booted').info({
                    message: 'ok. i have booted the server with this configuration.',
                    config,
                });

            } catch (err) {

                const { message, stack } = err;

                logger.type('app_boot_failed').error({
                    message: 'an unhandled error has occured',
                    err: {
                        message,
                        stack,
                    },
                    config,
                });

                console.error(err);
            }
        }());
    });
});
