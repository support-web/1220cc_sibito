'use client';

import { useEffect, useState } from 'react';

interface ScoreMeterProps {
  score: number;
}

export default function ScoreMeter({ score }: ScoreMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#FFD700';
    if (s >= 60) return '#4CAF50';
    if (s >= 40) return '#2196F3';
    if (s >= 20) return '#FF9800';
    return '#F44336';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return '大吉';
    if (s >= 60) return '吉';
    if (s >= 40) return '平';
    if (s >= 20) return '小凶';
    return '凶';
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(animatedScore);

  return (
    <div className="relative flex flex-col items-center">
      <div className="score-meter">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* 背景円 */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(139, 92, 246, 0.2)"
            strokeWidth="12"
          />
          {/* スコア円 */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="score-circle transition-all duration-300"
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold" style={{ color }}>
            {animatedScore}
          </span>
          <span className="text-lg text-[#A0A0C0]">/ 100点</span>
        </div>
      </div>
      <div
        className="mt-4 text-2xl font-bold px-6 py-2 rounded-full"
        style={{
          color,
          backgroundColor: `${color}20`,
          border: `2px solid ${color}`,
          textShadow: `0 0 10px ${color}50`
        }}
      >
        {getScoreLabel(score)}
      </div>
    </div>
  );
}
