import {Hono} from 'hono';

const app = new Hono()
    .get("/", (c) => {
  return c.json({ user: "GET" });
}   )
    .get("/:name", (c) => {

    const params = c.req.param()
    return c.json({ user: params.name });
});


export default app