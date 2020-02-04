const reverseString = require('../jest_test/reversestring')

test('reverseString function exists', () => {
    expect(reverseString).toBeDefined()
})

test('String reverses', () => {
    expect(reverseString('hello')).toStrictEqual('olleh')
})

test('String reverses with uppercase', () => {
    expect(reverseString('Hello')).toStrictEqual('olleh')
})