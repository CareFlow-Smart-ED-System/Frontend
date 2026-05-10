import { NextRequest, NextResponse } from 'next/server'

type RefreshResponse = {
  accessToken: string
  refreshToken: string
  user: {
    userId: string
    displayName: string
    role: string
    mustChangePassword: boolean
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!process.env.API_INTERNAL_URL) {
      return NextResponse.json(
        { error: 'Server misconfiguration: API_INTERNAL_URL missing' },
        { status: 500 }
      )
    }

    const apiRes = await fetch(
      `${process.env.API_INTERNAL_URL}/api/v1/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    const data = (await apiRes.json()) as RefreshResponse

    if (!apiRes.ok) {
      return NextResponse.json(data, { status: apiRes.status })
    }

    const response = NextResponse.json(data, { status: 200 })

    response.cookies.set('careflow-token', data.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    })

    return response
  } catch (err) {
    console.error('[auth/refresh] Unexpected error:', err)

    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    )
  }
}