import React from 'react';

export function Student1Svg() {
  return (
    <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
      <rect x="18" y="6" width="12" height="7" rx="1.5" fill="#1e293b" />
      <circle cx="24" cy="18" r="7" fill="#fed7aa" />
      <path d="M15 25C15 25 18 24 24 24C30 24 33 25 33 25L35 48H13L15 25Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      <path d="M24 24V48" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="22,25 24,28 26,25" fill="#0d3b78" />
      <path d="M13 28C10 28 9 34 9 44C9 48 11 50 14 50" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 48H34L32 74H26L25 56L24 56L23 74H17L14 48Z" fill="#0d3b78" />
      <ellipse cx="19" cy="75" rx="4" ry="2.5" fill="#0f172a" />
      <ellipse cx="29" cy="75" rx="4" ry="2.5" fill="#0f172a" />
    </svg>
  );
}

export function Student2Svg() {
  return (
    <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
      <path d="M24 8C17 8 15 14 15 22C15 30 18 36 24 38C30 36 33 30 33 22C33 14 31 8 24 8Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
      <ellipse cx="24" cy="20" rx="5" ry="6" fill="#fed7aa" />
      <path d="M15 30L11 44C11 46 14 48 24 48C34 48 37 46 37 44L33 30C33 30 28 35 24 35C20 35 15 30 15 30Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
      <path d="M14 46H34L37 74C37 75 35 76 24 76C13 76 11 75 11 74L14 46Z" fill="#0d3b78" />
      <ellipse cx="19" cy="76" rx="3.5" ry="2" fill="#0f172a" />
      <ellipse cx="29" cy="76" rx="3.5" ry="2" fill="#0f172a" />
    </svg>
  );
}

export function Student3Svg() {
  return (
    <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
      <rect x="18" y="7" width="12" height="6.5" rx="1.5" fill="#0f172a" />
      <circle cx="24" cy="18" r="6.5" fill="#fde68a" />
      <path d="M15 25H33L35 48H13L15 25Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      <rect x="25" y="30" width="10" height="13" rx="1" fill="#f59e0b" transform="rotate(8 25 30)" />
      <rect x="27" y="32" width="7" height="9" rx="0.5" fill="#fef3c7" transform="rotate(8 25 30)" />
      <path d="M15 48H33L31 74H26L25 57L24 57L23 74H17L15 48Z" fill="#0d3b78" />
      <ellipse cx="19" cy="75" rx="3.5" ry="2.2" fill="#1e293b" />
      <ellipse cx="28" cy="75" rx="3.5" ry="2.2" fill="#1e293b" />
    </svg>
  );
}

export function Student4Svg() {
  return (
    <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
      <path d="M24 9C18 9 16 15 16 22C16 29 19 35 24 37C29 35 32 29 32 22C32 15 30 9 24 9Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
      <ellipse cx="24" cy="20" rx="4.5" ry="5.5" fill="#fed7aa" />
      <path d="M16 28L12 43C12 45 15 47 24 47C33 47 36 45 36 43L32 28C32 28 28 34 24 34C20 34 16 28 16 28Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
      <rect x="8" y="27" width="6" height="14" rx="2" fill="#ea580c" />
      <path d="M14 46H34L36 74C36 75 34 76 24 76C14 76 12 75 12 74L14 46Z" fill="#0d3b78" />
      <ellipse cx="19" cy="76" rx="3" ry="1.8" fill="#0f172a" />
      <ellipse cx="29" cy="76" rx="3" ry="1.8" fill="#0f172a" />
    </svg>
  );
}

interface WalkingStudentsProps {
  className?: string;
  variant?: 'full' | 'banner';
}

export function WalkingStudents({ className = '', variant = 'full' }: WalkingStudentsProps) {
  if (variant === 'banner') {
    return (
      <div className={`relative w-full h-16 overflow-hidden pointer-events-none select-none ${className}`}>
        <div className="absolute inset-x-0 bottom-3 h-[1px] bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />
        <div className="scene-banner relative w-full h-full">
          <div className="student s1 scale-75 !bottom-2"><Student1Svg /></div>
          <div className="student s2 scale-75 !bottom-2.5"><Student2Svg /></div>
          <div className="student s3 scale-75 !bottom-2"><Student3Svg /></div>
          <div className="student s4 scale-75 !bottom-3"><Student4Svg /></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`scene pointer-events-none select-none ${className}`}>
      <div className="ground-line" />
      <div className="student s1" title="Siswa Madrasah Berjalan"><Student1Svg /></div>
      <div className="student s2" title="Siswi Madrasah Berjalan"><Student2Svg /></div>
      <div className="student s3" title="Siswa Membawa Kitab"><Student3Svg /></div>
      <div className="student s4" title="Siswi Membawa Ransel"><Student4Svg /></div>
    </div>
  );
}
