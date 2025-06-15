import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { _type } = body

    // Revalidate based on the document type
    if (_type === 'projectMeta') {
      revalidatePath('/portfolio')
      revalidatePath('/portfolio/[slug]')
    } else if (_type === 'pageMeta') {
      revalidatePath('/component-test')
      revalidatePath('/component-test/[slug]')
    } else if (_type === 'about') {
      revalidatePath('/about')
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: err }, { status: 500 })
  }
} 