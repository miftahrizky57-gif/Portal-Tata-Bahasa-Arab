import { createClient } from '@supabase/supabase-js';
import { StudentScore } from '../types.ts';

const rawUrl = typeof import.meta !== 'undefined' && import.meta?.env ? import.meta.env.VITE_SUPABASE_URL : undefined;
const rawKey = typeof import.meta !== 'undefined' && import.meta?.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined;

const isConfigured = Boolean(rawUrl && rawUrl.startsWith('http') && rawKey);

const SUPABASE_URL = isConfigured ? rawUrl : 'https://placeholder-project.supabase.co';
const SUPABASE_ANON_KEY = isConfigured ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Fetch all student scores from Supabase
export async function getSupabaseScores(): Promise<StudentScore[]> {
  if (!isConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('student_scores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase select student_scores error (will fallback):', error.message);
      // Try alternate table name 'scores'
      const { data: altData, error: altError } = await supabase
        .from('scores')
        .select('*')
        .order('created_at', { ascending: false });

      if (altError) {
        console.warn('Supabase select scores error:', altError.message);
        return [];
      }
      return (altData || []).map((s: any) => ({
        id: s.id,
        name: s.name || '',
        gender: s.gender || 'Laki-laki',
        role: s.role || 'Siswa',
        class: s.class || 'Kelas 7A',
        score: Number(s.score) || 0,
        date: s.date || '',
        status: s.status || (Number(s.score) >= 75 ? 'Lulus' : 'Remedial'),
        narrativeScore: s.narrative_score || s.narrativeScore || ''
      }));
    }

    return (data || []).map((s: any) => ({
      id: s.id,
      name: s.name || '',
      gender: s.gender || 'Laki-laki',
      role: s.role || 'Siswa',
      class: s.class || 'Kelas 7A',
      score: Number(s.score) || 0,
      date: s.date || '',
      status: s.status || (Number(s.score) >= 75 ? 'Lulus' : 'Remedial'),
      narrativeScore: s.narrative_score || s.narrativeScore || ''
    }));
  } catch (err) {
    console.warn('Failed to fetch scores from Supabase:', err);
    return [];
  }
}

// Save or Upsert student score to Supabase
export async function saveSupabaseScore(score: StudentScore): Promise<boolean> {
  if (!isConfigured) return false;
  try {
    const payload = {
      id: score.id || `score_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: score.name.trim(),
      gender: score.gender || 'Laki-laki',
      role: score.role || 'Siswa',
      class: score.class || 'Kelas 7A',
      score: Number(score.score) || 0,
      date: score.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: score.status || (Number(score.score) >= 75 ? 'Lulus' : 'Remedial'),
      narrative_score: score.narrativeScore || '',
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('student_scores')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert student_scores failed:', error.message);
      // Attempt upsert to 'scores' table as fallback
      const { error: altErr } = await supabase
        .from('scores')
        .upsert(payload, { onConflict: 'id' });
      
      if (altErr) {
        console.warn('Supabase fallback upsert scores failed:', altErr.message);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn('Error saving score to Supabase:', err);
    return false;
  }
}

// Delete student score from Supabase
export async function deleteSupabaseScore(id: string): Promise<boolean> {
  if (!id || !isConfigured) return false;
  try {
    const { error } = await supabase
      .from('student_scores')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase delete student_scores error:', error.message);
      await supabase.from('scores').delete().eq('id', id);
    }
    return true;
  } catch (err) {
    console.warn('Error deleting score from Supabase:', err);
    return false;
  }
}
