import { NextResponse } from 'next/server';
import * as mongoService from '@/services/mongodb.service';
import { withAuth, compose, withRateLimit } from '@/lib/auth-middleware';

export const GET = withAuth(async (request, _user) => {
  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get('listId');
    const boardId = searchParams.get('boardId');

    if (listId) {
      const cards = await mongoService.getListCards(listId);
      return NextResponse.json(cards);
    }

    if (boardId) {
      const cards = await mongoService.getBoardCards(boardId);
      return NextResponse.json(cards);
    }

    return NextResponse.json({ error: 'Missing listId or boardId' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
});

export const POST = compose(withRateLimit(30), withAuth)(async (request, _user) => {
  try {
    const body = await request.json();
    const { listId, boardId, nome, ordem, ...data } = body;

    if (!listId || !boardId || !nome || ordem === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const card = await mongoService.createCard(listId, boardId, nome, ordem, data);
    return NextResponse.json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
});

export const PUT = withAuth(async (request, _user) => {
  try {
    const body = await request.json();
    const { cardId, ...data } = body;

    if (!cardId) {
      return NextResponse.json({ error: 'Missing cardId' }, { status: 400 });
    }

    await mongoService.updateCard(cardId, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (request, _user) => {
  try {
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('cardId');

    if (!cardId) {
      return NextResponse.json({ error: 'Missing cardId' }, { status: 400 });
    }

    await mongoService.deleteCard(cardId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
});
