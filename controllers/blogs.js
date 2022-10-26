//route handlers
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

//creation note with token
const jwt = require('jsonwebtoken')

/*blogsRouter.get('/', (request, response, next) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
      .catch(error => next(error))
  })*/

  blogsRouter.get('/',async (request, response) => {
    console.log('\n  \n', request.user)
    const blogs = await Blog.find({}).populate('user',  { username: 1, name: 1})
    response.json(blogs)
  })
  
  blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
      .then(blog => {
        if (blog) {
          response.json(blog)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })

  /*blogsRouter.post('/', (request, response, next) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
      .catch(error => next(error))
  })*/

  //post with promises
  /*blogsRouter.post('/',async (request, response, next) => {
    const body = request.body

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
    })
    
    if(request.body.title === undefined || request.body.author === undefined
      || request.body.url === undefined ) {
      return response.status(400).json({ error: 'content missing'})
    } else {
      try {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
      } catch (error) {
        next(error)
      }
    }
    
  })*/

  /*const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }*/
  
  blogsRouter.post('/',async (request, response) => {
    const body = request.body

    //const token = getTokenFrom(request)
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
    /*
      decoded token  {
        username: 'admin',
        id: '6358c3c8d240bc7a2f664798',
        iat: 1666769539,
        exp: 1666773139
      }
    */


    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    //const user = await User.findById(body.userId)

    const user = await User.findById(decodedToken.id)
    
    /*
    -------------------------------------------------
    user found is {
  _id: new ObjectId("6358c3c8d240bc7a2f664798"),
  username: 'admin',
  name: 'admin',
  passwordHash: '$2b$10$tZuYpL7tUStqNdkLD0jaJ.PGBhe0BRtCbViosnWglu3/tzRwwS8xG',
  blogs: [
    new ObjectId("6358c406d240bc7a2f66479c"),
    new ObjectId("6358e3fd50383126f0ba59b0"),
    new ObjectId("6358e5618c82301430781724")
  ],
  __v: 3
}
------------------------------------------------------

    */



    if (body.title === undefined || body.author === undefined || body.url === undefined) {
      return response.status(400).json({ error: 'content missing'})
    } else {

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    //saving the blog the the db
    const savedBlog = await blog.save()
   // response.status(201).json(savedBlog) 

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
  })



  blogsRouter.delete('/:id',async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    //console.log('decoded token', decodedToken)
    //console.log('id decode token', decodedToken.id)
    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)
    //console.log('blog found', blog)
    if(blog === null) {
      return response.status(404).json({ error: 'id not found' })
    }

    //console.log(blog.user.toString())
    

    if(decodedToken.id.toString() === blog.user.toString()){
      //console.log('------------ El usuario es el mismo')
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else{
      //console.log('---------- el usuario es diferente')
      response.status(401).json({ error: 'user unauthorized to delete this blog'})
    }

  })

  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)
    //console.log('blog found', blog)
    if(blog === null) {
      return response.status(404).json({ error: 'id not found' })
    }

    if(decodedToken.id.toString() === blog.user.toString()){
      //console.log('------------ El usuario es el mismo')
      const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
      }
      
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true} )
      response.json(updatedBlog)
    } else{
      //console.log('---------- el usuario es diferente')
      response.status(401).json({ error: 'user unauthorized to delete this blog'})
    }

    
  })

  module.exports = blogsRouter
  