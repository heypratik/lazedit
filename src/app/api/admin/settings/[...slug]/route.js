import { NextResponse } from "next/server";
import Store from "../../../../../../models/Store";
import User from "../../../../../../models/Users";
import FireCrawlApp from "@mendable/firecrawl-js";

function markdownToPlainText(markdown) {
  let plainText = markdown.replace(/```[\s\S]*?```/g, "");
  plainText = plainText.replace(/`[^`]*`/g, "");
  plainText = plainText.replace(/(#+\s*)/g, "");
  plainText = plainText.replace(/(\*\*|__|\*|_)/g, "");
  plainText = plainText.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  plainText = plainText.replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1");
  plainText = plainText.replace(/^\s*>+\s*/gm, "");
  plainText = plainText.replace(/[\*_`~]/g, "");
  return plainText.trim();
}

export async function POST(req, { params }) {
  const fireCrawl = new FireCrawlApp({
    apiKey: process.env.FIRECRAWL_APP_API_KEY,
  });

  const { slug } = await params;

  if (slug.length === 1 && slug[0] === "add") {
    const {
      name,
      domain,
      klaviyoKey,
      mediaObjectKey,
      location,
      socials,
      colors,
      email,
      userId,
      shipping,
      menuLinks,
      settingsCompleted,
      updateSettings,
    } = await req.json();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    const existingStore = await Store.findOne({ where: { domain } });

    if (existingStore) {
      // Update the store
      const updatedStore = await existingStore.update({
        name,
        domain,
        klaviyoKey,
        mediaObjectKey,
        location,
        socials,
        colors,
        email,
        userId,
        shipping,
        menuLinks,
        settingsCompleted,
      });

      if (updateSettings) {
        const user = await User.update(
          {
            settingsCompleted,
          },
          {
            where: {
              id: userId,
            },
          }
        );
      }

      return NextResponse.json(
        { message: "Store updated successfully", store: updatedStore },
        { status: 200 }
      );
    }

    const scrapeResult = await fireCrawl.scrapeUrl(`${domain}`, {
      formats: ["markdown", "html"],
    });

    const newStore = await Store.create({
      name,
      domain,
      klaviyoKey,
      mediaObjectKey,
      location,
      socials,
      colors,
      email,
      shipping,
      menuLinks,
      userId,
      about: markdownToPlainText(scrapeResult.markdown),
    });

    return NextResponse.json(
      { message: "Store created successfully", store: newStore },
      { status: 201 }
    );
  }

  if (slug.length === 1 && slug[0] === "get") {
    const { userId } = await req.json();
    const store = await Store.findOne({ where: { userId } });

    if (store) {
      // if (store.about)

      if (!store.about) {
        const scrapeResult = await fireCrawl.scrapeUrl(`${store.domain}`, {
          formats: ["markdown", "html"],
        });

        store.about = markdownToPlainText(scrapeResult.markdown);
        await store.save();
      }

      return NextResponse.json({ store }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }
  }

  return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
}
