import { NextResponse } from 'next/server';
import * as mongoService from '@/services/mongodb.service';
import { withAuth, compose, withRateLimit } from '@/lib/auth-middleware';

export const GET = withAuth(async (request, _user) => {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');

    if (!boardId) {
      return NextResponse.json({ error: 'Missing boardId' }, { status: 400 });
    }

    const lists = await mongoService.getBoardLists(boardId);
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
});

export const POST = compose(withRateLimit(20), withAuth)(async (request, _user) => {
  try {
    const body = await request.json();
    const { boardId, nome, ordem } = body;

    if (!boardId || !nome || ordem === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const list = await mongoService.createList(boardId, nome, ordem);
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
  }
});

export const PUT = withAuth(async (request, _user) => {
  try {
    const body = await request.json();
    const { listId, ...data } = body;

    if (!listId) {
      return NextResponse.json({ error: 'Missing listId' }, { status: 400 });
    }

    await mongoService.updateList(listId, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating list:', error);
    return NextResponse.json({ error: 'Failed to update list' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (request, _user) => {
  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get('listId');

    if (!listId) {
      return NextResponse.json({ error: 'Missing listId' }, { status: 400 });
    }

    await mongoService.deleteList(listId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting list:', error);
    return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 });
  }
});
