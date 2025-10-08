import { NextResponse } from 'next/server';
import * as mongoService from '@/services/mongodb.service';
import { withAuth, compose, withRateLimit } from '@/lib/auth-middleware';

export const GET = withAuth(async (_request, user) => {
  try {
    // Buscar knowledge bases do usuário autenticado
    const knowledgeBases = await mongoService.getUserKnowledgeBases(user.uid);
    return NextResponse.json(knowledgeBases);
  } catch (error) {
    console.error('Error fetching knowledge bases:', error);
    return NextResponse.json({ error: 'Failed to fetch knowledge bases' }, { status: 500 });
  }
});

export const POST = compose(withRateLimit(10), withAuth)(async (request, user) => {
  try {
    const body = await request.json();
    const { titulo, conteudo, ...data } = body;

    if (!titulo || !conteudo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Usar user.uid do token JWT
    const knowledgeBase = await mongoService.createKnowledgeBase(user.uid, titulo, conteudo, data);
    return NextResponse.json(knowledgeBase);
  } catch (error) {
    console.error('Error creating knowledge base:', error);
    return NextResponse.json({ error: 'Failed to create knowledge base' }, { status: 500 });
  }
});

export const PUT = withAuth(async (request, _user) => {
  try {
    const body = await request.json();
    const { knowledgeBaseId, ...data } = body;

    if (!knowledgeBaseId) {
      return NextResponse.json({ error: 'Missing knowledgeBaseId' }, { status: 400 });
    }

    await mongoService.updateKnowledgeBase(knowledgeBaseId, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating knowledge base:', error);
    return NextResponse.json({ error: 'Failed to update knowledge base' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (request, _user) => {
  try {
    const { searchParams } = new URL(request.url);
    const knowledgeBaseId = searchParams.get('knowledgeBaseId');

    if (!knowledgeBaseId) {
      return NextResponse.json({ error: 'Missing knowledgeBaseId' }, { status: 400 });
    }

    await mongoService.deleteKnowledgeBase(knowledgeBaseId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting knowledge base:', error);
    return NextResponse.json({ error: 'Failed to delete knowledge base' }, { status: 500 });
  }
});
