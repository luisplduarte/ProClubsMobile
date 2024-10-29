// components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuth();
  const router = useRouter();

  if (!user) {
    router.replace('/login');
    return null;
  }

  return <>{children}</>;
}
