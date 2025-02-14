import { NextResponse } from "next/server";
import Users from "../../../../../../models/Users";
import Calendar from "../../../../../../models/Calendar";

export async function POST(req, { params }) {
  const { slug } = await params;

  if (slug.length === 1 && slug[0] === "startcampaign") {
    try {
      const { id, campaign } = await req.json();

      if (!id || !campaign) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }

      const user = await Users.findOne({ where: { id } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const calendar = await Calendar.findOne({ where: { userId: id } });
      let updatedCalendar = null;
      if (!calendar) {
        // Create a new calendar
        updatedCalendar = await Calendar.create({
          userId: id,
          startCreateCampaign: campaign,
        });
      } else {
        // Update the existing calendar
        updatedCalendar = await Calendar.update(
          {
            startCreateCampaign: campaign,
          },
          {
            where: { userId: id },
          }
        );
      }

      return NextResponse.json(
        { success: true, updatedCalendar },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  } else if (slug.length === 1 && slug[0] === "getcurrentcampaign") {
    // Get the store details
    try {
      const { userId } = await req.json();
      const user = await Users.findOne({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const calendar = await Calendar.findOne({ where: { userId } });
      if (!calendar) {
        return NextResponse.json(
          { error: "Calendar not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ store: calendar }, { status: 200 });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }
  return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
}
