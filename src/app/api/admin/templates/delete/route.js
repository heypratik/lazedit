// src/app/api/templates/delete/route.js

import { NextResponse } from 'next/server';
import Templates from '../../../../../../models/Templates';

export async function POST(request) {
  try {
    const { templateId } = await request.json();

    // Check if templateId is provided
    if (!templateId) {
      return NextResponse.json(
        { message: 'Template ID is required.' },
        { status: 400 }
      );
    }

    // Find and delete the template
    const deletedTemplate = await Templates.destroy({
      where: { id: templateId },
    });

    // Check if deletion was successful
    if (!deletedTemplate) {
      return NextResponse.json(
        { message: 'Template not found or could not be deleted.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Template deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the template.' },
      { status: 500 }
    );
  }
}
