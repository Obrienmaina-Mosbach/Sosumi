// app/api/public/user/[userId]/route.js
// This API route provides publicly accessible basic profile information for a user (author).
// It does NOT require authentication.

import { NextResponse } from 'next/server';
import connectDB from '@/Lib/config/db'; // Adjust path as needed
import { User } from '@/Lib/models/blogmodel'; // Adjust path as needed

// Force this route to be dynamic to prevent static caching issues if user data changes frequently.
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  await connectDB(); // Ensure database connection

  const { userId } = params; // Get the user ID from the dynamic route segment

  if (!userId) {
    return NextResponse.json({ success: false, message: 'User ID is required.' }, { status: 400 });
  }

  try {
    // Find the user by ID and select ONLY public fields.
    // IMPORTANT: Exclude sensitive fields like passwordHash, tokens, accessToken, email, etc.
    const user = await User.findById(userId).select(
      'username name firstName lastName profilePictureUrl bio country gender homepageUrl company city interests registeredAt role'
    ).lean(); // Use .lean() for plain JavaScript objects, which are faster for read-only operations.

    if (!user) {
      return NextResponse.json({ success: false, message: 'Author not found.' }, { status: 404 });
    }

    // You can further refine the data returned if certain fields should only be visible to logged-in users, etc.
    // For now, we're returning all selected fields.

    return NextResponse.json({ success: true, author: user }, { status: 200 });

  } catch (error) {
    console.error('Error fetching public author profile:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
