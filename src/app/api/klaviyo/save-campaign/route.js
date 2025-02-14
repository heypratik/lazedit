import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import Campaigns from "../../../../../models/Campaigns";

export async function POST(req, res) {
  const {
    klaviyoCampaignId,
    genEmailData,
    htmlEmailTemplate,
    jsonEmailTemplate,
    storeId,
  } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const campaign = await Campaigns.create({
      klaviyoCampaignId,
      genEmailData,
      htmlEmailTemplate,
      jsonEmailTemplate,
      storeId,
    });

    return new Response(JSON.stringify(campaign), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
