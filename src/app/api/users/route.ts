import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withAuth, compose, withRateLimit } from '@/lib/auth-middleware';

const DB_NAME = 'default';

export const GET = withAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Se não foi passado userId, buscar o próprio usuário autenticado
    const targetUserId = userId || user.uid;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let userData = await db.collection('users').findOne({ userId: targetUserId });

    // Se o usuário não existe, criar automaticamente com dados do JWT
    if (!userData && targetUserId === user.uid) {
      userData = {
        userId: user.uid,
        email: user.email || '',
        nome: user.name || user.email?.split('@')[0] || 'Usuário',
        isAnonymous: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('users').insertOne(userData);
    }

    return NextResponse.json(userData || null);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
});

export const POST = compose(withRateLimit(5), withAuth)(async (request, user) => {
  try {
    const body = await request.json();
    const { email, nome, isAnonymous } = body;

    if (!email || !nome) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const userData = {
      userId: user.uid,
      email,
      nome,
      isAnonymous: isAnonymous || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('users').insertOne(userData);
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
});
