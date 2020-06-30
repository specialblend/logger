import flatten from 'flat';

import createLogger, { Logger, LoggerLevel } from './Logger';

describe('createLogger', () => {
    test('is Function', () => {
        expect(createLogger).toBeFunction();
    });
    describe('when called', () => {
        describe('with no metadata', () => {
            const $options = { name: 'testApp', namespace: 'testNamespace' };
            const $logger = createLogger($options);
            test('it returns instanceof Logger', () => {
                expect($logger).toBeInstanceOf(Logger);
            });
            describe('method', () => {
                describe('construct_message', () => {
                    test('is Function', () => {
                        expect($logger.construct_message).toBeFunction();
                    });
                    describe('when called', () => {
                        test('returns expected object', () => {
                            const $level = LoggerLevel.fatal;
                            const $data = {
                                foo: 'test.foo',
                                bar: 'test.bar',
                            };
                            const $expectedType = `${$options.name}.${$options.namespace}`;
                            const $message = $logger.construct_message($level, $data);
                            expect($message).toBeInstanceOf(Object);
                            expect($message).toMatchObject({
                                name: $options.name,
                                type: $expectedType,
                                [$expectedType]: {
                                    ... $data,
                                },
                            });
                        });
                    });
                });
                describe('serialize', () => {
                    test('is Function', () => {
                        expect($logger.serialize).toBeFunction();
                    });
                    describe('when called', () => {
                        test('returns expected string', () => {
                            const $level = LoggerLevel.fatal;
                            const $data = {
                                foo: 'test.foo',
                                bar: 'test.bar',
                            };
                            const $expectedPayloadStr = JSON.stringify(flatten($data));
                            const $message = $logger.serialize($level, $data);
                            expect(typeof $message).toBe('string');
                            expect($message).toBe($expectedPayloadStr);
                        });
                    });
                });
            });
        });
        describe('with metadata', () => {
            const $options = { name: 'testApp', namespace: 'testNamespace' };
            const $metadata = {
                alpha: 'alpha.test',
                bravo: 'bravo.test',
            };
            const $logger = createLogger($options, $metadata);
            test('it returns instanceof Logger', () => {
                expect($logger).toBeInstanceOf(Logger);
            });
            describe('method', () => {
                describe('construct_message', () => {
                    test('is Function', () => {
                        expect($logger.construct_message).toBeFunction();
                    });
                    describe('when called', () => {
                        test('returns expected object', () => {
                            const $level = LoggerLevel.fatal;
                            const $data = {
                                foo: 'test.foo',
                                bar: 'test.bar',
                            };
                            const $expectedType = `${$options.name}.${$options.namespace}`;
                            const $message = $logger.construct_message($level, $data);
                            expect($message).toBeInstanceOf(Object);
                            expect($message).toMatchObject({
                                ... $metadata,
                                name: $options.name,
                                type: $expectedType,
                                [$expectedType]: {
                                    ... $data,
                                },
                            });
                        });
                    });
                });
                describe('serialize', () => {
                    test('is Function', () => {
                        expect($logger.serialize).toBeFunction();
                    });
                    describe('when called', () => {
                        test('returns expected string', () => {
                            const $level = LoggerLevel.fatal;
                            const $data = {
                                foo: 'test.foo',
                                bar: 'test.bar',
                            };
                            const $expectedPayloadStr = JSON.stringify(flatten($data));
                            const $message = $logger.serialize($level, $data);
                            expect(typeof $message).toBe('string');
                            expect($message).toBe($expectedPayloadStr);
                        });
                    });
                });
            });
        });
    });
});

describe('MyFancyLogger extends Logger', () => {
    const $console = {
        log: jest.fn(console.log),
        error: jest.fn(console.error),
    };
    class MyFancyLogger extends Logger {
        writeStdErr(payload) {
            return $console.error(payload);
        }
        writeStdOut(payload) {
            return $console.log(payload);
        }
    }
    const $options = { name: 'testApp', namespace: 'testNamespace' };
    const $metadata = {
        alpha: 'alpha.test',
        bravo: 'bravo.test',
    };
    describe('when called', () => {
        const $logger = new MyFancyLogger($options, $metadata);
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
                        const $expectedMessage = $logger.serialize(LoggerLevel.fatal, $logger.construct_message(LoggerLevel.fatal, $data));
                        expect($console.error).toHaveBeenCalledWith($expectedMessage);
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
                        const $expectedMessage = $logger.serialize(LoggerLevel.error, $logger.construct_message(LoggerLevel.error, $data));
                        expect($console.error).toHaveBeenCalledWith($expectedMessage);
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
                        const $expectedMessage = $logger.serialize(LoggerLevel.warn, $logger.construct_message(LoggerLevel.warn, $data));
                        expect($console.log).toHaveBeenCalledWith($expectedMessage);
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
                        const $expectedMessage = $logger.serialize(LoggerLevel.debug, $logger.construct_message(LoggerLevel.debug, $data));
                        expect($console.log).toHaveBeenCalledWith($expectedMessage);
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
                        const $expectedMessage = $logger.serialize(LoggerLevel.info, $logger.construct_message(LoggerLevel.info, $data));
                        expect($console.log).toHaveBeenCalledWith($expectedMessage);
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
                        const $expectedMessage = $logger.serialize(LoggerLevel.trace, $logger.construct_message(LoggerLevel.trace, $data));
                        expect($console.log).toHaveBeenCalledWith($expectedMessage);
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
                        const $expectedMessage = $logger.serialize(LoggerLevel.silly, $logger.construct_message(LoggerLevel.silly, $data));
                        expect($console.log).toHaveBeenCalledWith($expectedMessage);
                    });
                });
            });
        });
    });
});
