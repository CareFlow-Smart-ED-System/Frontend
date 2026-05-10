import { NextRequest, NextResponse } from 'next/server'

type UpdatePasswordResponse = {
  accessToken: string
  refreshToken: string
  user: {
    userId: string
    displayName: string
    role: string
    mustChangePassword: boolean
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const token = req.cookies.get('careflow-token')?.value

    if (!process.env.API_INTERNAL_URL) {
      return NextResponse.json(
        { error: 'Server misconfiguration: API_INTERNAL_URL missing' },
        { status: 500 }
      )
    }

    const apiRes = await fetch(
      `${process.env.API_INTERNAL_URL}/api/v1/auth/update-password`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      }
    )

    // safe parsing without unknown errors
    const data = (await apiRes.json()) as UpdatePasswordResponse

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
    console.error('[auth/update-password] Unexpected error:', err)

    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  }
}