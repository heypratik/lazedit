import {Hono} from 'hono';
import { unsplash } from '@/lib/unsplash';

const DEFAULT_COUNT = 50
const DEFAULT_COLLECTION = ["317099"]

const app = new Hono()
   .get("/", async (c) => {

    const images = await unsplash.photos.getRandom({count: DEFAULT_COUNT, collectionIds: DEFAULT_COLLECTION})

    if (images.errors) {
        return c.json({error: "Failed to fetch images"}, 400)
    }

    let response = images.response

    if (!Array.isArray(response)) {
        response = [response]
    }

         return c.json({data: response })
   })


export default app