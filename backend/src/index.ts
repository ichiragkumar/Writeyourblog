import { Hono } from 'hono'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET:string
	}
}>();


app.use('/api/v1/blog/*', async (c, next) => {
  // what we need to do here,


  // 1. get the Headers
  // 2. verify the Headers
  // 3. if the Headers are correct , can proceed
  // 4. if Not, reject the Headers with 403

  const headers =  c.req.header("Authorization")!
  const token = headers.split(" ")[1]
  
  const response = await verify(token,c.env.JWT_SECRET)
  if(response.id){
    next()
  }else{
    c.status(403)
    return c.json({msg:"unthorized"})
  }
  
})



app.get('/', (c) => {
  

  return c.text('Hello Hono!')
})

app.post('/api/v1/signup',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()
  try {
    const userData = await prisma.user.create({
      data:{
        email:body.email,
        password:body.password,
      }
    })
  
    const token = await sign({id:userData.id}, c.env.JWT_SECRET)
    return c.json({token})
    
  } catch (error) {
    c.status(500)
    return c.json({error})
    
  }
  
})


app.post('/api/v1/signin',async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()
  try {
    const userData = await prisma.user.findUnique({
      where:{
        email:body.email,
        password:body.password
      } 
    })

    if(!userData){
      c.status(403)
      return c.json({msg:"user not found"})
    }

    const token  = await sign({id:userData.id}, c.env.JWT_SECRET)
    return c.json({token})


  } catch (error) {
    console.log(error);
    
    return c.text("sever error")
  }
 
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
