import { pgTable, text, integer, timestamp, serial } from 'drizzle-orm/pg-core';

// Users table for Firebase Auth user mapping
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email'),
  name: text('name'),
  role: text('role').default('siswa'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Student Scores / Evaluations table for the Nilai / Evaluation section
export const studentScores = pgTable('student_scores', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  gender: text('gender').default('Laki-laki'),
  role: text('role').default('Siswa'),
  class: text('class').default('Kelas 7A'),
  score: integer('score').notNull(),
  date: text('date').notNull(),
  status: text('status').notNull(), // 'Lulus' | 'Remedial'
  narrativeScore: text('narrative_score'),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});
