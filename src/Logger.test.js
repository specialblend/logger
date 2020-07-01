import { Exception } from '@specialblend/exceptional';
import { taggedMocks } from '@specialblend/tagged-mocks';
import flatten from 'flat';

import createLogger, { Logger, LoggerLevel } from './Logger';

console.log = jest.fn(console.log);
console.error = jest.fn(console.error);

const $LOG_LEVELS = [
    ['LoggerLevel.fatal', LoggerLevel.fatal, console.error],
    ['LoggerLevel.error', LoggerLevel.error, console.error],
    ['LoggerLevel.debug', LoggerLevel.debug, console.log],
    ['LoggerLevel.warn', LoggerLevel.warn, console.log],
    ['LoggerLevel.info', LoggerLevel.info, console.log],
    ['LoggerLevel.trace', LoggerLevel.trace, console.log],
    ['LoggerLevel.silly', LoggerLevel.silly, console.log],
];

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
    class MyFancyLogger extends Logger {}
    describe('when called', () => {
        describe('without loglevel', () => {
            const $options = {
                name: 'testApp',
                namespace: 'testNamespace',
                level: LoggerLevel.silly,
            };
            const $fancyMetadata = {
                alpha: 'alpha.test',
                bravo: 'bravo.test',
            };
            const $myFancyLogger = new MyFancyLogger($options, $fancyMetadata);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.fatal, $myFancyLogger.construct_message(LoggerLevel.fatal, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                        test('writes to expected stdout with expected payload', () => {
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.silly, $myFancyLogger.construct_message(LoggerLevel.silly, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            expect($myFancyChildLogger).toBeInstanceOf(MyFancyLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ... $fancyMetadata,
                                ... $superFancyMetadata,
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.fatal, $myFancyChildLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.error, $myFancyChildLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.debug, $myFancyChildLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.warn, $myFancyChildLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.info, $myFancyChildLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.trace, $myFancyChildLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.silly, $myFancyChildLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.warn, $mySuperFancySiblingLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.info, $mySuperFancySiblingLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.trace, $mySuperFancySiblingLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.warn, $mySuperFancySiblingLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.info, $mySuperFancySiblingLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.trace, $mySuperFancySiblingLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                name: 'testApp',
                namespace: 'testNamespace',
                level: LoggerLevel.silly,
            };
            const $fancyMetadata = {
                alpha: 'alpha.test',
                bravo: 'bravo.test',
            };
            const $myFancyLogger = new MyFancyLogger($options, $fancyMetadata);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.fatal, $myFancyLogger.construct_message(LoggerLevel.fatal, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                        test('writes to expected stdout with expected payload', () => {
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.silly, $myFancyLogger.construct_message(LoggerLevel.silly, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            expect($myFancyChildLogger).toBeInstanceOf(MyFancyLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ... $fancyMetadata,
                                ... $superFancyMetadata,
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.fatal, $myFancyChildLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.error, $myFancyChildLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.debug, $myFancyChildLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.warn, $myFancyChildLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.info, $myFancyChildLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.trace, $myFancyChildLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.silly, $myFancyChildLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.warn, $mySuperFancySiblingLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.info, $mySuperFancySiblingLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.trace, $mySuperFancySiblingLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.warn, $mySuperFancySiblingLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.info, $mySuperFancySiblingLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.trace, $mySuperFancySiblingLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                name: 'testApp1',
                namespace: 'testNamespace1',
                level: LoggerLevel.trace,
            };
            const $fancyMetadata = {
                alpha1: 'alpha.test1',
                bravo1: 'bravo.test1',
            };
            const $myFancyLogger = new MyFancyLogger($options, $fancyMetadata);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.fatal, $myFancyLogger.construct_message(LoggerLevel.fatal, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.silly, $myFancyLogger.construct_message(LoggerLevel.silly, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($myFancyChildLogger).toBeInstanceOf(MyFancyLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ... $fancyMetadata,
                                ... $superFancyMetadata,
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.fatal, $myFancyChildLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.error, $myFancyChildLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.warn, $myFancyChildLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.debug, $myFancyChildLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.info, $myFancyChildLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.trace, $myFancyChildLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.silly, $myFancyChildLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.warn, $mySuperFancySiblingLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.info, $mySuperFancySiblingLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.trace, $mySuperFancySiblingLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.warn, $mySuperFancySiblingLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.info, $mySuperFancySiblingLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.trace, $mySuperFancySiblingLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                name: 'testApp2',
                namespace: 'testNamespace2',
                level: LoggerLevel.info,
            };
            const $fancyMetadata = {
                alpha2: 'alpha.test2',
                bravo2: 'bravo.test2',
            };
            const $myFancyLogger = new MyFancyLogger($options, $fancyMetadata);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.fatal, $myFancyLogger.construct_message(LoggerLevel.fatal, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.silly, $myFancyLogger.construct_message(LoggerLevel.silly, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($myFancyChildLogger).toBeInstanceOf(MyFancyLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ... $fancyMetadata,
                                ... $superFancyMetadata,
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.fatal, $myFancyChildLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.error, $myFancyChildLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.warn, $myFancyChildLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.debug, $myFancyChildLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.info, $myFancyChildLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.silly, $myFancyChildLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.warn, $mySuperFancySiblingLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.info, $mySuperFancySiblingLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.warn, $mySuperFancySiblingLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.info, $mySuperFancySiblingLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                name: 'testApp3',
                namespace: 'testNamespace3',
                level: LoggerLevel.warn,
            };
            const $fancyMetadata = {
                alpha1: 'alpha.test1',
                bravo1: 'bravo.test1',
            };
            const $myFancyLogger = new MyFancyLogger($options, $fancyMetadata);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.fatal, $myFancyLogger.construct_message(LoggerLevel.fatal, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.silly, $myFancyLogger.construct_message(LoggerLevel.silly, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($myFancyChildLogger).toBeInstanceOf(MyFancyLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ... $fancyMetadata,
                                ... $superFancyMetadata,
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.fatal, $myFancyChildLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.error, $myFancyChildLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.debug, $myFancyChildLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.warn, $myFancyChildLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.silly, $myFancyChildLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.warn, $mySuperFancySiblingLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.warn, $mySuperFancySiblingLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                name: 'testApp4',
                namespace: 'testNamespace4',
                level: LoggerLevel.debug,
            };
            const $fancyMetadata = {
                alpha4: 'alpha.test4',
                bravo4: 'bravo.test4',
            };
            const $myFancyLogger = new MyFancyLogger($options, $fancyMetadata);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.fatal, $myFancyLogger.construct_message(LoggerLevel.fatal, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                            expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.silly, $myFancyLogger.construct_message(LoggerLevel.silly, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($myFancyChildLogger).toBeInstanceOf(MyFancyLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ... $fancyMetadata,
                                ... $superFancyMetadata,
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.fatal, $myFancyChildLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.error, $myFancyChildLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.debug, $myFancyChildLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.silly, $myFancyChildLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.debug, $mySuperFancySiblingLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                name: 'testApp5',
                namespace: 'testNamespace5',
                level: LoggerLevel.error,
            };
            const $fancyMetadata = {
                alpha5: 'alpha.test5',
                bravo5: 'bravo.test5',
            };
            const $myFancyLogger = new MyFancyLogger($options, $fancyMetadata);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.fatal, $myFancyLogger.construct_message(LoggerLevel.fatal, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.silly, $myFancyLogger.construct_message(LoggerLevel.silly, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($myFancyChildLogger).toBeInstanceOf(MyFancyLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ... $fancyMetadata,
                                ... $superFancyMetadata,
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.fatal, $myFancyChildLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.error, $myFancyChildLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.silly, $myFancyChildLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.error, $mySuperFancySiblingLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                name: 'testApp6',
                namespace: 'testNamespace6',
                level: LoggerLevel.fatal,
            };
            const $fancyMetadata = {
                alpha5: 'alpha.test5',
                bravo5: 'bravo.test5',
            };
            const $myFancyLogger = new MyFancyLogger($options, $fancyMetadata);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.fatal, $myFancyLogger.construct_message(LoggerLevel.fatal, $data));
                            expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                        test('does NOT write to expected stdout with expected payload', () => {
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.silly, $myFancyLogger.construct_message(LoggerLevel.silly, $data));
                            expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($myFancyChildLogger).toBeInstanceOf(MyFancyLogger);
                            expect($myFancyChildLogger.options.name).toBe($myFancyLogger.options.name);
                            expect($myFancyChildLogger.options.namespace).toBe($myFancyLogger.options.namespace);
                            expect($myFancyChildLogger.metadata).toBeInstanceOf(Object);
                            expect($myFancyChildLogger.metadata).toMatchObject({
                                ... $fancyMetadata,
                                ... $superFancyMetadata,
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.fatal, $myFancyChildLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyChildLogger.serialize(LoggerLevel.silly, $myFancyChildLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                            expect($mySuperFancySiblingLogger).toBeInstanceOf(MyFancyLogger);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.fatal, $mySuperFancySiblingLogger.construct_message(LoggerLevel.fatal, $data));
                                        expect(console.error).toHaveBeenCalledWith($expectedMessage);
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
                                    test('does NOT write to expected stdout with expected payload', () => {
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.error, $myFancyLogger.construct_message(LoggerLevel.error, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.debug, $myFancyLogger.construct_message(LoggerLevel.debug, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.warn, $myFancyLogger.construct_message(LoggerLevel.warn, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.info, $myFancyLogger.construct_message(LoggerLevel.info, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $myFancyLogger.serialize(LoggerLevel.trace, $myFancyLogger.construct_message(LoggerLevel.trace, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
                                        const $expectedMessage = $mySuperFancySiblingLogger.serialize(LoggerLevel.silly, $mySuperFancySiblingLogger.construct_message(LoggerLevel.silly, $data));
                                        expect(console.log).not.toHaveBeenCalledWith($expectedMessage);
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
        const $name = 'testApp00';
        const $namespace = 'testNamespace00';
        const $logger = new MyFancyLogger({ name: $name, namespace: $namespace, level: LoggerLevel.silly });
        test('is Function', () => {
            expect($logger.exception).toBeFunction();
        });
        describe('when called', () => {
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
                    const $expectedData = {
                        code: 'Exception',
                        message: $exMessage,
                        data: $exData,
                        err: {
                            message: $err.message,
                            stack: $err.stack,
                        },
                    };
                    const $expectedMessagePayload = $logger.construct_message(LoggerLevel.error, $expectedData);
                    expect(console.error).toHaveBeenCalledWith(expect.any(String));
                    const [[$stringPayload]] = console.error.mock.calls;
                    expect(JSON.parse($stringPayload)).toMatchObject(flatten($expectedMessagePayload));
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
                        const $expectedData = {
                            code: 'Exception',
                            message: $exMessage,
                            data: $exData,
                            err: {
                                message: $err.message,
                                stack: $err.stack,
                            },
                        };
                        const $expectedMessagePayload = $logger.construct_message($level, $expectedData);
                        expect($output).toHaveBeenCalledWith(expect.any(String));
                        const [[$stringPayload]] = $output.mock.calls;
                        expect(JSON.parse($stringPayload)).toMatchObject(flatten($expectedMessagePayload));
                    });
                });
            });
        });
    });
});
