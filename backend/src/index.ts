import { Hono } from 'hono'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { userRoute } from './routes/user';
import { blogRoute } from './routes/blog';
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET:string
	}
}>();



app.route("/api/v1/user", userRoute)
app.route("/api/v1/blog", blogRoute)




app.get("/", (c) =>{
  return c.text("welcom to Hono")
})









export default app
