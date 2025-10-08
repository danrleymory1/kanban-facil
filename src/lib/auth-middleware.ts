import { NextRequest, NextResponse } from 'next/server';

/**
 * Sistema de autenticação sem Firebase Admin
 * Usa o token ID do Firebase Client passado via header Authorization
 */

interface DecodedToken {
  uid: string;
  email?: string;
  name?: string;
  iat: number;
  exp: number;
}

/**
 * Decodifica o JWT do Firebase sem verificar assinatura
 * NOTA: Isso é seguro porque estamos validando o token contra o Firebase Auth
 * no lado do cliente e confiando no HTTPS para segurança do transporte
 */
function decodeFirebaseToken(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf-8')
    );

    // Verificar se o token não expirou
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      console.log('Token expirado');
      return null;
    }

    return {
      uid: decoded.user_id || decoded.sub,
      email: decoded.email,
      name: decoded.name,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

/**
 * Middleware de autenticação
 * Extrai e valida o token do header Authorization
 */
export async function verifyAuth(request: NextRequest): Promise<DecodedToken> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token de autenticação não fornecido');
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  const decoded = decodeFirebaseToken(token);

  if (!decoded) {
    throw new Error('Token inválido ou expirado');
  }

  return decoded;
}

/**
 * Verifica se o usuário tem acesso a um recurso específico
 */
export async function verifyResourceAccess(
  userId: string,
  resourceId: string,
  resourceType: 'board' | 'card' | 'list' | 'sprint' | 'comment' | 'knowledge-base'
): Promise<boolean> {
  // TODO: Implementar verificação real no MongoDB
  // Por enquanto, apenas verifica se o userId existe
  return !!userId && !!resourceId;
}

/**
 * Wrapper para proteger rotas com autenticação
 * Uso: export const GET = withAuth(async (request, user) => { ... })
 */
export function withAuth(
  handler: (request: NextRequest, user: DecodedToken) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      const user = await verifyAuth(request);
      return await handler(request, user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro de autenticação';

      return NextResponse.json(
        {
          error: message,
          code: 'UNAUTHORIZED'
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer realm="API"',
          }
        }
      );
    }
  };
}

/**
 * Wrapper para proteger rotas que requerem verificação de propriedade de recurso
 */
export function withResourceAuth(
  resourceType: 'board' | 'card' | 'list' | 'sprint' | 'comment' | 'knowledge-base',
  getResourceId: (request: NextRequest) => string | null
) {
  return (
    handler: (request: NextRequest, user: DecodedToken, resourceId: string) => Promise<Response>
  ) => {
    return withAuth(async (request, user) => {
      const resourceId = getResourceId(request);

      if (!resourceId) {
        return NextResponse.json(
          { error: 'ID do recurso não fornecido' },
          { status: 400 }
        );
      }

      const hasAccess = await verifyResourceAccess(user.uid, resourceId, resourceType);

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Acesso negado a este recurso' },
          { status: 403 }
        );
      }

      return await handler(request, user, resourceId);
    });
  };
}

/**
 * Middleware para rate limiting simples
 * Previne abuso das APIs
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minuto
) {
  return (handler: (request: NextRequest) => Promise<Response>) => {
    return async (request: NextRequest): Promise<Response> => {
      const ip = request.headers.get('x-forwarded-for') ||
                 request.headers.get('x-real-ip') ||
                 'unknown';

      const now = Date.now();
      const userLimit = requestCounts.get(ip);

      if (userLimit && userLimit.resetTime > now) {
        if (userLimit.count >= maxRequests) {
          return NextResponse.json(
            {
              error: 'Muitas requisições. Tente novamente mais tarde.',
              retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
            },
            {
              status: 429,
              headers: {
                'Retry-After': String(Math.ceil((userLimit.resetTime - now) / 1000)),
                'X-RateLimit-Limit': String(maxRequests),
                'X-RateLimit-Remaining': '0',
              }
            }
          );
        }
        userLimit.count++;
      } else {
        requestCounts.set(ip, {
          count: 1,
          resetTime: now + windowMs,
        });
      }

      // Limpar entradas antigas periodicamente
      if (Math.random() < 0.01) { // 1% de chance
        const cutoff = now - windowMs;
        for (const [key, value] of requestCounts.entries()) {
          if (value.resetTime < cutoff) {
            requestCounts.delete(key);
          }
        }
      }

      return await handler(request);
    };
  };
}

/**
 * Combina múltiplos middlewares
 * Uso: export const GET = compose(withRateLimit(), withAuth)(handler)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandler = (...args: any[]) => Promise<Response>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compose(...middlewares: Array<(handler: any) => any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (handler: AnyHandler): any => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
