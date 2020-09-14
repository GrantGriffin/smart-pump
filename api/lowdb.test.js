const {
  connectDB,
  readAllUsers,
  readUser,
  readUserByEmail,
  updateUserFields
} = require('./lowdb')

const jsonUsers = require('../data/users.json')

// TODO: mock the db so the tests don't change data

describe('lowdb functions', () => {

  it('should return a db cursor when connectDB is called', () => {
    const dbCursor = connectDB()
    expect(dbCursor).toBeTruthy()
  })

  it.skip('should not contain guid duplicates', () => {
    // TODO: duplicate test
  })

  it('should return all users when readAllUsers is called', () => {
    const dbCursor = connectDB()
    const users = readAllUsers(dbCursor)
    expect(users.length).toBe(jsonUsers.length)
  })

  it('should return the correct user when readUser is called', () => {
    const dbCursor = connectDB()
    const userGuid = 'eab0324c-75ef-49a1-9c49-be2d68f50b96'
    const user = readUser(dbCursor, userGuid)
    expect(user._id).toEqual('5410953eb0e0c0ae25608277')
    expect(user).toEqual(jsonUsers.users[0])
  })

  it('should return a user by email when readUserByEmail is called', () => {
    const dbCursor = connectDB()
    const email = jsonUsers.users[0].email
    const user = readUserByEmail(dbCursor, email)
    expect(user._id).toEqual('5410953eb0e0c0ae25608277')
    expect(user).toEqual(jsonUsers.users[0])
  })

  it('should update fields given a partial object when updateUserFields is called', async () => {
    const dbCursor = connectDB()
    const payload = {
      _id: 'brokenid',
      guid: 'eab0324c-75ef-49a1-9c49-be2d68f50b96',
      eyeColor: Math.random().toString(),
      name: {
        last: Math.random().toString()
      }
    }

    const writeResponse = await updateUserFields(dbCursor, payload)
    console.log({writeResponse})
    expect(writeResponse).toEqual({...jsonUsers.users[0], ...payload, name: {...jsonUsers.users[0].name, ...payload.name}})

  })
})