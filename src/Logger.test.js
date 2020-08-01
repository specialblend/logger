/* eslint-disable no-void */
import { Exception } from '@specialblend/exceptional';
import { taggedMocks } from '@specialblend/tagged-mocks';

import createLogger, { construct_record, Logger, LogLevel, normalize_record, parse_loglevel } from './Logger';

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

function taggedMocksForLogger($logger, $method_name, $class_name = $logger.constructor.name) {
    const { level } = $logger.options;
    const [, level_name] = parse_loglevel(level);
    return taggedMocks(`(<new ${$class_name}({ level: LogLevel.${level_name} })>)->${$method_name}`);
}

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
                name: 'app_logger',
                namespace: 'app_logger_namespae',
                level: LogLevel.SILLY,
            };
            const $metadata = {
                alpha: 'alpha.test',
                bravo: 'bravo.test',
            };
            const $app_logger = new AppLogger($options, $metadata);
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
                            foo: 'test_foo',
                        };
                        const $logger = $app_logger.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($logger).toBeInstanceOf(Logger);
                            expect($logger).toBeInstanceOf(AppLogger);
                            expect($logger.options.name).toBe($logger.options.name);
                            expect($logger.options.namespace).toBe($logger.options.namespace);
                            expect($logger.metadata).toBeInstanceOf(Object);
                            expect($logger.metadata).toMatchObject({
                                ...$metadata,
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
                        const $namespace = '$app_logger_sibling';
                        const $app_logger_sibling = $app_logger.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_sibling.options.name).toBe($app_logger.options.name);
                            expect($app_logger_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_sibling.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_sibling.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_sibling, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_sibling.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_sibling, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_sibling.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_sibling, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_sibling.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_sibling, LogLevel.SILLY, $data));
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
                        const $namespace = '$app_logger_type_sibling';
                        const $app_logger_type_sibling = $app_logger.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_type_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_type_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_type_sibling.options.name).toBe($app_logger.options.name);
                            expect($app_logger_type_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_type_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_type_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_type_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_type_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_type_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_type_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_type_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_type_sibling.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_type_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_type_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_type_sibling.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_type_sibling, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_type_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_type_sibling.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_type_sibling, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_type_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_type_sibling.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_type_sibling, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_type_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_type_sibling.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_type_sibling, LogLevel.SILLY, $data));
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
            const $app_logger_silly = new AppLogger($options, $metadata);
            test('it returns instance of Logger', () => {
                expect($app_logger_silly).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($app_logger_silly.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_silly.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_silly, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($app_logger_silly.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_silly.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_silly, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($app_logger_silly.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_silly.debug($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_silly, LogLevel.DEBUG, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($app_logger_silly.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_silly.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_silly, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($app_logger_silly.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_silly.info($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_silly, LogLevel.INFO, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($app_logger_silly.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_silly.trace($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_silly, LogLevel.TRACE, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($app_logger_silly.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_silly.silly($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_silly, LogLevel.SILLY, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($app_logger_silly.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $child_metadata = {
                            foo: 'test_foo',
                        };
                        const $child_app_logger = $app_logger_silly.child($child_metadata);
                        test('it returns expected Logger', () => {
                            expect($child_app_logger).toBeInstanceOf(Logger);
                            expect($child_app_logger).toBeInstanceOf(AppLogger);
                            expect($child_app_logger.options.name).toBe($app_logger_silly.options.name);
                            expect($child_app_logger.options.namespace).toBe($app_logger_silly.options.namespace);
                            expect($child_app_logger.metadata).toBeInstanceOf(Object);
                            expect($child_app_logger.metadata).toMatchObject({
                                ...$metadata,
                                ...$child_metadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($child_app_logger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $child_app_logger.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($child_app_logger, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($child_app_logger.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $child_app_logger.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($child_app_logger, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($child_app_logger.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $child_app_logger.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($child_app_logger, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($child_app_logger.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $child_app_logger.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($child_app_logger, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($child_app_logger.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $child_app_logger.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($child_app_logger, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($child_app_logger.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $child_app_logger.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($child_app_logger, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($child_app_logger.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $child_app_logger.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($child_app_logger, LogLevel.SILLY, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($app_logger_silly.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_silly_sibling';
                        const $app_logger_silly_sibling = $app_logger_silly.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_silly_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_silly_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_silly_sibling.options.name).toBe($app_logger_silly.options.name);
                            expect($app_logger_silly_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_sibling.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_sibling.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_sibling, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_sibling.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_sibling, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_sibling.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_sibling, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_sibling.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_sibling, LogLevel.SILLY, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($app_logger_silly.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_silly_type_sibling';
                        const $app_logger_silly_type_sibling = $app_logger_silly.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_silly_type_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_silly_type_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_silly_type_sibling.options.name).toBe($app_logger_silly.options.name);
                            expect($app_logger_silly_type_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_type_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_type_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_type_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_type_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_type_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_type_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_type_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_type_sibling.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_type_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_type_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_type_sibling.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_type_sibling, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_type_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_type_sibling.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_type_sibling, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_type_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_type_sibling.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_type_sibling, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_silly_type_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_silly_type_sibling.silly($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_silly_type_sibling, LogLevel.SILLY, $data));
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
            const $metadata = {
                alpha1: 'alpha.test1',
                bravo1: 'bravo.test1',
            };
            const $app_logger_trace = new AppLogger($options, $metadata);
            test('it returns instance of Logger', () => {
                expect($app_logger_trace).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($app_logger_trace.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_trace.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_trace, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($app_logger_trace.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_trace.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_trace, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($app_logger_trace.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_trace.debug($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_trace, LogLevel.DEBUG, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($app_logger_trace.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_trace.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_trace, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($app_logger_trace.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_trace.info($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_trace, LogLevel.INFO, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($app_logger_trace.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_trace.trace($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_trace, LogLevel.TRACE, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($app_logger_trace.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_trace.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_trace, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($app_logger_trace.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $app_logger_trace_metadata = {
                            foo: 'test_foo',
                        };
                        const $app_logger_trace_child = $app_logger_trace.child($app_logger_trace_metadata);
                        test('it returns expected Logger', () => {
                            expect($app_logger_trace_child).toBeInstanceOf(Logger);
                            expect($app_logger_trace_child).toBeInstanceOf(AppLogger);
                            expect($app_logger_trace_child.options.name).toBe($app_logger_trace.options.name);
                            expect($app_logger_trace_child.options.namespace).toBe($app_logger_trace.options.namespace);
                            expect($app_logger_trace_child.metadata).toBeInstanceOf(Object);
                            expect($app_logger_trace_child.metadata).toMatchObject({
                                ...$app_logger_trace_metadata,
                                ...$app_logger_trace_metadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_child.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_child.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_child, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_child.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_child.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_child, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_child.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_child.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_child, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_child.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_child.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_child, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_child.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_child.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_child, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_child.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_child.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_child, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_child.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_child.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_child, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($app_logger_trace.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_trace_sibling';
                        const $app_logger_trace_sibling = $app_logger_trace.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_trace_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_trace_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_trace_sibling.options.name).toBe($app_logger_trace.options.name);
                            expect($app_logger_trace_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_sibling.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_sibling.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_sibling, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_sibling.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_sibling, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_sibling.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_sibling, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_sibling, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($app_logger_trace.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_trace_type_sibling';
                        const $app_logger_trace_type_sibling = $app_logger_trace.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_trace_type_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_trace_type_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_trace_type_sibling.options.name).toBe($app_logger_trace.options.name);
                            expect($app_logger_trace_type_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_type_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_type_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_type_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_type_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_type_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_type_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_type_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_type_sibling.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_type_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_type_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_type_sibling.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_type_sibling, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_type_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_type_sibling.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_type_sibling, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_type_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_type_sibling.trace($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_type_sibling, LogLevel.TRACE, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_trace_type_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_trace_type_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_trace_type_sibling, LogLevel.SILLY, $data));
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
            const $metadata = {
                alpha4: 'alpha.test4',
                bravo4: 'bravo.test4',
            };
            const $app_logger_debug = new AppLogger($options, $metadata);
            test('it returns instance of Logger', () => {
                expect($app_logger_debug).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($app_logger_debug.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_debug.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($app_logger_debug.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_debug.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });

                describe('warn', () => {
                    test('is Function', () => {
                        expect($app_logger_debug.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_debug.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });

                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($app_logger_debug.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_debug.info($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($app_logger_debug.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_debug.debug($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.DEBUG, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($app_logger_debug.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_debug.trace($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($app_logger_debug.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_debug.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($app_logger_debug.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $app_logger_debug_child_metadata = {
                            foo: 'test_foo',
                        };
                        const $app_logger_debug_child = $app_logger_debug.child($app_logger_debug_child_metadata);
                        test('it returns expected Logger', () => {
                            expect($app_logger_debug_child).toBeInstanceOf(Logger);
                            expect($app_logger_debug_child).toBeInstanceOf(AppLogger);
                            expect($app_logger_debug_child.options.name).toBe($app_logger_debug.options.name);
                            expect($app_logger_debug_child.options.namespace).toBe($app_logger_debug.options.namespace);
                            expect($app_logger_debug_child.metadata).toBeInstanceOf(Object);
                            expect($app_logger_debug_child.metadata).toMatchObject({
                                ...$app_logger_debug_child_metadata,
                                ...$app_logger_debug_child_metadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_child.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_child.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_child, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_child.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_child.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_child, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_child.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_child.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_child.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_child.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_child.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_child.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_child, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_child.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_child.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_child.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_child.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_child, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($app_logger_debug.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_debug_sibling';
                        const $app_logger_debug_sibling = $app_logger_debug.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_debug_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_debug_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_debug_sibling.options.name).toBe($app_logger_debug.options.name);
                            expect($app_logger_debug_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });

                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_sibling.warn($data);
                                    });
                                    test('does write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_sibling.info($data);
                                    });
                                    test('does write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_sibling.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_sibling.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_sibling, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($app_logger_debug.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_debug_type_sibling';
                        const $app_logger_debug_type_sibling = $app_logger_debug.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_debug_type_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_debug_type_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_debug_type_sibling.options.name).toBe($app_logger_debug.options.name);
                            expect($app_logger_debug_type_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_type_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_type_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_type_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_type_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_type_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_type_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_type_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_type_sibling.warn($data);
                                    });
                                    test('does write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_type_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_type_sibling.info($data);
                                    });
                                    test('does write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_type_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_type_sibling.debug($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_type_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });

                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_type_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_type_sibling.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_debug_type_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_debug_type_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_debug_type_sibling, LogLevel.SILLY, $data));
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
            const $metadata = {
                alpha2: 'alpha.test2',
                bravo2: 'bravo.test2',
            };
            const $app_logger_info = new AppLogger($options, $metadata);
            test('it returns instance of Logger', () => {
                expect($app_logger_info).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($app_logger_info.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_info.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($app_logger_info.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_info.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($app_logger_info.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_info.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($app_logger_info.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_info.info($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.INFO, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($app_logger_info.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_info.debug($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.DEBUG, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($app_logger_info.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_info.trace($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($app_logger_info.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_info.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($app_logger_info.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $app_logger_info_child_metadata = {
                            foo: 'test_foo',
                        };
                        const $app_logger_info_child = $app_logger_info.child($app_logger_info_child_metadata);
                        test('it returns expected Logger', () => {
                            expect($app_logger_info_child).toBeInstanceOf(Logger);
                            expect($app_logger_info_child).toBeInstanceOf(AppLogger);
                            expect($app_logger_info_child.options.name).toBe($app_logger_info.options.name);
                            expect($app_logger_info_child.options.namespace).toBe($app_logger_info.options.namespace);
                            expect($app_logger_info_child.metadata).toBeInstanceOf(Object);
                            expect($app_logger_info_child.metadata).toMatchObject({
                                ...$app_logger_info_child_metadata,
                                ...$app_logger_info_child_metadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_child.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_child.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_child, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_child.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_child.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_child, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_child.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_child.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_child, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_child.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_child.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_child, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_child.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_child.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_child.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_child.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_child.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_child.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_child, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('sibling', () => {
                    test('is Function', () => {
                        expect($app_logger_info.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_info_sibling';
                        const $app_logger_info_sibling = $app_logger_info.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_info_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_info_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_info_sibling.options.name).toBe($app_logger_info.options.name);
                            expect($app_logger_info_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_sibling.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_sibling, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_sibling.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_sibling, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_sibling.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_sibling.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_sibling, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($app_logger_info.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_info_type_sibling';
                        const $app_logger_info_type_sibling = $app_logger_info.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_info_type_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_info_type_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_info_type_sibling.options.name).toBe($app_logger_info.options.name);
                            expect($app_logger_info_type_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_type_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_type_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_type_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_type_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_type_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_type_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });

                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_type_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_type_sibling.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_type_sibling, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_type_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_type_sibling.info($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_type_sibling, LogLevel.INFO, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_type_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_type_sibling.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_type_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_type_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_type_sibling.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_info_type_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_info_type_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_info_type_sibling, LogLevel.SILLY, $data));
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
            const $metadata = {
                alpha1: 'alpha.test1',
                bravo1: 'bravo.test1',
            };
            const $app_logger_warn = new AppLogger($options, $metadata);
            test('it returns instance of Logger', () => {
                expect($app_logger_warn).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($app_logger_warn.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_warn.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($app_logger_warn.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_warn.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });

                describe('warn', () => {
                    test('is Function', () => {
                        expect($app_logger_warn.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_warn.warn($data);
                        });
                        test('writes to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.WARN, $data));
                            expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($app_logger_warn.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_warn.info($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($app_logger_warn.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_warn.debug($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.DEBUG, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($app_logger_warn.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_warn.trace($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($app_logger_warn.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_warn.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($app_logger_warn.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            foo: 'test_foo',
                        };
                        const $myFancyChildLogger = $app_logger_warn.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($myFancyChildLogger).toBeInstanceOf(Logger);
                            expect($myFancyChildLogger).toBeInstanceOf(AppLogger);
                            expect($myFancyChildLogger.options.name).toBe($app_logger_warn.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($app_logger_warn.options.namespace);
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
                                        const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.INFO, $data));
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
                                        const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.TRACE, $data));
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
                        expect($app_logger_warn.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_warn_sibling';
                        const $app_logger_warn_sibling = $app_logger_warn.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_warn_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_warn_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_warn_sibling.options.name).toBe($app_logger_warn.options.name);
                            expect($app_logger_warn_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_sibling.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn_sibling, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_sibling.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_sibling.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_sibling.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn_sibling, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($app_logger_warn.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_warn_type_sibling';
                        const $app_logger_warn_type_sibling = $app_logger_warn.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_warn_type_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_warn_type_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_warn_type_sibling.options.name).toBe($app_logger_warn.options.name);
                            expect($app_logger_warn_type_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_type_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_type_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn_type_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_type_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_type_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn_type_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_type_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_type_sibling.warn($data);
                                    });
                                    test('writes to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn_type_sibling, LogLevel.WARN, $data));
                                        expect(console.log).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_type_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_type_sibling.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_type_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_type_sibling.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn_type_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_type_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_type_sibling.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_warn_type_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_warn_type_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_warn_type_sibling, LogLevel.SILLY, $data));
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
            const $metadata = {
                alpha5: 'alpha.test5',
                bravo5: 'bravo.test5',
            };
            const $app_logger_error = new AppLogger($options, $metadata);
            test('it returns instance of Logger', () => {
                expect($app_logger_error).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($app_logger_error.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_error.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($app_logger_error.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_error.error($data);
                        });
                        test('writes to expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.ERROR, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($app_logger_error.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_error.debug($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.DEBUG, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($app_logger_error.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_error.warn($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.WARN, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($app_logger_error.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_error.info($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($app_logger_error.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_error.trace($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($app_logger_error.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $data = {
                            foo: 'test.foo',
                            bar: 'test.bar',
                        };
                        beforeAll(() => {
                            $app_logger_error.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($app_logger_error.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            foo: 'test_foo',
                        };
                        const $myFancyChildLogger = $app_logger_error.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($myFancyChildLogger).toBeInstanceOf(Logger);
                            expect($myFancyChildLogger).toBeInstanceOf(AppLogger);
                            expect($myFancyChildLogger.options.name).toBe($app_logger_error.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($app_logger_error.options.namespace);
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
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.DEBUG, $data));
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
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.WARN, $data));
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
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.INFO, $data));
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
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.TRACE, $data));
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
                        expect($app_logger_error.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_error_sibling';
                        const $app_logger_error_sibling = $app_logger_error.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_error_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_error_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_error_sibling.options.name).toBe($app_logger_error.options.name);
                            expect($app_logger_error_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_sibling.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_sibling.warn($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.WARN, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_sibling.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_sibling.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error_sibling, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($app_logger_error.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_error_type_sibling';
                        const $app_logger_error_type_sibling = $app_logger_error.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_error_type_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_error_type_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_error_type_sibling.options.name).toBe($app_logger_error.options.name);
                            expect($app_logger_error_type_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_type_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_type_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error_type_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_type_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_type_sibling.error($data);
                                    });
                                    test('writes to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error_type_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_type_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_type_sibling.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_type_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_type_sibling.warn($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.WARN, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_type_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_type_sibling.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_type_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_type_sibling.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_error_type_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_error_type_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_error_type_sibling, LogLevel.SILLY, $data));
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
                name: 'test_app',
                namespace: 'test_namespace',
                level: LogLevel.FATAL,
            };
            const $metadata = {
                alpha: 'alpha.test',
                bravo: 'bravo.test',
            };
            const $app_logger_fatal = new AppLogger($options, $metadata);
            test('it returns instance of Logger', () => {
                expect($app_logger_fatal).toBeInstanceOf(Logger);
            });
            describe('logger method', () => {
                describe('fatal', () => {
                    test('is Function', () => {
                        expect($app_logger_fatal.fatal).toBeFunction();
                    });
                    describe('when called', () => {
                        const $mocks = taggedMocksForLogger($app_logger_fatal, 'fatal');
                        const $data = {
                            foo: $mocks.uniqueSafeTag('foo'),
                            bar: $mocks.uniqueSafeTag('bar'),
                        };
                        beforeAll(() => {
                            $app_logger_fatal.fatal($data);
                        });
                        test('calls expected stderr with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_fatal, LogLevel.FATAL, $data));
                            expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('error', () => {
                    test('is Function', () => {
                        expect($app_logger_fatal.error).toBeFunction();
                    });
                    describe('when called', () => {
                        const $mocks = taggedMocksForLogger($app_logger_fatal, 'error');
                        const $data = {
                            foo: $mocks.uniqueSafeTag('foo'),
                            bar: $mocks.uniqueSafeTag('bar'),
                        };
                        beforeAll(() => {
                            $app_logger_fatal.error($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_fatal, LogLevel.ERROR, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('debug', () => {
                    test('is Function', () => {
                        expect($app_logger_fatal.debug).toBeFunction();
                    });
                    describe('when called', () => {
                        const $mocks = taggedMocksForLogger($app_logger_fatal, 'debug');
                        const $data = {
                            foo: $mocks.uniqueSafeTag('foo'),
                            bar: $mocks.uniqueSafeTag('bar'),
                        };
                        beforeAll(() => {
                            $app_logger_fatal.debug($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_fatal, LogLevel.DEBUG, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('warn', () => {
                    test('is Function', () => {
                        expect($app_logger_fatal.warn).toBeFunction();
                    });
                    describe('when called', () => {
                        const $mocks = taggedMocksForLogger($app_logger_fatal, 'warn');
                        const $data = {
                            foo: $mocks.uniqueSafeTag('foo'),
                            bar: $mocks.uniqueSafeTag('bar'),
                        };
                        beforeAll(() => {
                            $app_logger_fatal.warn($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_fatal, LogLevel.WARN, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('info', () => {
                    test('is Function', () => {
                        expect($app_logger_fatal.info).toBeFunction();
                    });
                    describe('when called', () => {
                        const $mocks = taggedMocksForLogger($app_logger_fatal, 'info');
                        const $data = {
                            foo: $mocks.uniqueSafeTag('foo'),
                            bar: $mocks.uniqueSafeTag('bar'),
                        };
                        beforeAll(() => {
                            $app_logger_fatal.info($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_fatal, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('trace', () => {
                    test('is Function', () => {
                        expect($app_logger_fatal.trace).toBeFunction();
                    });
                    describe('when called', () => {
                        const $mocks = taggedMocksForLogger($app_logger_fatal, 'trace');
                        const $data = {
                            foo: $mocks.uniqueSafeTag('foo'),
                            bar: $mocks.uniqueSafeTag('bar'),
                        };
                        beforeAll(() => {
                            $app_logger_fatal.trace($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_fatal, LogLevel.TRACE, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
                describe('silly', () => {
                    test('is Function', () => {
                        expect($app_logger_fatal.silly).toBeFunction();
                    });
                    describe('when called', () => {
                        const $mocks = taggedMocksForLogger($app_logger_fatal, 'silly');
                        const $data = {
                            foo: $mocks.uniqueSafeTag('foo'),
                            bar: $mocks.uniqueSafeTag('bar'),
                        };
                        beforeAll(() => {
                            $app_logger_fatal.silly($data);
                        });
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expected_message = normalize_record(construct_record($app_logger_fatal, LogLevel.SILLY, $data));
                            expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                        });
                    });
                });
            });
            describe('method', () => {
                describe('child', () => {
                    test('is Function', () => {
                        expect($app_logger_fatal.child).toBeFunction();
                    });
                    describe('when called', () => {
                        const $superFancyMetadata = {
                            foo: 'test_foo',
                        };
                        const $logger = $app_logger_fatal.child($superFancyMetadata);
                        test('it returns expected Logger', () => {
                            expect($logger).toBeInstanceOf(Logger);
                            expect($logger).toBeInstanceOf(AppLogger);
                            expect($logger.options.name).toBe($app_logger_fatal.options.name);
                            expect($logger.options.namespace).toBe($app_logger_fatal.options.namespace);
                            expect($logger.metadata).toBeInstanceOf(Object);
                            expect($logger.metadata).toMatchObject({
                                ...$metadata,
                                ...$superFancyMetadata,
                            });
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($logger.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $mocks = taggedMocksForLogger($logger, 'fatal');
                                    const $data = {
                                        foo: $mocks.uniqueSafeTag('foo'),
                                        bar: $mocks.uniqueSafeTag('bar'),
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
                                    const $mocks = taggedMocksForLogger($logger, 'error');
                                    const $data = {
                                        foo: $mocks.uniqueSafeTag('foo'),
                                        bar: $mocks.uniqueSafeTag('bar'),
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
                                    const $mocks = taggedMocksForLogger($logger, 'debug');
                                    const $data = {
                                        foo: $mocks.uniqueSafeTag('foo'),
                                        bar: $mocks.uniqueSafeTag('bar'),
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
                                    const $mocks = taggedMocksForLogger($logger, 'warn');
                                    const $data = {
                                        foo: $mocks.uniqueSafeTag('foo'),
                                        bar: $mocks.uniqueSafeTag('bar'),
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
                                    const $mocks = taggedMocksForLogger($logger, 'info');
                                    const $data = {
                                        foo: $mocks.uniqueSafeTag('foo'),
                                        bar: $mocks.uniqueSafeTag('bar'),
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
                                    const $mocks = taggedMocksForLogger($logger, 'trace');
                                    const $data = {
                                        foo: $mocks.uniqueSafeTag('foo'),
                                        bar: $mocks.uniqueSafeTag('bar'),
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
                                    const $mocks = taggedMocksForLogger($logger, 'silly');
                                    const $data = {
                                        foo: $mocks.uniqueSafeTag('foo'),
                                        bar: $mocks.uniqueSafeTag('bar'),
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
                        expect($app_logger_fatal.sibling).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_fatal_sibling';
                        const $app_logger_fatal_sibling = $app_logger_fatal.sibling($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_fatal_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_fatal_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_fatal_sibling.options.name).toBe($app_logger_fatal_sibling.options.name);
                            expect($app_logger_fatal_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_sibling.fatal($data);
                                    });
                                    test('calls expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_sibling.error($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_sibling, LogLevel.ERROR, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_sibling.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_sibling.warn($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_sibling, LogLevel.WARN, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_sibling.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_sibling, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_sibling.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_sibling, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_sibling, LogLevel.SILLY, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                        });
                    });
                });
                describe('type', () => {
                    test('is Function', () => {
                        expect($app_logger_fatal.type).toBeFunction();
                    });
                    describe('when called', () => {
                        const $namespace = '$app_logger_fatal_type_sibling';
                        const $app_logger_fatal_type_sibling = $app_logger_fatal.type($namespace);
                        test('it returns expected Logger', () => {
                            expect($app_logger_fatal_type_sibling).toBeInstanceOf(Logger);
                            expect($app_logger_fatal_type_sibling).toBeInstanceOf(AppLogger);
                            expect($app_logger_fatal_type_sibling.options.name).toBe($app_logger_fatal_type_sibling.options.name);
                            expect($app_logger_fatal_type_sibling.options.namespace).toBe($namespace);
                        });
                        describe('logger method', () => {
                            describe('fatal', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_type_sibling.fatal).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_type_sibling.fatal($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_type_sibling, LogLevel.FATAL, $data));
                                        expect(console.error).toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('error', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_type_sibling.error).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_type_sibling.error($data);
                                    });
                                    test('does NOT write to expected stderr with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_type_sibling, LogLevel.ERROR, $data));
                                        expect(console.error).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('debug', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_type_sibling.debug).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_type_sibling.debug($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_type_sibling, LogLevel.DEBUG, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('warn', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_type_sibling.warn).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_type_sibling.warn($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_type_sibling, LogLevel.WARN, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('info', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_type_sibling.info).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_type_sibling.info($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_type_sibling, LogLevel.INFO, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('trace', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_type_sibling.trace).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_type_sibling.trace($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_type_sibling, LogLevel.TRACE, $data));
                                        expect(console.log).not.toHaveBeenCalledWith('%j', $expected_message);
                                    });
                                });
                            });
                            describe('silly', () => {
                                test('is Function', () => {
                                    expect($app_logger_fatal_type_sibling.silly).toBeFunction();
                                });
                                describe('when called', () => {
                                    const $data = {
                                        foo: 'test.foo',
                                        bar: 'test.bar',
                                    };
                                    beforeAll(() => {
                                        $app_logger_fatal_type_sibling.silly($data);
                                    });
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expected_message = normalize_record(construct_record($app_logger_fatal_type_sibling, LogLevel.SILLY, $data));
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
