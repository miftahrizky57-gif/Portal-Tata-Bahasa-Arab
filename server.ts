import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import { studentScores } from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      dbConnected: Boolean(db),
      timestamp: new Date().toISOString()
    });
  });

  // GET /api/scores - Get all student evaluation scores from Cloud SQL
  app.get('/api/scores', async (req, res) => {
    try {
      if (!db) {
        return res.json({ success: true, source: 'fallback', data: [] });
      }

      const scores = await db
        .select()
        .from(studentScores)
        .orderBy(desc(studentScores.createdAt));

      res.json({
        success: true,
        source: 'cloudsql',
        data: scores.map(s => ({
          id: s.id,
          name: s.name,
          gender: s.gender as 'Laki-laki' | 'Perempuan',
          role: s.role || 'Siswa',
          class: s.class || 'Kelas 7A',
          score: s.score,
          date: s.date,
          status: s.status as 'Lulus' | 'Remedial',
          narrativeScore: s.narrativeScore || ''
        }))
      });
    } catch (error: any) {
      console.error('Error fetching scores from Cloud SQL:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve scores from database',
        details: error.message
      });
    }
  });

  // POST /api/scores - Save or update a student evaluation score in Cloud SQL
  app.post('/api/scores', async (req, res) => {
    try {
      const { id, name, gender, role, class: studentClass, score, date, status, narrativeScore, userRole: bodyUserRole } = req.body;
      const callerRole = (req.headers['x-user-role'] as string) || bodyUserRole || 'siswa';

      if (!name || score === undefined) {
        return res.status(400).json({ error: 'Name and score are required fields' });
      }

      const numScore = Number(score) || 0;
      const statusVal = status || (numScore >= 75 ? 'Lulus' : 'Remedial');
      const dateVal = date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

      // If updating an existing score, verify that caller is Admin
      if (id && db) {
        const existingList = await db.select().from(studentScores).where(eq(studentScores.id, id));
        if (existingList.length > 0) {
          // Existing record found - only admin is authorized to edit/change grades
          if (callerRole.toLowerCase() !== 'admin') {
            return res.status(403).json({
              success: false,
              error: 'Akses Ditolak: Hanya Administrator yang berwenang mengubah atau mengganti nilai murid.',
              requiresAdmin: true
            });
          }
        }
      }

      const docId = id || `score_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      if (!db) {
        return res.json({
          success: true,
          source: 'local_fallback',
          data: { id: docId, name, gender, role, class: studentClass, score: numScore, date: dateVal, status: statusVal, narrativeScore }
        });
      }

      // Upsert using Drizzle ORM
      await db
        .insert(studentScores)
        .values({
          id: docId,
          name: name.trim(),
          gender: gender || 'Laki-laki',
          role: role || 'Siswa',
          class: studentClass || 'Kelas 7A',
          score: numScore,
          date: dateVal,
          status: statusVal,
          narrativeScore: narrativeScore || '',
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: studentScores.id,
          set: {
            name: name.trim(),
            gender: gender || 'Laki-laki',
            role: role || 'Siswa',
            class: studentClass || 'Kelas 7A',
            score: numScore,
            date: dateVal,
            status: statusVal,
            narrativeScore: narrativeScore || '',
            updatedAt: new Date()
          }
        });

      res.json({
        success: true,
        source: 'cloudsql',
        data: {
          id: docId,
          name: name.trim(),
          gender,
          role,
          class: studentClass,
          score: numScore,
          date: dateVal,
          status: statusVal,
          narrativeScore
        }
      });
    } catch (error: any) {
      console.error('Error saving score to Cloud SQL:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save score to database',
        details: error.message
      });
    }
  });

  // DELETE /api/scores/:id - Delete a student evaluation score from Cloud SQL (Admin Only)
  app.delete('/api/scores/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const callerRole = (req.headers['x-user-role'] as string) || (req.query.userRole as string) || 'siswa';

      if (callerRole.toLowerCase() !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Akses Ditolak: Hanya Administrator yang berwenang menghapus data nilai murid.',
          requiresAdmin: true
        });
      }

      if (!id) {
        return res.status(400).json({ error: 'Score ID is required' });
      }

      if (db) {
        await db
          .delete(studentScores)
          .where(eq(studentScores.id, id));
      }

      res.json({ success: true, message: 'Score deleted successfully', id });
    } catch (error: any) {
      console.error('Error deleting score from Cloud SQL:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete score from database',
        details: error.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
