// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {

    if (request.nextUrl.pathname === '/auth') {
        return NextResponse.next();
    }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/auth/session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || ''
        },
        // Make sure to include credentials
        credentials: 'include'
    });

    const session = await response.json();

    let activeUser = null;
    let onboarded = null;
    
    if (session.user.shopifyStoreId) {
      console.log("SHOPIFY CUSTOMER");
  
      const activeDate = new Date("2025-01-06T00:00:00.000Z"); // Fixed date: 6th Jan 2025
      const userCreatedDate = new Date(session.user.created_at);

      console.log(userCreatedDate)
      console.log(activeDate)
      console.log(userCreatedDate < activeDate)
  
      if (userCreatedDate < activeDate) {
          activeUser = true;
      } else {
          if (session.user.stripePlanEndsAt && session.user.stripePlanEndsAt > new Date().toISOString()) {
              activeUser = true;
          } else { 
              activeUser = false;
          }
      }
  }

    if (session.user.shopifyStoreId == null && session.user.stripePlanEndsAt == null) {
      console.log("NO PLAN BUT SHOPIFY")
        activeUser = false;
    }

    if (session.user.shopifyStoreId == null && session.user.stripePlanEndsAt > new Date().toISOString()) {
        activeUser = true;
    }

    if (activeUser == false && request.nextUrl.pathname !== '/billing') {
      console.log("NO PLAN")
        return NextResponse.redirect(new URL('/billing', request.url));
    }


    if (activeUser == true && session.user.onboarded == false && request.nextUrl.pathname !== '/onboarding') {
      console.log("ONBOARDING")
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    if (activeUser == true && session.user.onboarded == true && session.user.settingsCompleted == false && request.nextUrl.pathname !== '/settings') {
      console.log("SETTINGS")
        return NextResponse.redirect(new URL('/settings', request.url));
    }

    // if (activeUser == true && session.user.onboarded == true && session.user.settingsCompleted == true && request.nextUrl.pathname !== '/dashboard') {
    //     return NextResponse.redirect(new URL('/dashboard', request.url));
    // }


  } catch (error) {
    console.error('Error checking session:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}