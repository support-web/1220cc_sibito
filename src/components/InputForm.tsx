'use client';

import { useState } from 'react';
import { InputFormData, Gender, CalendarType } from '@/types';
import { SHI_CHEN_TIMES } from '@/lib/constants';

interface InputFormProps {
  onSubmit: (data: InputFormData) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState<InputFormData>({
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    gender: 'male',
    calendarType: 'solar',
    nickname: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit} className="fortune-card p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8 gradient-text">
        生年月日を入力してください
      </h2>

      {/* ニックネーム */}
      <div className="mb-6">
        <label className="block text-sm text-[#A0A0C0] mb-2">
          ニックネーム（任意・PDF出力用）
        </label>
        <input
          type="text"
          className="fortune-input w-full"
          placeholder="ニックネームを入力"
          maxLength={20}
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
        />
      </div>

      {/* 暦法選択 */}
      <div className="mb-6">
        <label className="block text-sm text-[#A0A0C0] mb-2">暦法</label>
        <div className="fortune-radio flex-wrap">
          <label>
            <input
              type="radio"
              name="calendarType"
              value="solar"
              checked={formData.calendarType === 'solar'}
              onChange={() => setFormData({ ...formData, calendarType: 'solar' })}
            />
            <span>新暦（グレゴリオ暦）</span>
          </label>
          <label>
            <input
              type="radio"
              name="calendarType"
              value="lunar"
              checked={formData.calendarType === 'lunar'}
              onChange={() => setFormData({ ...formData, calendarType: 'lunar' })}
            />
            <span>旧暦（農暦）</span>
          </label>
        </div>
      </div>

      {/* 生年月日 */}
      <div className="mb-6">
        <label className="block text-sm text-[#A0A0C0] mb-2">生年月日</label>
        <div className="grid grid-cols-3 gap-4">
          <select
            className="fortune-select"
            value={formData.birthYear}
            onChange={(e) => setFormData({ ...formData, birthYear: parseInt(e.target.value) })}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>
          <select
            className="fortune-select"
            value={formData.birthMonth}
            onChange={(e) => setFormData({ ...formData, birthMonth: parseInt(e.target.value) })}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}月
              </option>
            ))}
          </select>
          <select
            className="fortune-select"
            value={formData.birthDay}
            onChange={(e) => setFormData({ ...formData, birthDay: parseInt(e.target.value) })}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}日
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 出生時刻 */}
      <div className="mb-6">
        <label className="block text-sm text-[#A0A0C0] mb-2">出生時刻（時辰）</label>
        <select
          className="fortune-select w-full"
          value={formData.birthHour}
          onChange={(e) => setFormData({ ...formData, birthHour: parseInt(e.target.value) })}
        >
          <option value={-1}>不明</option>
          {Object.entries(SHI_CHEN_TIMES).map(([index, label]) => (
            <option key={index} value={parseInt(index) * 2 + 1}>
              {label}
            </option>
          ))}
        </select>
        <p className="text-xs text-[#A0A0C0] mt-2">
          ※ 不明の場合は午時（11:00〜12:59）で計算します
        </p>
      </div>

      {/* 性別 */}
      <div className="mb-8">
        <label className="block text-sm text-[#A0A0C0] mb-2">性別</label>
        <div className="fortune-radio">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={() => setFormData({ ...formData, gender: 'male' })}
            />
            <span>男性</span>
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={() => setFormData({ ...formData, gender: 'female' })}
            />
            <span>女性</span>
          </label>
        </div>
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        className="fortune-button w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="loading-spinner w-6 h-6"></span>
            鑑定中...
          </span>
        ) : (
          '無料で金運を鑑定する'
        )}
      </button>
    </form>
  );
}
