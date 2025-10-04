import { Hono } from 'hono';

const DEFAULT_COUNT = 50
const DEFAULT_COLLECTION = ["317099"]

const app = new Hono()
    .get("/", async (c) => {

        const response: any[] = []

        return c.json({ data: response })
    })


export default app