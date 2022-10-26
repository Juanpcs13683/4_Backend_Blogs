const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')


describe('TESTS ---------------', () => {
  beforeEach(async () => {

    await Blog.deleteMany({})
  
    await Blog.insertMany(helper.initialBlogs)
    //seving the blogs in the db
    /*const blogObjects = helper.initialBlogs.map(blog => Blog(blog))
    //saving to the db each blog
    const promiseArray = blogObjects.map(blog => blog.save())
    //
    await Promise.all(promiseArray)*/
  }
  )

  //exercise 4.8
  test('a blog is returned as a json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

    //exerciese 4.9
  test('unique identifier is named id',async () => {

    const user = {
      username: "admin",
      name: "admin",
      password: "admin"
    }

    const resSavedUser = await api.post('/api/users').send(user)
    //console.log(resSavedUser.body)

    const res = await api.post('/api/login').send(user)
    //console.log(res.body)

    const token = `Bearer ${res.body.token}`
    //console.log(typeof(token))
      const newBlog = {
        title: "stesting the post method",
        author: "juanpsc",
        url: "http://www.stuff.com",
        likes: 5
      }

      const response = await api.post('/api/blogs').send(newBlog).set('Authorization', token)
      //console.log('response from post', response.body)

      //test getting the reponse
      expect(response.body.id).toBeDefined()

  })

  // exercise 4.10
  test('A new blog is saved and length of db increased by one', async () => {
    const user = {
      username: "admin",
      password: "admin"
    }
  
    const res = await api.post('/api/login').send(user)
  
    const token = `Bearer ${res.body.token}`
  
    const newBlog = {
      title: "stesting the post method",
      author: "juanpsc",
      url: "http://www.stuff.com",
      likes: 5
    }
  
    //console.log('this is the new blog', newBlog)
  
    await api.post('/api/blogs').send(newBlog).set('Authorization', token)
    .expect(201).expect('Content-Type', /application\/json/)
  
    //this is for vefity that the note was added
    const response = await api.get('/api/blogs').set('authorization', token)
  
    //console.log(response.body)
    expect(response.body).toHaveLength(helper.initialBlogs.length+1)
  
  
  })


  // exercies 4.11
  test('if the likes property is missing it`ll be 0 by default',async () => {
    const user = {
      username: "admin",
      name: "admin",
      password: "admin"
    }
  
    const newUser = await api.post('/api/users').send(user)
    //console.log(newUser.body)
    const res = await api.post('/api/login').send(user)
    //console.log(res.body)
    const token = `Bearer ${res.body.token}`
    //console.log('toke \n', token)
    const newBlog = {
      title: "testing the post method",
      author: "juanpsc",
      url: "http://www.stuff.com"
    }
  
    const response = await api.post('/api/blogs').send(newBlog).set('Authorization', token)
    //console.log(response.body)
    //console.log(response.body)
    expect(response.body.likes).toBe(0)
  
  
  })

  // exercies 4.12
  test('A request without title or url will be 400 Bad Request',async () => {
    const newUser = {
      username: "admin",
      password: "admin"
    }

    const logedUser = await api.post('/api/login').send(newUser)
    const token = `Bearer ${logedUser.body.token}`

    const newBlog = {
      
      url: "something", 
      author: "someone",
      likes: 3
    }

    await api.post('/api/blogs').send(newBlog).set('authorization', token).expect(400)
  })

  // exercise 4.13
  test('deleting one resource will be 204 No Conent',async () => {
    const newUser = {
      username: "admin",
      password: "admin"
    }

    const userLoged = await api.post('/api/login').send(newUser)
    const token = `Bearer ${userLoged.body.token}`

    const newBlog = {
      title: "newblog",
      author: "someone else",
      url: "www.helloworld.com",
      likes: 5
    }

    const responsePosting = await api.post('/api/blogs').send(newBlog).set('authorization', token)
    //console.log(responsePosting.body)

    const id = responsePosting.body.id

    //deleting the note
    const responseDeleting = await api.delete(`/api/blogs/${id}`).set('authorization', token).expect(204)
  })

  // exercies 4.14
  test('updating a blog with token',async () => {
    await User.deleteMany({})
    const newUser = {
      username: "admin",
      name: "admin",
      password: "admin"
    }

    await api.post('/api/users').send(newUser)

    const userLoged = await api.post('/api/login').send(newUser)
    //console.log(userLoged.body)
    const token = `Bearer ${userLoged.body.token}`

    const newBlog = {
      title: "newblog",
      author: "someone else",
      url: "www.helloworld.com",
      likes: 5
    }

    const responsePostedBlog = await api.post('/api/blogs').send(newBlog).set('authorization', token)
    //console.log(responsePostedBlog.body)

    const id = responsePostedBlog.body.id

    newBlog.title = "modified blog"
    newBlog.likes = 9

    const responseUpdated = await api.put(`/api/blogs/${id}`).send(newBlog).set('authorization', token).expect(200).expect('Content-Type', /application\/json/)
    //console.log(responseUpdated.body)
    //console.log(responseUpdated.statuscode)
  })


  // exercises 4.15 - 4.16
  describe('testing the creation users', () => {
    test('if the name of the user is less then 3 characters if will be 400',async () => {
      
      const user = {
        username: 'pedro',
        name: 'ad',
        password: 'gdf'
      }
  
      const result = await api.post('/api/users').send(user).expect(400).expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('password or username too short')
  
      
    })
  })


})














describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({name: 'root', username: 'root', passwordHash})

    await user.save()
  })

  test('creating succeeds with a fresh username',async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

})



afterAll(() => {
  mongoose.connection.close()
})