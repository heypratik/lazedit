import Learning from "../../../../../../models/Learning";
export const dynamic = "force-dynamic";

export async function GET(req, res) {
  try {
    const learnings = await Learning.findAll();
    return new Response(JSON.stringify(learnings), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
