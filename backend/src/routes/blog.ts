import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const bookRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    
}>();



bookRouter.use(async (c, next) => {

    const jwt = c.req.header('Authorization') || "";
   
    
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}


    const token = jwt.split(" ")[1]
	const user = await verify(token, c.env.JWT_SECRET);
    console.log(user);
    
	if(user){
        c.set("jwtPayload",user.id)
        await next()
    }
    
	
});


bookRouter.post('/createblog', async (c) => {        
	const userId = c.get('jwtPayload');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	try {
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId
            }
        });
        return c.json({
            id: post.id
        });
    } catch (error) {
        console.log(error);
        return c.json({error})
           
    }
})

bookRouter.put('/updateblog', async (c) => {
	const userId = c.get('jwtPayload');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const updatedBlog = await prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	return c.json({id:updatedBlog.id}) 

});

bookRouter.get('/singleblog/:id', async (c) => {
	const id = c.req.param('id');
    console.log(id);
    
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const post = await prisma.post.findUnique({
		where: {
			id
		}
	});

	return c.json(post);
})



bookRouter.get("/allblogs", async (c)=>{
    const userId = c.get('jwtPayload');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());


    try {
        const blogs = await prisma.post.findMany()
        console.log(blogs);
        
        return c.json({blogs:blogs})
    } catch (error) {
        
    }
})