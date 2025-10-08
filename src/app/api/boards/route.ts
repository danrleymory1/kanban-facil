import { NextResponse } from 'next/server';
import * as mongoService from '@/services/mongodb.service';
import { withAuth, compose, withRateLimit } from '@/lib/auth-middleware';

export const GET = withAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');

    if (boardId) {
      const board = await mongoService.getBoard(boardId);
      return NextResponse.json(board);
    }

    // Buscar boards do usuário autenticado
    const boards = await mongoService.getUserBoards(user.uid);
    return NextResponse.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 });
  }
});

export const POST = compose(withRateLimit(10), withAuth)(async (request, user) => {
  try {
    const body = await request.json();
    const { nome, descricao, userName } = body;

    if (!nome) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Usar user.uid do token JWT
    const board = await mongoService.createBoard(user.uid, nome, descricao, userName || user.name);
    return NextResponse.json(board);
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json({ error: 'Failed to create board' }, { status: 500 });
  }
});

export const PUT = withAuth(async (request, _user) => {
  try {
    const body = await request.json();
    const { boardId, ...data } = body;

    if (!boardId) {
      return NextResponse.json({ error: 'Missing boardId' }, { status: 400 });
    }

    await mongoService.updateBoard(boardId, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating board:', error);
    return NextResponse.json({ error: 'Failed to update board' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (request, _user) => {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');

    if (!boardId) {
      return NextResponse.json({ error: 'Missing boardId' }, { status: 400 });
    }

    await mongoService.deleteBoard(boardId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting board:', error);
    return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
  }
});
