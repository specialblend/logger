/* eslint-disable no-void */
import { Exception } from '@specialblend/exceptional';
import { taggedMocks } from '@specialblend/tagged-mocks';
import flatten from 'flat';

import createLogger, { construct_record, Logger, LogLevel, normalize_record } from './Logger';

console.log = jest.fn(void console.log);
console.error = jest.fn(void console.error);

const $LOG_LEVELS = [
    ['LoggerLevel.FATAL', LogLevel.FATAL, console.error],
    ['LoggerLevel.ERROR', LogLevel.ERROR, console.error],
    ['LoggerLevel.WARN', LogLevel.WARN, console.log],
    ['LoggerLevel.INFO', LogLevel.INFO, console.log],
    ['LoggerLevel.DEBUG', LogLevel.DEBUG, console.log],
    ['LoggerLevel.TRACE', LogLevel.TRACE, console.log],
    ['LoggerLevel.SILLY', LogLevel.SILLY, console.log],
];

describe('createLogger', () => {
    test('is Function', () => {
        expect(createLogger).toBeFunction();
    });
    describe('when called', () => {
        describe('with no metadata', () => {
            const $options = {
                name: 'test_app',
                namespace: 'test_namespace',
            };
            const $logger = createLogger($options);
            test('it returns instanceof Logger', () => {
                expect($logger).toBeInstanceOf(Logger);
            });
            describe('method', () => {
                describe('construct_record', () => {
                    test('is Function', () => {
                        expect(construct_record).toBeFunction();
                    });
                    describe('when called', () => {
                        test('returns expected object', () => {
                            const $level = LogLevel.FATAL;
                            const $data = {
                                foo: 'test.foo',
                                bar: 'test.bar',
                            };
                            const $expectedType = `${$options.name}.${$options.namespace}`;
                            const $message = construct_record($logger, $level, $data);
                            expect($message).toBeInstanceOf(Object);
                            expect($message).toBeInstanceOf(Object);
                            expect($message).toMatchObject({
                                '@name': $options.name,
                                '@type': $expectedType,
                                data: {
                                    [$options.namespace]: {
                                        ...$data,
                                    },
                                },
                            });
                        });
                    });
                });
            });
        });
        describe('with metadata', () => {
            const $options = {
                name: 'test_app',
                namespace: 'test_namespace',
            };
            const $metadata = {
                alpha: 'alpha.test',
                bravo: 'bravo.test',
            };
            const $logger = createLogger($options, $metadata);
            test('it returns instanceof Logger', () => {
                expect($logger).toBeInstanceOf(Logger);
            });
            describe('method', () => {
                describe('construct_record', () => {
                    test('is Function', () => {
                        expect(construct_record).toBeFunction();
                    });
                    describe('when called', () => {
                        test('returns expected object', () => {
                            const $level = LogLevel.FATAL;
                            const $data = {
                                foo: 'test.foo',
                                bar: 'test.bar',
                            };
                            const $expectedType = `${$options.name}.${$options.namespace}`;
                            const $message = construct_record($logger, $level, $data);
                            expect($message).toBeInstanceOf(Object);
                            expect($message).toMatchObject({
                                ...$metadata,
                                '@name': $options.name,
                                '@type': $expectedType,
                                data: {
                                    [$options.namespace]: {
                                        ...$data,
                                    },
                                },
                            });
                        });
                    });
                });
            });
        });
    });
});

describe('AppLogger extends Logger', () => {

    class AppLogger extends Logger {}

    describe('when called', () => {
        describe('without loglevel', () => {
            const $options = {
                name: 'test_app',
                namespace: 'test_namespace',
                level: LogLevel.SILLY,
            };
            const $fancyMetadata = {
                alpha: 'alpha.test',
                bravo: 'bravo.test',
            };
            const $app_logger = new AppLogger($options, $fancyMetadata);
            test('it returns instance of Logger', () => {
                expect($app_logger).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($app_logger.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test_foo',
                            bar: 'test_bar',
                        };
                        beforeAll(() => {
                            $app_logger.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($app_logger.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($app_logger.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($app_logger.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger.info($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger, LogLevel.INFO, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($app_logger.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger.debug($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger, LogLevel.DEBUG, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($app_logger.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger.trace($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger, LogLevel.TRACE, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($app_logger.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger.silly($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger, LogLevel.SILLY, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($app_logger.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            fancy: 'shmancy',
                        };
                        const $logger = $app_logger.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($logger).toBeInstanceOf(Logger);
                            expect($logger).toBeInstanceOf(AppLogger);
                            expect($logger.options.name).toBe($logger.options.name);
                            expect($logger.options.namespace).toBe($logger.options.namespace);
                            expect($logger.metadata).toBeInstanceOf(Object);
                            expect($logger.metadata).toMatchObject({
                                ...$fancyMetadata,
                                ...$superFancyMetadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($logger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($logger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($logger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($logger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($logger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($logger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($logger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.SILLY, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($app_logger.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $app_logger.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($app_logger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($app_logger.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $app_logger.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($app_logger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('when loglevel = LoggerLevel.silly', () => {
            const $options = {
                name: 'test_app',
                namespace: 'test_namespace',
                level: LogLevel.SILLY,
            };
            const $metadata = {
                alpha: 'alpha.test',
                bravo: 'bravo.test',
            };
            const $logger = new AppLogger($options, $metadata);
            test('it returns instance of Logger', () => {
                expect($logger).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($logger.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $logger.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($logger, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($logger.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $logger.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($logger, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($logger.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $logger.debug($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($logger, LogLevel.DEBUG, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($logger.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $logger.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($logger, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($logger.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $logger.info($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($logger, LogLevel.INFO, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($logger.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $logger.trace($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($logger, LogLevel.TRACE, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($logger.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $logger.silly($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($logger, LogLevel.SILLY, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($logger.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            fancy: 'shmancy',
                        };
                        const $myFancyChildLogger = $logger.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($myFancyChildLogger).toBeInstanceOf(Logger);
                            expect($myFancyChildLogger).toBeInstanceOf(AppLogger);
                            expect($myFancyChildLogger.options.name).toBe($logger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($logger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ...$metadata,
                                ...$superFancyMetadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.SILLY, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($logger.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $logger.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($logger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($logger.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $logger.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($logger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('when loglevel = LoggerLevel.trace', () => {
            const $options = {
                name: 'test_app1',
                namespace: 'test_namespace1',
                level: LogLevel.TRACE,
            };
            const $fancyMetadata = {
                alpha1: 'alpha.test1',
                bravo1: 'bravo.test1',
            };
            const $myFancyLogger = new AppLogger($options, $fancyMetadata);
            test('it returns instance of Logger', () => {
                expect($myFancyLogger).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.debug($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.DEBUG, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.info($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.trace($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            fancy: 'shmancy',
                        };
                        const $myFancyChildLogger = $myFancyLogger.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($myFancyChildLogger).toBeInstanceOf(Logger);
                            expect($myFancyChildLogger).toBeInstanceOf(AppLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ...$fancyMetadata,
                                ...$superFancyMetadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $myFancyLogger.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $myFancyLogger.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('when loglevel = LoggerLevel.debug', () => {
            const $options = {
                name: 'test_app4',
                namespace: 'test_namespace4',
                level: LogLevel.DEBUG,
            };
            const $fancyMetadata = {
                alpha4: 'alpha.test4',
                bravo4: 'bravo.test4',
            };
            const $myFancyLogger = new AppLogger($options, $fancyMetadata);
            test('it returns instance of Logger', () => {
                expect($myFancyLogger).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });

                describe('warn', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });

                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.info($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.debug($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.DEBUG, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.trace($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            fancy: 'shmancy',
                        };
                        const $myFancyChildLogger = $myFancyLogger.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($myFancyChildLogger).toBeInstanceOf(Logger);
                            expect($myFancyChildLogger).toBeInstanceOf(AppLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ...$fancyMetadata,
                                ...$superFancyMetadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $myFancyLogger.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });

                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('does write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('does write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $myFancyLogger.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('does write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('does write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });

                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('when loglevel = LoggerLevel.info', () => {
            const $options = {
                name: 'test_app2',
                namespace: 'test_namespace2',
                level: LogLevel.INFO,
            };
            const $fancyMetadata = {
                alpha2: 'alpha.test2',
                bravo2: 'bravo.test2',
            };
            const $myFancyLogger = new AppLogger($options, $fancyMetadata);
            test('it returns instance of Logger', () => {
                expect($myFancyLogger).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.info($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.debug($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.DEBUG, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.trace($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            fancy: 'shmancy',
                        };
                        const $myFancyChildLogger = $myFancyLogger.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($myFancyChildLogger).toBeInstanceOf(Logger);
                            expect($myFancyChildLogger).toBeInstanceOf(AppLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ...$fancyMetadata,
                                ...$superFancyMetadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $myFancyLogger.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $myFancyLogger.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });

                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('when loglevel = LoggerLevel.warn', () => {
            const $options = {
                name: 'test_app3',
                namespace: 'test_namespace3',
                level: LogLevel.WARN,
            };
            const $fancyMetadata = {
                alpha1: 'alpha.test1',
                bravo1: 'bravo.test1',
            };
            const $myFancyLogger = new AppLogger($options, $fancyMetadata);
            test('it returns instance of Logger', () => {
                expect($myFancyLogger).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });

                describe('warn', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.info($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.debug($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.DEBUG, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.trace($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            fancy: 'shmancy',
                        };
                        const $myFancyChildLogger = $myFancyLogger.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($myFancyChildLogger).toBeInstanceOf(Logger);
                            expect($myFancyChildLogger).toBeInstanceOf(AppLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ...$fancyMetadata,
                                ...$superFancyMetadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $myFancyLogger.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $myFancyLogger.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('when loglevel = LoggerLevel.error', () => {
            const $options = {
                name: 'test_app5',
                namespace: 'test_namespace5',
                level: LogLevel.ERROR,
            };
            const $fancyMetadata = {
                alpha5: 'alpha.test5',
                bravo5: 'bravo.test5',
            };
            const $myFancyLogger = new AppLogger($options, $fancyMetadata);
            test('it returns instance of Logger', () => {
                expect($myFancyLogger).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.debug($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.DEBUG, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.warn($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.info($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.trace($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $myFancyLogger.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            fancy: 'shmancy',
                        };
                        const $myFancyChildLogger = $myFancyLogger.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($myFancyChildLogger).toBeInstanceOf(Logger);
                            expect($myFancyChildLogger).toBeInstanceOf(AppLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ...$fancyMetadata,
                                ...$superFancyMetadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.warn($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($myFancyChildLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $myFancyChildLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyChildLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $myFancyLogger.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($myFancyLogger.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $mySuperFancySiblingLogger = $myFancyLogger.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(Logger);
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(AppLogger);
                            expect($mySuperFancySiblingLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($mySuperFancySiblingLogger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.warn($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.WARN, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($myFancyLogger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($mySuperFancySiblingLogger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $mySuperFancySiblingLogger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($mySuperFancySiblingLogger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('when loglevel = LoggerLevel.fatal', () => {
            const $options = {
                name: 'test_app6',
                namespace: 'test_namespace6',
                level: LogLevel.FATAL,
            };
            const $fancyMetadata = {
                alpha5: 'alpha.test5',
                bravo5: 'bravo.test5',
            };
            const $my_fancy_logger = new AppLogger($options, $fancyMetadata);
            test('it returns instance of Logger', () => {
                expect($my_fancy_logger).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($my_fancy_logger.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $my_fancy_logger.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($my_fancy_logger, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($my_fancy_logger.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $my_fancy_logger.error($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($my_fancy_logger, LogLevel.ERROR, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($my_fancy_logger.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $my_fancy_logger.debug($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($my_fancy_logger, LogLevel.DEBUG, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($my_fancy_logger.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $my_fancy_logger.warn($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($my_fancy_logger, LogLevel.WARN, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($my_fancy_logger.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $my_fancy_logger.info($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($my_fancy_logger, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($my_fancy_logger.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $my_fancy_logger.trace($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($my_fancy_logger, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($my_fancy_logger.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $my_fancy_logger.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($my_fancy_logger, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($my_fancy_logger.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            fancy: 'shmancy',
                        };
                        const $logger = $my_fancy_logger.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($logger).toBeInstanceOf(Logger);
                            expect($logger).toBeInstanceOf(AppLogger);
                            expect($logger.options.name).toBe($my_fancy_logger.options.name);
                            expect($logger.options.namespace).toBe($my_fancy_logger.options.namespace);
                            expect($logger.metadata).toBeInstanceOf(Object);
                            expect($logger.metadata).toMatchObject({
                                ...$fancyMetadata,
                                ...$superFancyMetadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($logger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($logger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.error($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.ERROR, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($logger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($logger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.warn($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.WARN, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($logger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($logger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($logger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($my_fancy_logger.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $logger = $my_fancy_logger.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($logger).toBeInstanceOf(Logger);
                            expect($logger).toBeInstanceOf(AppLogger);
                            expect($logger.options.name).toBe($logger.options.name);
                            expect($logger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($logger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($logger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.error($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.ERROR, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($logger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($logger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.warn($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.WARN, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($logger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($logger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($logger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($my_fancy_logger.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = 'super_fancy_namespace';
                        const $logger = $my_fancy_logger.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($logger).toBeInstanceOf(Logger);
                            expect($logger).toBeInstanceOf(AppLogger);
                            expect($logger.options.name).toBe($logger.options.name);
                            expect($logger.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($logger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.fatal($data);
                                    });
                                    const $expected_record = construct_record($logger, LogLevel.FATAL, $data);
                                    const $expected_normalized_record = normalize_record($expected_record);
                                    expect(console.error).toHaveBeenCalledWith('%j', $expected_normalized_record);
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($logger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.error($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.ERROR, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($logger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($logger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.warn($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.WARN, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($logger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($logger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($logger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $logger.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($logger, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    describe('exception', () => {
        const $name = 'test_app00';
        const $namespace = 'test_namespace00';
        const $logger = new AppLogger({
            name: $name,
            namespace: $namespace,
            level: LogLevel.SILLY,
        });
        test('is Function', () => {
            expect($logger.exception).toBeFunction();
        });
        describe('when called', () => {
            describe('without err', () => {
                describe('with no log level', () => {
                    const $mocks = taggedMocks('MyFancyLogger->exception');
                    const $exMessage = $mocks.uniqueSafeTag('message');
                    const $exData = {
                        foo: $mocks.uniqueSafeTag('foo'),
                        bar: $mocks.uniqueSafeTag('bar'),
                        baz: $mocks.uniqueSafeTag('baz'),
                    };
                    const $ex = new Exception($exMessage, $exData);
                    beforeAll(() => {
                        console.error.mockClear();
                        $logger.exception($ex);
                    });
                    test('calls console.error with expected payload', () => {
                        const $data = {
                            code: 'Exception',
                            message: $exMessage,
                            data: $exData,
                        };
                        const $expected_record = construct_record($logger, LogLevel.ERROR, $data);
                        const $expected_normalized_record = normalize_record($expected_record);
                        expect(console.error).toHaveBeenCalledWith('%j', $expected_normalized_record);
                    });
                });
                describe('when log level is', () => {
                    describe.each($LOG_LEVELS)('%s', (_$, $level, $output) => {
                        const $mocks = taggedMocks('MyFancyLogger->exception');
                        const $exMessage = $mocks.uniqueSafeTag('message');
                        const $exData = {
                            foo: $mocks.uniqueSafeTag('foo'),
                            bar: $mocks.uniqueSafeTag('bar'),
                            baz: $mocks.uniqueSafeTag('baz'),
                        };
                        const $ex = new Exception($exMessage, $exData);
                        beforeAll(() => {
                            $output.mockClear();
                            $logger.exception($ex, $level);
                        });
                        test('calls expected output with expected payload', () => {
                            const $data = {
                                code: 'Exception',
                                message: $exMessage,
                                data: $exData,
                            };
                            const $expected_record = construct_record($logger, $level, $data);
                            const $expected_normalized_record = normalize_record($expected_record);
                            expect($output).toHaveBeenCalledWith('%j', $expected_normalized_record);
                        });
                    });
                });
            });
            describe('with err', () => {
                describe('with no log level', () => {
                    const $mocks = taggedMocks('MyFancyLogger->exception');
                    const $exMessage = $mocks.uniqueSafeTag('message');
                    const $err = new Error($mocks.uniqueSafeTag('err'));
                    const $exData = {
                        foo: $mocks.uniqueSafeTag('foo'),
                        bar: $mocks.uniqueSafeTag('bar'),
                        baz: $mocks.uniqueSafeTag('baz'),
                    };
                    const $ex = new Exception($exMessage, $exData, $err);
                    beforeAll(() => {
                        console.error.mockClear();
                        $logger.exception($ex);
                    });
                    test('calls console.error with expected payload', () => {
                        const $data = {
                            code: 'Exception',
                            message: $exMessage,
                            data: $exData,
                            err: {
                                message: $err.message,
                                stack: $err.stack,
                            },
                        };
                        const $expected_record = construct_record($logger, LogLevel.ERROR, $data);
                        const $expected_normalized_record = normalize_record($expected_record);
                        expect(console.error).toHaveBeenCalledWith('%j', $expected_normalized_record);
                    });
                });
                describe('when log level is', () => {
                    describe.each($LOG_LEVELS)('%s', (_$, $level, $output) => {
                        const $mocks = taggedMocks('MyFancyLogger->exception');
                        const $exMessage = $mocks.uniqueSafeTag('message');
                        const $err = new Error($mocks.uniqueSafeTag('err'));
                        const $exData = {
                            foo: $mocks.uniqueSafeTag('foo'),
                            bar: $mocks.uniqueSafeTag('bar'),
                            baz: $mocks.uniqueSafeTag('baz'),
                        };
                        const $ex = new Exception($exMessage, $exData, $err);
                        beforeAll(() => {
                            $output.mockClear();
                            $logger.exception($ex, $level);
                        });
                        test('calls expected output with expected payload', () => {
                            const $data = {
                                code: 'Exception',
                                message: $exMessage,
                                data: $exData,
                                err: {
                                    message: $err.message,
                                    stack: $err.stack,
                                },
                            };
                            const $expected_record = construct_record($logger, $level, $data);
                            const $expected_normalized_record = normalize_record($expected_record);
                            expect($output).toHaveBeenCalledWith('%j', $expected_normalized_record);
                        });
                    });
                });
            });
        });
    });
});
