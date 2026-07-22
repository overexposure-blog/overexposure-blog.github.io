import { createClient } 
from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


const SUPABASE_URL = 
"https://bzpahicignjpcxdxhvmv.supabase.co";


const SUPABASE_ANON_KEY =
"sb_publishable_89CMyvAFoIwh71LeUQbNEw_TQ9s1yfb";


export const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

