import createLogger from './Logger';

describe('createLogger', () => {
    test('is Function', () => {
        expect(createLogger).toBeFunction();
    });
    describe('when called', () => {
        describe('with no arguments', () => {
            test('it returns 0', () => {
                expect(createLogger()).toBe(0);
            });
        });
    });
});
