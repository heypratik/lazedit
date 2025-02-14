import {Hono } from 'hono';
import {handle} from 'hono/vercel';
import user from './user'; 
import images from './images';
import ai from './ai';
import users from './users';

//revert to edge if planning on running on edge
export const runtime = "nodejs"

const app = new Hono().basePath("/api");

const routes = app
.route("/images", images)
  .route("/user", user)
  .route("/ai", ai)
  .route("/users", users)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;