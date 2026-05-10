import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('careflow-token')?.value

    if (process.env.API_INTERNAL_URL) {
      await fetch(`${process.env.API_INTERNAL_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }).catch((err) => console.warn('[auth/logout] Backend call failed:', err))
    }

    const response = NextResponse.json({ message: 'Logged out successfully' })
    response.cookies.set('careflow-token', '', { maxAge: 0, path: '/' })
    return response
  } catch (err) {
    console.error('[auth/logout] Unexpected error:', err)
    const response = NextResponse.json({ message: 'Logged out' })
    response.cookies.set('careflow-token', '', { maxAge: 0, path: '/' })
    return response
  }
}