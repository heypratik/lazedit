import { getServerSession } from 'next-auth';
import Users from '../../../../../models/Users';

export async function POST(req, res) {

    const event =  await req.json()

    const users = await Users.findOne({ where: { stripeCustomerId: event.data.object.customer } });
    const planEndsat = new Date(event.data.object.current_period_end * 1000)

    if (users) {
        await Users.update({ stripePlanEndsAt: planEndsat }, { where: { stripeCustomerId: event.data.object.customer } });
    } else {
        console.log('User not found')
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
}