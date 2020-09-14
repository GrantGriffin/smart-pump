const express = require('express')
const app = express()

const jwt = require('express-jwt')
// const jwtAuthz = require('express-jwt-authz')  // for specific user scopes(permissions)
const jwksRsa = require('jwks-rsa')

// lowdb utilities
const {
  connectDB,
  readUser,
  readUserByEmail,
  updateUserFields
} = require('./lowdb')
const dbCursor = connectDB()
// console.log({dbCursor})


const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.API_PORT || 8080

if (!process.env.AUTH0_ISSUER || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_ISSUER, and AUTH0_AUDIENCE in your .env file'
}

const corsOptions =  {
  origin: process.env.APP_ORIGIN
}

app.use(cors(corsOptions))
app.options('*', cors()) // enable pre-flight
app.use(bodyParser.json())


// TODO: jwt configuration is off somehow
const checkJwt = jwt({
  // Dynamically provide a signing key based on the [Key ID](https://tools.ietf.org/html/rfc7515#section-4.1.4) header parameter ("kid") and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_ISSUER}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_ISSUER}/`,
  algorithms: ['RS256']
})

app.get('/public', (req, res) => {
  res.json({
    users,
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  })
})

app.post('/public/readUserByEmail', async (req, res) => {
  console.log('readUserByEmail called with: ', {body: req.body})
  const userData = await readUserByEmail(dbCursor, req.body.data.email)

  res.json(userData)
})

app.post('public/updateUserFields', async (req, res) => {
  console.log('updateUserFields called with: ', {body: req.body})
})

app.post('/public', (req, res) => {
  console.log('server public route ', req.body)

  res.json({
    message: 'posted to public route'
  })
})

// failed at validating the jwt somehow to avoid 401s on this route with Auth0
app.get('/private', checkJwt, (req, res) => {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  })
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})


if (dbCursor.get) {
  app.listen(port, () => {
    console.log(`SMART Pump node server listening at http://localhost:${port}`)
  })
} else {
  throw new Error(
    'there was an error connecting lowdb'
  )
}