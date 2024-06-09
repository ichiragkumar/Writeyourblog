import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { decode, sign, verify } from 'hono/jwt'
import { withAccelerate } from '@prisma/extension-accelerate'



export const userRoute = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET:string
	}
}>();



userRoute.post('/signup',async (c) => {
    console.log("reached");
    
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
  
  
userRoute.post('/signin',async (c) => {
  
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