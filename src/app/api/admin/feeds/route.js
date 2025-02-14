export async function GET(req) {
    return new Response(
      JSON.stringify({
        "success": true,
        "data": [
          {
            "id": "DFF",
            "name": "Default Feed"
          }
        ],
        //pagination helpers
        "from": "first id of the resource",
        "to": "last id of the resource",
        "total_records": "total records of the resource",
        "per_page": "resource per page",
        "current_page": "current page of the resource",
        "last_page": "last page of the resource"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
  