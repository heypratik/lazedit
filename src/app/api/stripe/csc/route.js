import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req, res) {
    const event = await req.json();

    const planEndsAt = new Date(event.data.object.current_period_end * 1000);

    try {
        // Find user by stripeCustomerId
        const users = await db
            .select()
            .from(user)
            .where(eq(user.stripeCustomerId, event.data.object.customer))
            .limit(1);

        if (users.length > 0) {
            // Update user's stripe plan end date
            await db
                .update(user)
                .set({ 
                    stripePlanEndsAt: planEndsAt,
                    updatedAt: new Date()
                })
                .where(eq(user.stripeCustomerId, event.data.object.customer));
        } else {
            console.log('User not found');
            return new Response(JSON.stringify({ success: false }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error updating user subscription:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}