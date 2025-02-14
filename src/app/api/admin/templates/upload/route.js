// src/app/api/templates/upload/route.js

import { NextResponse } from 'next/server';
import Templates from '../../../../../../models/Templates';

export async function POST(request) {
  try {
    // Parse the request body as JSON
    const { template, html } = await request.json();

    // Ensure both fields are provided
    if (!template || !html) {
      return NextResponse.json(
        { message: 'Both JSON template and HTML content are required.' },
        { status: 400 }
      );
    }

    // Create a new template in the database
    const newTemplate = await Templates.create({
      template,
      html,
      active: true,  // or false, depending on the initial active status
    });

    return NextResponse.json(newTemplate, { status: 201, success: true });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the template.' },
      { status: 500 }
    );
  }
}
