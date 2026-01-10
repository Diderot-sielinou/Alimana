'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { storeTokens, setAuthToken } from '@/lib/api';
import { Loader2 } from 'lucide-react';

/**
 * Composant de chargement pendant la suspension
 */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900">Connexion en cours...</h1>
          <p className="text-gray-500">
            Veuillez patienter pendant que nous finalisons votre authentification.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant interne qui utilise useSearchParams
 *
 * URL attendue: /auth/callback?accessToken=xxx&refreshToken=xxx&isNewUser=true|false
 */
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Évite le double processing en React Strict Mode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processCallback = async () => {
      try {
        // Récupère les tokens depuis les paramètres URL
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const isNewUser = searchParams.get('isNewUser') === 'true';
        const error = searchParams.get('error');

        // Gestion des erreurs OAuth
        if (error) {
          console.error('OAuth error:', error);
          router.replace(`/signin?error=${encodeURIComponent(error)}`);
          return;
        }

        // Vérifie que les tokens sont présents
        if (!accessToken || !refreshToken) {
          console.error('Missing tokens in callback');
          router.replace('/signin?error=missing_tokens');
          return;
        }

        // ✅ Stocke les tokens dans localStorage
        storeTokens(accessToken, refreshToken);
        setAuthToken(accessToken);

        // Nettoie l'URL (supprime les tokens de l'historique)
        window.history.replaceState({}, '', '/auth/callback');

        // Petite pause pour s'assurer que le storage est prêt
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Redirige selon le type d'utilisateur
        if (isNewUser) {
          // Nouvel utilisateur -> création de store
          router.replace('/create-store');
        } else {
          // Utilisateur existant -> sélection de store ou dashboard
          router.replace('/select-store');
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        router.replace('/signin?error=callback_failed');
      }
    };

    processCallback();
  }, [router, searchParams]);

  return <LoadingScreen />;
}

/**
 * Page de callback pour OAuth (Google, etc.)
 *
 * Cette page reçoit les tokens via les paramètres URL après l'authentification OAuth
 * puis les stocke et redirige l'utilisateur vers la bonne page.
 */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
