const config = require('./utils/config')
const express = require('express')
//to handle the errors in async/await
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const morgan = require('morgan')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


 app.use(cors())
 app.use(express.static('build'))
 app.use(express.json())
 app.use(middleware.requestLogger)
 app.use(middleware.tokenExtractor)
 app.use(morgan('tiny'))

 app.use('/api/login', loginRouter)
 app.use('/api/users', usersRouter)
 app.use('/api/blogs', middleware.userExtractor, blogsRouter)

 
 app.use(middleware.unknownEndpoint)
 app.use(middleware.errorHandler)

module.exports = app