import { serve } from '../../lib/cf.js';
export const onRequest = c => serve(c, 'admin');
