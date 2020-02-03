const functions = require('../functions')

// beforeEach(() => initDatabase())
// afterEach(() => closeDatabase())

// beforeAll(() => initDatabase())
// afterAll(() => closeDatabase())

// const initDatabase = () => console.log('Database initialized...')
// const closeDatabase = () => console.log('Database closed...')
const nameCheck = () => console.log('Checking Name...')

describe('Checking Names', () => {
    beforeEach(() => nameCheck())
    test('User is Jeff', () => {
        const user = 'Jeff'
        expect(user).toBe('Jeff')
    })
    test('User is Karen', () => {
        const user = 'Karen'
        expect(user).toBe('Karen')
    })
})

test('Adds 2 + 2 to equal 4', () => {
    expect(functions.add(2, 2)).toBe(4)
})

test('Adds 2 + 2 to not equal 5', () => {
    expect(functions.add(2, 2)).not.toBe(5)
})

// to be null
test('Should be null', () => {
    expect(functions.isNull()).toBeNull()
})

// to be falsy
test('Should be falsy', () => {
    expect(functions.checkValue(false)).toBeFalsy()
})

// *** toBe is strict(primitive types) compares type as well, so the below will fail
// test('User should be Brad Traversy object', () => {
//     expect(functions.createUser()).toBe({ firstName: 'Brad', lastName: 'Traversy'})
// })

test('User should be Brad Traversy object', () => {
    expect(functions.createUser()).toStrictEqual({ firstName: 'Brad', lastName: 'Traversy'})
})

// Less than and greater than
test('Should be under 1600', () => {
    const load1 = 800
    const load2 = 800
    expect(load1 + load2).toBeLessThanOrEqual(1600)
})

// Regex
test('There is no I in team', () => {
    expect('team').not.toMatch(/I/i)
})

// Arrays
test('Admin should be in usernames', () => {
    usernames = ['john', 'karen', 'admin']
    expect(usernames).toContain('admin')
})

// Working with async data(PROMISE) - MAKE SURE ASSERTIONS AND RETURN FUNCTION IS USED OTHERWISE ALWAYS TRUTHY
test('User fetched name should be Leanne Graham', () => {
    expect.assertions(1)
    return functions.fetchUser().then(data => {
        expect(data.name).toStrictEqual('Leanne Graham')
    })
})

// Async Await
test('User fetched name should be Leanne Graham', async () => {
    expect.assertions(1)
    const data = await functions.fetchUser()
    expect(data.name).toStrictEqual('Leanne Graham')
})