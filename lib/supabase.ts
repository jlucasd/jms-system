
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rmbitswrljeophdovwxo.supabase.co';
const supabaseKey = 'sb_publishable_E7bGzmdYGUZhPudiEea5Ng_wYE9dq2u';

export const supabase = createClient(supabaseUrl, supabaseKey);
