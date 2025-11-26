import { NextResponse } from 'next/server'
import { getTestEmailLogs, getTestEmailStats, clearTestEmailLogs } from '@/lib/email/test-mode'

export async function GET() {
  const logs = getTestEmailLogs()
  const stats = getTestEmailStats()
  
  return NextResponse.json({
    logs: logs.reverse(), // Mais recentes primeiro
    stats
  })
}

export async function DELETE() {
  clearTestEmailLogs()
  return NextResponse.json({ success: true })
}

