import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const BASE_URL = import.meta.env.VITE_API_URL;

export function useGroup(userId) {
  const [group, setGroup]       = useState(null);
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!userId) return setLoading(false);
    fetch(`${BASE_URL}/api/group/my?userId=${userId}`)
      .then(r => r.json())
      .then(({ group, members }) => {
        setGroup(group);
        setMembers(members);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  return { group, members, loading };
}
