import { useEffect } from 'react';
import { useAuth } from '../store/useAuth';

export default function AuthProvider({ children }) {
  const init = useAuth((s) => s.init);

  useEffect(() => init(), [init]);   // runs once

  return children;
}
