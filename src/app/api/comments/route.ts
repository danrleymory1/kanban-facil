import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { withAuth, compose, withRateLimit } from '@/lib/auth-middleware';

const DB_NAME = 'default';

export const GET = withAuth(async (request, _user) => {
  try {
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('cardId');

    if (!cardId) {
      return NextResponse.json({ error: 'Missing cardId' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const comments = await db
      .collection('comments')
      .find({ cardId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      comments.map(comment => ({
        ...comment,
        commentId: comment._id.toString(),
        _id: undefined,
      }))
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
});

export const POST = compose(withRateLimit(30), withAuth)(async (request, user) => {
  try {
    const body = await request.json();
    const { cardId, autorNome, texto, mencoes } = body;

    if (!cardId || !texto) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const commentData = {
      cardId,
      autorId: user.uid,
      autorNome: autorNome || user.name || user.email,
      texto,
      mencoes: mencoes || [],
      editado: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('comments').insertOne(commentData);

    // Criar notificações para menções
    if (mencoes && mencoes.length > 0) {
      const notifications = mencoes.map((userId: string) => ({
        userId,
        tipo: 'mencao',
        titulo: 'Você foi mencionado',
        mensagem: `${commentData.autorNome} mencionou você em um comentário`,
        link: `/board/${cardId}`,
        lida: false,
        createdAt: new Date(),
      }));

      await db.collection('notifications').insertMany(notifications);
    }

    return NextResponse.json({
      commentId: result.insertedId.toString(),
      ...commentData,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
});

export const PUT = withAuth(async (request, user) => {
  try {
    const body = await request.json();
    const { commentId, texto } = body;

    if (!commentId || !texto) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Verificar se o comentário pertence ao usuário autenticado
    const comment = await db.collection('comments').findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (comment.autorId !== user.uid) {
      return NextResponse.json({ error: 'Unauthorized to edit this comment' }, { status: 403 });
    }

    await db.collection('comments').updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          texto,
          editado: true,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json({ error: 'Missing commentId' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Verificar se o comentário pertence ao usuário autenticado
    const comment = await db.collection('comments').findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (comment.autorId !== user.uid) {
      return NextResponse.json({ error: 'Unauthorized to delete this comment' }, { status: 403 });
    }

    await db.collection('comments').deleteOne({ _id: new ObjectId(commentId) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
});
