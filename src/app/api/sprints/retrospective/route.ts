import { NextResponse } from 'next/server';
import * as mongoService from '@/services/mongodb.service';
import { withAuth, compose, withRateLimit } from '@/lib/auth-middleware';

export const POST = compose(withRateLimit(10), withAuth)(async (request, _user) => {
  try {
    const body = await request.json();
    const { sprintId, pontoPositivos, pontosNegativos, acoesParaMelhoria, participantes } = body;

    if (!sprintId || !pontoPositivos || !pontosNegativos || !acoesParaMelhoria) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const retrospectiva = await mongoService.addRetrospective(sprintId, {
      pontoPositivos,
      pontosNegativos,
      acoesParaMelhoria,
      participantes,
    });

    return NextResponse.json(retrospectiva);
  } catch (error) {
    console.error('Error adding retrospective:', error);
    return NextResponse.json({ error: 'Failed to add retrospective' }, { status: 500 });
  }
});
