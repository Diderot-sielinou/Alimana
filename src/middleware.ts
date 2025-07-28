import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/auth/callback',
  '/accept-invite',
  '/_next', // assets
  '/favicon.ico',
  '/api',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Laisse passer les pages publiques
  const isPublic = PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath));
  if (isPublic) return NextResponse.next();

  const accessToken = req.cookies.get('access_token');

  // 2. Si pas de cookie → rediriger vers /login
  if (!accessToken) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Si utilisateur connecté mais pas encore de contexte boutique
  if (
    pathname !== '/select-store' &&
    pathname !== '/logout' &&
    pathname !== '/api' &&
    pathname !== '/dashboard'
  ) {
    const storeSelected = req.cookies.get('access_token');

    if (!storeSelected) {
      const storeSelectUrl = new URL('/select-store', req.url);
      return NextResponse.redirect(storeSelectUrl);
    }
  }

  return NextResponse.next();
}

// Configure les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: [
    /*
     * Fait correspondre toutes les chemins de requête sauf ceux qui commencent par :
     * - /api (géré spécifiquement ci-dessus si nécessaire, sinon exclu)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (icône de site)
     * - Et les chemins publics définis dans publicPaths
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
