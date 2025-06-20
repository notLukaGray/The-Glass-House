import { NextRequest, NextResponse } from 'next/server';
import { getLatestCommit } from '@/lib/github';

export async function GET() {
  const { commitTime, commitMessage } = await getLatestCommit();

  if (!commitTime) {
    return NextResponse.json(
      { error: 'Failed to retrieve commit information.' },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ commitTime, commitMessage });
} 