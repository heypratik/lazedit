import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import Campaigns from "../../../../../models/Campaigns";
import { where } from "sequelize";

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");

  try {
    const campaign = await Campaigns.findOne({
      where: {
        klaviyoCampaignId: campaignId,
      },
    });

    if (!campaign) {
      return new Response(JSON.stringify({ error: "Campaign not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

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
