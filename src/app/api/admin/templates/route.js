import { emailTemplates } from "./defaultBlockList";
import authOptions from "@/lib/authOptions";
import Templates from "../../../../../models/Templates";

export async function POST(req) {
  function extractClass(htmlString) {
    const match = htmlString.match(/class="([^"]*)"/);
    return match ? match[1] : null;
  }

  function replacePlainText(htmlString, newText) {
    return htmlString.replace(/>([^<>]+)</g, `>${newText}<`);
  }

  try {
    const { id, genEmailData } = await req.json();

    function findAndUpdateMjText(obj) {
      if (Array.isArray(obj)) {
        return obj.map(findAndUpdateMjText);
      } else if (typeof obj === "object" && obj !== null) {
        if (obj.tagName === "mj-text") {
          if (extractClass(obj.content)) {
            const txtClass = extractClass(obj.content);
            if (txtClass == "introductory_text") {
              obj.content = replacePlainText(
                obj.content,
                genEmailData.introductoryText
              );
            }

            if (txtClass == "subtitle") {
              obj.content = replacePlainText(
                obj.content,
                genEmailData.subTitle
              );
            }

            if (txtClass == "subject") {
              obj.content = replacePlainText(obj.content, genEmailData.subject);
            }

            if (txtClass == "company_info") {
              obj.content = replacePlainText(
                obj.content,
                genEmailData.companyInfo
              );
            }

            if (txtClass == "discount-text") {
              obj.content = replacePlainText(
                obj.content,
                genEmailData.discount
              );
            }

            if (txtClass == "discount-text") {
              obj.content = replacePlainText(
                obj.content,
                genEmailData.discount
              );
            }

            if (txtClass == "synopsis") {
              obj.content = replacePlainText(
                obj.content,
                genEmailData.synopsis
              );
            }

            if (txtClass == "tagline") {
              obj.content = replacePlainText(obj.content, genEmailData.tagline);
            }

            if (
              txtClass == "shipping-information" &&
              genEmailData.shipping !== "" &&
              genEmailData.shipping !== null
            ) {
              obj.content = replacePlainText(
                obj.content,
                genEmailData.shipping
              );
            }
          }
        }

        if (obj.tagName === "mj-button") {
          const htmlString = obj.content;
          const match = htmlString.match(/>([^<]+)<\//);

          if (match[1].toLowerCase() === "shop now") {
            obj.attributes.href = genEmailData.storeDomain;
          }
        }

        if (obj.tagName === "mj-image") {
          if (obj.attributes.alt === "logo") {
            obj.attributes.src = genEmailData.logo;
          }

          if (obj.attributes.alt === "banner") {
            obj.attributes.src = genEmailData.banner;
          }
        }

        if (obj.tagName === "mj-social-element") {
          if (obj.attributes.alt == "facebook") {
            obj.attributes.href =
              genEmailData?.socialLinks?.facebook || "https://www.facebook.com";
          }

          if (obj.attributes.alt == "twitter") {
            obj.attributes.href =
              genEmailData?.socialLinks?.twitter || "https://www.twitter.com";
          }

          if (obj.attributes.alt == "x") {
            obj.attributes.href =
              genEmailData?.socialLinks?.twitter || "https://www.twitter.com";
          }

          if (obj.attributes.alt == "instagram") {
            obj.attributes.href =
              genEmailData?.socialLinks?.instagram ||
              "https://www.instagram.com";
          }

          if (obj.attributes.alt == "tiktok") {
            obj.attributes.href =
              genEmailData?.socialLinks?.tiktok || "https://www.tiktok.com";
          }
        }

        if (obj.blockName === "product") {
          // console.log(obj)
        }
        // Reassign each property to its updated version
        Object.keys(obj).forEach((key) => {
          obj[key] = findAndUpdateMjText(obj[key]);
        });
      }
      return obj;
    }

    async function getTemplateById(id) {
      // const found = emailTemplates.find((template) => template.id == id);

      const found = await Templates.findOne({ where: { id } });
      if (!found) {
        return null;
      }

      return JSON.parse(found.template);
    }

    // Fetch or process the template using the extracted id
    const template = await getTemplateById(id); // Example function to get the data

    // Template Replacer
    const updatedTemplate = findAndUpdateMjText(template);

    // UPDATE TEMPLATE WITH PRODUCTS

    function formatDescription(description) {
      // Remove leading double quotes if present
      if (description.startsWith('"')) {
        description = description.slice(1);
      }

      // Trim description to 30 words and add ellipsis if needed
      const words = description.split(" ");
      if (words.length > 30) {
        return words.slice(0, 30).join(" ") + "...";
      }

      return description;
    }

    function updateFeedBlockName(parent, path = []) {
      if (genEmailData.products.length < 1) {
        return;
      }
      // Ensure we have the correct number of `mj-feed-block` elements in `parent`
      if (Array.isArray(parent)) {
        const feedBlocks = parent.filter(
          (item) => item && item.tagName === "mj-feed-block"
        );
        const feedBlockCount = feedBlocks.length;

        // If there are more products than feed blocks, clone existing blocks
        if (genEmailData.products.length > feedBlockCount) {
          for (let i = feedBlockCount; i < genEmailData.products.length; i++) {
            // Clone the first existing `mj-feed-block`
            const newBlock = JSON.parse(JSON.stringify(feedBlocks[0])); // Deep clone
            parent.push(newBlock);
          }
        } else if (genEmailData.products.length < feedBlockCount) {
          // Remove extra `mj-feed-block` elements if more than product count
          let blocksToRemove = feedBlockCount - genEmailData.products.length;
          for (let i = parent.length - 1; i >= 0 && blocksToRemove > 0; i--) {
            if (parent[i] && parent[i].tagName === "mj-feed-block") {
              parent.splice(i, 1);
              blocksToRemove--;
            }
          }
        }
      }

      // Now proceed to update each `mj-feed-block`
      if (Array.isArray(parent)) {
        for (let i = 0; i < parent.length; i++) {
          updateFeedBlockName(parent[i], [...path, i]); // Recursive call with index added to the path
        }
      } else if (parent && parent.tagName === "mj-feed-block") {
        // Update attributes.image if it exists
        if (parent.attributes && parent.attributes.image !== undefined) {
          if (Number(path[0]) % 2 === 0) {
            parent.attributes["columns-layout"] = "image-text";
          } else {
            parent.attributes["columns-layout"] = "text-image";
          }

          let numberArr = Number(path[0]);
          parent.attributes.title = `<div style="font-family: inherit;">${genEmailData.products[numberArr]?.title}</div>`;
          parent.attributes["raw-title"] =
            genEmailData.products[numberArr]?.title;
          parent.attributes.description = `<div style="font-family: inherit;">${formatDescription(
            genEmailData.products[numberArr]?.description || ""
          )}</div>`;
          parent.attributes["raw-description"] = formatDescription(
            genEmailData.products[numberArr]?.description || ""
          );
          const priceAmount =
            genEmailData.products[numberArr].priceRangeV2?.minVariantPrice
              ?.amount || 0;

          const currencyCode =
            genEmailData.products[numberArr].priceRangeV2?.minVariantPrice
              ?.currencyCode || "USD";

          // Based on the currency code, add the appropriate symbol
          const currencySymbols = {
            USD: "$",
            EUR: "€",
            GBP: "£",
            INR: "₹",
            JPY: "¥",
            CNY: "¥",
            CAD: "$",
            AUD: "$",
            CHF: "Fr",
            SEK: "kr",
            NZD: "$",
            KRW: "₩",
            SGD: "$",
            NOK: "kr",
            MXN: "$",
            HKD: "$",
            TRY: "₺",
            RUB: "₽",
            BRL: "R$",
            ZAR: "R",
            TWD: "NT$",
            SAR: "﷼",
            AED: "د.إ",
            DKK: "kr",
            PLN: "zł",
          };
          const currencySymbol = currencySymbols[currencyCode] || "$";
          parent.attributes.price = `<div style="font-family: inherit;">${currencySymbol}${priceAmount}</div>`;
          parent.attributes["raw-price"] = `${currencySymbol}${priceAmount}`;

          parent.attributes.image = genEmailData.products[numberArr]?.image;
          parent.attributes.href = genEmailData.products[numberArr]?.link;
        }
      }
    }

    function findParentOfObject(obj, target, parent = null) {
      // Check if the current object matches the target object
      if (
        obj &&
        obj.tagName === target.tagName &&
        obj.blockName === target.blockName
      ) {
        if (parent) {
          updateFeedBlockName(parent);
        }
        return parent;
      }

      // If the current object is an array, recurse over each element
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const found = findParentOfObject(item, target, obj);
          if (found) return found;
        }
      }

      // If the current object is an object, recurse over its properties
      else if (typeof obj === "object" && obj !== null) {
        for (const key in obj) {
          const found = findParentOfObject(obj[key], target, obj);
          if (found) return found;
        }
      }

      // Return null if the target object is not found
      return null;
    }

    const target = { tagName: "mj-feed-block", blockName: "product" };
    const updateProducts = findParentOfObject(updatedTemplate, target);

    return new Response(JSON.stringify({ json: updatedTemplate }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }

  return new Response(null, {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
