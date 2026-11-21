import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocFromServer
} from 'firebase/firestore';
import config from '../../firebase-applet-config.json';
import { StudentScore } from '../types';
import { MOCK_STUDENT_SCORES } from '../data/materiData';
import { saveSupabaseScore, deleteSupabaseScore, getSupabaseScores } from './supabase';

const app = initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
});

export const db = config.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Validate Connection to Firestore (Critical Constraint)
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Sync function for student progress (completed materi indices and exercise answers)
export interface StudentProgress {
  name: string;
  peran: string;
  kelas: string;
  gender: string;
  completedMateriIndices: number[];
  latihanAnswers: Record<string, number>; // questionId -> chosen answer index
  materiStepProgress?: Record<number, string>; // virtual index -> unlocked step ('ice_breaking' | 'contoh' | 'kaidah' | 'latihan')
  darsuTsaniEssayAnswers?: Record<string, string>;
  showDarsuTsaniEssayResult?: boolean;
  tahiyyahEssayAnswers?: Record<string, string>;
  showTahiyyahEssayResult?: boolean;
  personalDhamirEssayAnswers?: Record<string, string>;
  showPersonalDhamirEssayResult?: boolean;
  mubtadaEssayAnswers?: Record<string, { mubtada: string; khabar: string }>;
  showMubtadaEssayResult?: boolean;
  updatedAt: string;
}

// In-Memory Fallback Storage for Private Browsing / QuotaExceededError / Disabled localStorage
const memoryStorage: Record<string, string> = {};

export function safeGetItem(key: string): string | null {
  try {
    const value = localStorage.getItem(key);
    if (value !== null) return value;
  } catch (e) {
    console.warn(`localStorage read disabled/error for key "${key}":`, e);
  }
  return memoryStorage[key] ?? null;
}

export function safeSetItem(key: string, value: string): boolean {
  memoryStorage[key] = value;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`localStorage setItem failed for key "${key}" (QuotaExceededError/DOMException), stored in memory fallback:`, e);
    return false;
  }
}

// Offline Mode Helpers
export function isOfflineMode(): boolean {
  return safeGetItem('isOfflineMode') === 'true';
}

export function setOfflineMode(value: boolean) {
  safeSetItem('isOfflineMode', value ? 'true' : 'false');
  window.dispatchEvent(new Event('offline-mode-change'));
}

// Error diagnostic helper as specified in firebase-integration SKILL.md
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null, // Since we aren't using Firebase Auth (just custom session based on student names)
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

// Save student progress to Firestore with automatic offline caching fallback
export async function saveStudentProgress(studentName: string, progress: Partial<StudentProgress>) {
  if (!studentName) return;

  const keyName = studentName.trim().toLowerCase();
  let mergedProgress: StudentProgress;

  // Cache to localStorage/memory first and build full schema-compliant object
  try {
    const saved = safeGetItem(`student_progress_${keyName}`);
    const existing = saved ? JSON.parse(saved) : {};
    mergedProgress = {
      name: studentName,
      peran: progress.peran || existing.peran || 'siswa',
      kelas: progress.kelas || existing.kelas || '',
      gender: progress.gender || existing.gender || 'laki-laki',
      completedMateriIndices: progress.completedMateriIndices || existing.completedMateriIndices || [],
      latihanAnswers: { ...(existing.latihanAnswers || {}), ...(progress.latihanAnswers || {}) },
      materiStepProgress: { ...(existing.materiStepProgress || {}), ...(progress.materiStepProgress || {}) },
      darsuTsaniEssayAnswers: progress.darsuTsaniEssayAnswers !== undefined ? progress.darsuTsaniEssayAnswers : (existing.darsuTsaniEssayAnswers || {}),
      showDarsuTsaniEssayResult: progress.showDarsuTsaniEssayResult !== undefined ? progress.showDarsuTsaniEssayResult : (existing.showDarsuTsaniEssayResult || false),
      tahiyyahEssayAnswers: progress.tahiyyahEssayAnswers !== undefined ? progress.tahiyyahEssayAnswers : (existing.tahiyyahEssayAnswers || {}),
      showTahiyyahEssayResult: progress.showTahiyyahEssayResult !== undefined ? progress.showTahiyyahEssayResult : (existing.showTahiyyahEssayResult || false),
      personalDhamirEssayAnswers: progress.personalDhamirEssayAnswers !== undefined ? progress.personalDhamirEssayAnswers : (existing.personalDhamirEssayAnswers || {}),
      showPersonalDhamirEssayResult: progress.showPersonalDhamirEssayResult !== undefined ? progress.showPersonalDhamirEssayResult : (existing.showPersonalDhamirEssayResult || false),
      mubtadaEssayAnswers: progress.mubtadaEssayAnswers !== undefined ? progress.mubtadaEssayAnswers : (existing.mubtadaEssayAnswers || {}),
      showMubtadaEssayResult: progress.showMubtadaEssayResult !== undefined ? progress.showMubtadaEssayResult : (existing.showMubtadaEssayResult || false),
      updatedAt: new Date().toISOString()
    };
    
    safeSetItem(`student_progress_${keyName}`, JSON.stringify(mergedProgress));
    
    if (mergedProgress.completedMateriIndices) {
      safeSetItem(`completed_materi_${studentName}`, JSON.stringify(mergedProgress.completedMateriIndices));
    }
    if (mergedProgress.materiStepProgress) {
      safeSetItem(`materi_step_progress_${studentName}`, JSON.stringify(mergedProgress.materiStepProgress));
    }
  } catch (e) {
    console.error("Local storage progress cache error:", e);
    return;
  }

  if (isOfflineMode()) {
    console.log("Offline Mode Active: Progress cached locally.");
    return;
  }

  const path = `students/${keyName}`;
  const docRef = doc(db, 'students', keyName);
  try {
    // Save full document to avoid missing fields on create or merge schemas
    await setDoc(docRef, mergedProgress);
  } catch (error) {
    console.warn("Firestore save failed, progress remains cached locally:", error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Get student progress from Firestore with local cache fallback
export async function getStudentProgress(studentName: string): Promise<StudentProgress | null> {
  if (!studentName) return null;
  
  const keyName = studentName.trim().toLowerCase();
  let localProgress: StudentProgress | null = null;
  try {
    const saved = safeGetItem(`student_progress_${keyName}`);
    if (saved) {
      localProgress = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading local progress cache:", e);
  }

  if (isOfflineMode()) {
    return localProgress;
  }

  const path = `students/${keyName}`;
  const docRef = doc(db, 'students', keyName);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as StudentProgress;
    }
  } catch (error) {
    console.warn("Firestore get progress failed, using local cache:", error);
    handleFirestoreError(error, OperationType.GET, path);
  }
  return localProgress;
}

// Real-time listener for student progress synchronization with local backup triggering
export function listenToStudentProgress(studentName: string, callback: (progress: StudentProgress | null) => void) {
  if (!studentName) return () => {};
  
  const keyName = studentName.trim().toLowerCase();
  
  // Emit local cache immediately
  try {
    const saved = safeGetItem(`student_progress_${keyName}`);
    if (saved) {
      callback(JSON.parse(saved));
    }
  } catch (e) {
    console.error("Error reading local progress on listen:", e);
  }

  if (isOfflineMode()) {
    return () => {};
  }

  const path = `students/${keyName}`;
  const docRef = doc(db, 'students', keyName);
  try {
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as StudentProgress);
      }
    }, (error) => {
      console.warn("Firestore student progress subscription offline fallback:", error);
      handleFirestoreError(error, OperationType.GET, path);
    });
  } catch (e) {
    console.warn("Firestore listener setup failed, running offline:", e);
    return () => {};
  }
}

// Save a student score to the real-time leaderboard
export async function saveStudentScore(score: StudentScore) {
  if (!score.name) return;

  const docId = score.id || `${score.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().getTime()}`;
  const timestampStr = new Date().toISOString();
  
  const scoreRecord: StudentScore = {
    ...score,
    id: docId,
    gender: score.gender || 'Laki-laki',
    date: score.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  // Save to local score history
  try {
    const savedScores = safeGetItem('local_student_scores');
    let scoresList: StudentScore[] = savedScores ? JSON.parse(savedScores) : [];
    
    // Check if updating existing
    const existingIdx = scoresList.findIndex(s => 
      s.id === docId || 
      (s.name.trim().toLowerCase() === score.name.trim().toLowerCase() && 
       (s.class || '').trim().toLowerCase() === (score.class || '').trim().toLowerCase())
    );
    if (existingIdx >= 0) {
      scoresList[existingIdx] = { ...scoreRecord, id: scoresList[existingIdx].id || docId };
    } else {
      scoresList.unshift(scoreRecord);
    }
    
    scoresList = scoresList.slice(0, 100); // Limit to 100
    safeSetItem('local_student_scores', JSON.stringify(scoresList));
    // Dispatch local change event
    window.dispatchEvent(new Event('local-scores-change'));
  } catch (e) {
    console.error("Error saving local score:", e);
  }

  // Sync to Cloud SQL Database API
  try {
    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreRecord)
    }).catch(err => console.warn('Cloud SQL API save score fetch failed:', err));
  } catch (err) {
    console.warn('Cloud SQL API save score request error:', err);
  }

  // Sync to Supabase Database (Bagian Nilai)
  try {
    saveSupabaseScore(scoreRecord).catch(err => console.warn('Supabase save score failed:', err));
  } catch (err) {
    console.warn('Supabase save score exception:', err);
  }

  if (isOfflineMode()) {
    console.log("Offline Mode Active: Score saved locally.");
    return;
  }

  const path = `scores/${docId}`;
  const docRef = doc(db, 'scores', docId);
  try {
    await setDoc(docRef, {
      id: docId,
      name: scoreRecord.name,
      gender: scoreRecord.gender,
      role: scoreRecord.role,
      class: scoreRecord.class,
      score: scoreRecord.score,
      date: scoreRecord.date,
      status: scoreRecord.status,
      narrativeScore: scoreRecord.narrativeScore || '',
      createdAt: timestampStr
    }, { merge: true });
  } catch (error) {
    console.warn("Firestore save score failed, score saved locally and in SQL API:", error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Update a student score (Authorized Admin operation)
export async function updateStudentScore(docId: string, updatedScore: Partial<StudentScore>, userRole: string = 'admin') {
  if (!docId && !updatedScore.name) return;

  const targetName = (updatedScore.name || '').trim().toLowerCase();

  try {
    const savedScores = safeGetItem('local_student_scores');
    let scoresList: StudentScore[] = savedScores ? JSON.parse(savedScores) : [];
    let matched = false;

    scoresList = scoresList.map(s => {
      const sName = (s.name || '').trim().toLowerCase();
      const isMatchById = docId && s.id && s.id === docId;
      const isMatchByName = targetName && sName === targetName;

      if (isMatchById || isMatchByName) {
        matched = true;
        return { ...s, ...updatedScore, id: docId || s.id };
      }
      return s;
    });

    if (!matched) {
      scoresList.unshift({
        id: docId,
        name: updatedScore.name || 'Siswa',
        gender: updatedScore.gender || 'Laki-laki',
        role: 'Siswa',
        class: updatedScore.class || 'Kelas 7A',
        score: updatedScore.score || 0,
        date: updatedScore.date || new Date().toLocaleDateString('id-ID'),
        status: (updatedScore.score || 0) >= 75 ? 'Lulus' : 'Remedial',
        narrativeScore: updatedScore.narrativeScore || ''
      });
    }

    safeSetItem('local_student_scores', JSON.stringify(scoresList));
    window.dispatchEvent(new Event('local-scores-change'));
  } catch (e) {
    console.error("Error updating local score:", e);
  }

  // Sync to Cloud SQL Database API with Role Header
  try {
    fetch('/api/scores', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-role': userRole
      },
      body: JSON.stringify({ id: docId, ...updatedScore, userRole })
    }).catch(err => console.warn('Cloud SQL API update score fetch failed:', err));
  } catch (err) {
    console.warn('Cloud SQL API update score request error:', err);
  }

  // Sync to Supabase Database (Bagian Nilai)
  try {
    const fullScore: StudentScore = {
      id: docId,
      name: updatedScore.name || 'Siswa',
      gender: updatedScore.gender || 'Laki-laki',
      role: 'Siswa',
      class: updatedScore.class || 'Kelas 7A',
      score: updatedScore.score || 0,
      date: updatedScore.date || new Date().toLocaleDateString('id-ID'),
      status: (updatedScore.score || 0) >= 75 ? 'Lulus' : 'Remedial',
      narrativeScore: updatedScore.narrativeScore || ''
    };
    saveSupabaseScore(fullScore).catch(err => console.warn('Supabase update score failed:', err));
  } catch (err) {
    console.warn('Supabase update score exception:', err);
  }

  if (isOfflineMode()) return;

  const path = `scores/${docId}`;
  const docRef = doc(db, 'scores', docId);
  try {
    await setDoc(docRef, { ...updatedScore, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn("Firestore update score failed:", error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete a student score (Authorized Admin operation)
export async function deleteStudentScore(docId?: string, studentName?: string, userRole: string = 'admin') {
  if (!docId && !studentName) return;

  const targetName = (studentName || '').trim().toLowerCase();
  const targetId = docId || '';

  try {
    const savedScores = safeGetItem('local_student_scores');
    let scoresList: StudentScore[] = savedScores ? JSON.parse(savedScores) : [];

    scoresList = scoresList.filter(s => {
      const sName = (s.name || '').trim().toLowerCase();
      if (targetId && s.id && (s.id === targetId || s.id === targetId.trim())) return false;
      if (!targetId && targetName && sName === targetName) return false;
      return true;
    });

    safeSetItem('local_student_scores', JSON.stringify(scoresList));
    window.dispatchEvent(new Event('local-scores-change'));
  } catch (e) {
    console.error("Error deleting local score:", e);
  }

  // Sync to Cloud SQL Database API with Admin Role Header
  if (targetId) {
    try {
      fetch(`/api/scores/${targetId}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': userRole
        }
      }).catch(err => console.warn('Cloud SQL API delete score fetch failed:', err));
    } catch (err) {
      console.warn('Cloud SQL API delete score request error:', err);
    }

    // Sync to Supabase Database (Bagian Nilai)
    try {
      deleteSupabaseScore(targetId).catch(err => console.warn('Supabase delete score failed:', err));
    } catch (err) {
      console.warn('Supabase delete score exception:', err);
    }
  }

  if (isOfflineMode()) return;

  if (targetId) {
    const path = `scores/${targetId}`;
    const docRef = doc(db, 'scores', targetId);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.warn("Firestore direct delete blocked by security rules, applying soft-delete flag:", error);
      try {
        await setDoc(docRef, { isDeleted: true, status: 'Terhapus', updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.warn("Firestore soft-delete update failed:", err);
      }
    }
  }
}

// Listen to all student scores in real-time
export function listenToAllScores(callback: (scores: StudentScore[]) => void) {
  const getLocalScores = (): StudentScore[] => {
    try {
      const savedScores = safeGetItem('local_student_scores');
      if (savedScores !== null) {
        return JSON.parse(savedScores);
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  // Deliver local immediately
  callback(getLocalScores());

  // Proactively fetch latest scores from Cloud SQL REST API on load
  try {
    fetch('/api/scores')
      .then(res => res.ok ? res.json() : null)
      .then((apiRes) => {
        if (apiRes && apiRes.success && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
          const current = getLocalScores();
          const map = new Map<string, StudentScore>();
          current.forEach(s => map.set(s.id, s));
          apiRes.data.forEach((s: StudentScore) => {
            if (!map.has(s.id)) {
              map.set(s.id, s);
            }
          });
          const merged = Array.from(map.values());
          safeSetItem('local_student_scores', JSON.stringify(merged));
          callback(merged);
        }
      })
      .catch(err => console.warn('Cloud SQL initial scores fetch notice:', err));
  } catch (e) {
    console.warn('Failed to dispatch Cloud SQL initial fetch:', e);
  }

  // Try fetching latest scores from Supabase on load
  getSupabaseScores().then((supaScores) => {
    if (supaScores && supaScores.length > 0) {
      const current = getLocalScores();
      const map = new Map<string, StudentScore>();
      current.forEach(s => map.set(s.id, s));
      supaScores.forEach(s => map.set(s.id, s));
      const merged = Array.from(map.values());
      safeSetItem('local_student_scores', JSON.stringify(merged));
      callback(merged);
    }
  }).catch(err => console.warn('Supabase initial scores fetch error:', err));

  const handleLocalChange = () => {
    callback(getLocalScores());
  };
  window.addEventListener('local-scores-change', handleLocalChange);

  if (isOfflineMode()) {
    return () => {
      window.removeEventListener('local-scores-change', handleLocalChange);
    };
  }

  const path = 'scores';
  const collRef = collection(db, 'scores');
  const q = query(collRef, orderBy('createdAt', 'desc'), limit(100));
  try {
    const unsub = onSnapshot(q, (snapshot) => {
      const scores: StudentScore[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as StudentScore & { isDeleted?: boolean };
        if (!data.isDeleted && (data.status as string) !== 'Terhapus') {
          scores.push({
            ...data,
            id: docSnap.id
          });
        }
      });
      safeSetItem('local_student_scores', JSON.stringify(scores));
      callback(scores);
    }, (error) => {
      console.warn("Firestore score listener failed, displaying offline scores:", error);
      callback(getLocalScores());
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => {
      unsub();
      window.removeEventListener('local-scores-change', handleLocalChange);
    };
  } catch (e) {
    console.warn("Firestore score listen failed to initialize:", e);
    return () => {
      window.removeEventListener('local-scores-change', handleLocalChange);
    };
  }
}

