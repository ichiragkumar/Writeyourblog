import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/signup', (c) => {
  return c.text('signup route')
})


app.post('/api/v1/signin', (c) => {
  return c.text('signin route')
})


app.post('/api/v1/blog', (c) => {
  return  c.text('Blog Added')
})


app.put('/api/v1/blog', (c) =>{
  return  c.text('Blog Updated')
})


app.get("/api/v1/blog/:id", (c)=> {
  return  c.text("single Blog")
})



app.get("/api/v1/blog/bulk", (c)=> {
  return c.text("Blogs in Bulk")
})


export default app
