import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch('http://localhost:4005/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error || 'Signup failed' },
        { status: response.status }
      );
    }

    // After signup, let's also log them in
    const loginResponse = await fetch('http://localhost:4005/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const loginData = await loginResponse.json();

    if (loginResponse.ok) {
      (await cookies()).set({
        name: 'token',
        value: loginData.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });

      // Send the user data without the password to the client
      return NextResponse.json({ user: { ...loginData.user, password: undefined } });
    }

    // If login fails after signup, still return the signup success
    return NextResponse.json({ user: { ...data.user, password: undefined } });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
