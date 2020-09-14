
module.exports = {
  connectDB,
  readAllUsers,
  readUser,
  readUserByEmail,
  updateUserFields,
  createNewUser
}

// TODO: these should be async

function connectDB(jsonLocation = '../data/users.json') {
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  
  const adapter = new FileSync(jsonLocation)
  const dbCursor = low(adapter)

  return dbCursor
}

function readAllUsers(dbCursor) {
  
  return dbCursor.get('users')
}

function readUser(dbCursor, guid) {

  return dbCursor.get('users')
    .find({guid})
    .value()
}

function readUserByEmail(dbCursor, email) {

  console.log({email})
  
  return dbCursor.get('users')
    .find({email})
    .value()
}


/**
 * 
 * @param {object} dbCursor db driver obj
 * @param {object} updateObj object with guid and partial fields to update
 */
async function updateUserFields(dbCursor, updateObj) {

  try {
    const guid = updateObj.guid
    delete updateObj.guid
    
    if(updateObj._id) {
      delete updateObj._id
    }

    console.log({updateObj})

    // grabbing current DB state to deal with nesting issues
    const userToUpdate = await dbCursor.get('users')
      .find({guid})
      .write()


    // love to know how to do this better with multiple layers of nested objects dynamically
    return await dbCursor.get('users')
      .find({guid})
      .assign(updateObj)
      .assign({name: {...userToUpdate.name, ...updateObj.name}})
      .write()
    
  } catch (error) {
    console.error('updateUserFields failed', {...updateObj, guid})

    return error
  }
}

function createNewUser() {
  // TODO: sync auth0 user data to lowdb on signup
  console.log('firing createNewUser')
}