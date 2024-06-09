import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from '@prisma/extension-accelerate'

import { Hono } from "hono";


export const blogRoute = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string,
    }

}>


// blogRoute.use("*/", async (c,next)=>{
//     // extrcat the user id
//     next()
// })


blogRoute.post('/',async  (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())

    const body = await c.req.json()
    try {
        
        const blogData = await prisma.post.create({
            data:{
                title:body.title,
                content:body.content,
                authorId:1
            }
        })

        return c.json({data:blogData.id})

    } catch (error) {
        console.log(error);
        return c.json({msg:"Sever Errir"})
        
    }
  })

 

  
  
blogRoute.put('/',async (c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())

    const body = await c.req.json()
    try {
        
        const updatedBlog = await prisma.post.update({
            where:{
                id:body.id,

            },
            data:{
                title:body.title,
                content:body.content,
               
            }
        })

        return c.json({data:updatedBlog.id})

    } catch (error) {
        console.log(error);
        return c.json({msg:"Sever Errir"})
        
    }
  })
  
//   add pagination here

blogRoute.get("/bulk", async (c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
    try {
        const allBlog = await prisma.post.findMany({})
        return c.json({data:allBlog.id})

    } catch (error) {
        console.log(error);
        return c.json({msg:"Sever Errir"})
        
    }
})



blogRoute.get("/:id",async  (c)=> {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())

    const body = await c.req.json()
    try {
        
        const singleBlog = await prisma.post.findUnique({
            where:{
                id:body.id
              } 
        })

        return c.json({data:singleBlog.id})

    } catch (error) {
        console.log(error);
        return c.json({msg:"Sever Errir"})
        
    }
  })
  
  
  