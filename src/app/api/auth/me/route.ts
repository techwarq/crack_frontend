import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Retrieve the JWT token from cookies
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Make a request to the backend's `me` endpoint to get user info
    const response = await fetch('http://localhost:4005/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || 'Failed to retrieve user information' },
        { status: response.status }
      );
    }

    // Send the user data to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
