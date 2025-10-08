import { NextResponse } from 'next/server';
import * as mongoService from '@/services/mongodb.service';
import { withAuth } from '@/lib/auth-middleware';

export const POST = withAuth(async (request, _user) => {
  try {
    const body = await request.json();
    const { sprintId } = body;

    if (!sprintId) {
      return NextResponse.json({ error: 'Missing sprintId' }, { status: 400 });
    }

    const metrics = await mongoService.updateSprintMetrics(sprintId);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error updating sprint metrics:', error);
    return NextResponse.json({ error: 'Failed to update sprint metrics' }, { status: 500 });
  }
});
