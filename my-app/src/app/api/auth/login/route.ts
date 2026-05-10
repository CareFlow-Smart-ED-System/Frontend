import { NextRequest, NextResponse } from 'next/server'

type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: {
    userId: string
    displayName: string
    role: string
    mustChangePassword: boolean
  }
  error?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!process.env.API_INTERNAL_URL) {
      console.error('[auth/login] API_INTERNAL_URL is not set')
      return NextResponse.json(
        { error: 'Server misconfiguration: API_INTERNAL_URL missing' },
        { status: 500 }
      )
    }

    const apiRes = await fetch(
      `${process.env.API_INTERNAL_URL}/api/v1/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    const data = (await apiRes.json()) as LoginResponse

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
    console.error('[auth/login] Unexpected error:', err)

    return NextResponse.json(
      { error: 'Failed to reach authentication server' },
      { status: 500 }
    )
  }
}