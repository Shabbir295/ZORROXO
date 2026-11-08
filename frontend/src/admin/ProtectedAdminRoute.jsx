import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      // Database se check karo ke user admin hai ya nahi
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      setIsAdmin(data?.is_admin || false);
    }
    checkAdmin();
  }, [user]);

  // Jab tak check ho raha hai, loader dikhao
  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="w-10 h-10 animate-spin text-bronze" />
      </div>
    );
  }

  // Agar admin nahi hai, toh home page par bhej do
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Agar admin hai, toh andar aane do
  return children;
}