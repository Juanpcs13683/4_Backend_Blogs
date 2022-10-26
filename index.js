const app = require('./app') //express()
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

//const PORT = 3003
server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })

// const http = require('http')
// const express = require('express')
// const app = express()
// const cors = require('cors')
// const mongoose = require('mongoose')

// const blogSchema = new mongoose.Schema({
//   title: String,
//   author: String,
//   url: String,
//   likes: Number
// })

// const Blog = mongoose.model('Blog', blogSchema)

// const mongoUrl = 'mongodb+srv://admin:4dmin@cluster0.mpathsm.mongodb.net/blogsApp?retryWrites=true&w=majority'

// mongoose.connect(mongoUrl)
//   .then(() => {
//     console.info('connected to MongoDB')
//   })
//   .catch((error) => {
//     console.error('error connecting to MongoDB:', error.message)
//   })
// app.use(cors())
// app.use(express.json())

// app.get('/api/blogs', (request, response) => {
//   Blog
//     .find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
// })

// app.post('/api/blogs', (request, response) => {
//   const blog = new Blog(request.body)

//   blog
//     .save()
//     .then(result => {
//       response.status(201).json(result)
//     })
// })

// const PORT = 3003
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })