/* eslint-disable no-process-env */
describe('test environment', () => {
    test('process.env.foo equals "bar"', () => {
        expect(process.env.FOO_BAR).toBe('foo_bar');
    });
});
