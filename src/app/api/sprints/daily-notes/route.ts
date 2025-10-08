import { NextResponse } from 'next/server';
import * as mongoService from '@/services/mongodb.service';
import { withAuth, compose, withRateLimit } from '@/lib/auth-middleware';

export const POST = compose(withRateLimit(20), withAuth)(async (request, _user) => {
  try {
    const body = await request.json();
    const { sprintId, impedimentos, notas, participantes } = body;

    if (!sprintId || !impedimentos || !notas || !participantes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dailyNote = await mongoService.addDailyNote(sprintId, {
      impedimentos,
      notas,
      participantes,
    });

    return NextResponse.json(dailyNote);
  } catch (error) {
    console.error('Error adding daily note:', error);
    return NextResponse.json({ error: 'Failed to add daily note' }, { status: 500 });
  }
});
