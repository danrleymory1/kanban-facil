import { NextResponse } from 'next/server';
import * as mongoService from '@/services/mongodb.service';
import { withAuth, compose, withRateLimit } from '@/lib/auth-middleware';

export const GET = withAuth(async (request, _user) => {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');
    const sprintId = searchParams.get('sprintId');

    if (sprintId) {
      const sprint = await mongoService.getSprint(sprintId);
      return NextResponse.json(sprint);
    }

    if (boardId) {
      const sprints = await mongoService.getBoardSprints(boardId);
      return NextResponse.json(sprints);
    }

    return NextResponse.json({ error: 'Missing boardId or sprintId' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching sprints:', error);
    return NextResponse.json({ error: 'Failed to fetch sprints' }, { status: 500 });
  }
});

export const POST = compose(withRateLimit(10), withAuth)(async (request, _user) => {
  try {
    const body = await request.json();
    const { boardId, nome, dataInicio, dataFim, ...data } = body;

    if (!boardId || !nome || !dataInicio || !dataFim) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sprint = await mongoService.createSprint(
      boardId,
      nome,
      new Date(dataInicio),
      new Date(dataFim),
      data
    );
    return NextResponse.json(sprint);
  } catch (error) {
    console.error('Error creating sprint:', error);
    return NextResponse.json({ error: 'Failed to create sprint' }, { status: 500 });
  }
});

export const PUT = withAuth(async (request, _user) => {
  try {
    const body = await request.json();
    const { sprintId, ...data } = body;

    if (!sprintId) {
      return NextResponse.json({ error: 'Missing sprintId' }, { status: 400 });
    }

    await mongoService.updateSprint(sprintId, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating sprint:', error);
    return NextResponse.json({ error: 'Failed to update sprint' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (request, _user) => {
  try {
    const { searchParams } = new URL(request.url);
    const sprintId = searchParams.get('sprintId');

    if (!sprintId) {
      return NextResponse.json({ error: 'Missing sprintId' }, { status: 400 });
    }

    await mongoService.deleteSprint(sprintId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sprint:', error);
    return NextResponse.json({ error: 'Failed to delete sprint' }, { status: 500 });
  }
});
