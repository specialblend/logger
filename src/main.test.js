import main from '../src/main';

describe('main', () => {
    test('is Function', () => {
        expect(main).toBeFunction();
    });
    describe('when called', () => {
        describe('with no arguments', () => {
            test('it returns 0', () => {
                expect(main()).toBe(0);
            });
        });
    });
});
