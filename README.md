# Logger

type-safe, namespaced, normalized JSON logger for JavaScript and TypeScript

### Install

`npm install @specialblend/logger`

### Usage

```typescript

import 'jest-extended';

import cuid from 'cuid';

import { Logger, LoggerOptions, LogLevel } from './src/Logger';

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

                throw new Error;

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

```

### Philosophy

write logs for machines, not for humans.

- logs should be JSON
- logs should be typed (namespaced) to 
  - allow machines to analyze them properly
  - allow timeseries data storage (e.g. elastic) to index them properly
