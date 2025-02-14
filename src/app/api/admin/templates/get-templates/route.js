// src/app/api/templates/route.js

export const dynamic = "force-dynamic";


import { NextResponse } from 'next/server';
import Templates from '../../../../../../models/Templates';

export async function GET() {
  try {
    // Fetch all templates from the database
    const templates = await Templates.findAll();

    // Return templates as a JSON response
    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching templates.' },
      { status: 500 }
    );
  }
}
