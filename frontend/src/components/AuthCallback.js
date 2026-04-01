import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          navigate('/login', { replace: true });
          return;
        }

        // Check if user has any children to distinguish new vs returning
        const { data: children } = await supabase
          .from('students')
          .select('id')
          .limit(1);

        if (!children || children.length === 0) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }

        subscription.unsubscribe();
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

export default AuthCallback;
