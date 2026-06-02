// src/components/TeamSelect.tsx
import React from 'react';
import { Team } from '../types';
import { teamFlag } from '../utils/flags';
import { useThemeContext } from '../hooks/ThemeContext';

interface Props {
  value: number | null;
  onChange: (teamId: number | null) => void;
  teams: Team[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const TeamSelect: React.FC<Props> = ({
  value,
  onChange,
  teams,
  placeholder = 'Wybierz drużynę...',
  disabled = false,
  className = '',
}) => {
  const { isLight } = useThemeContext();

  const selectedTeam = teams.find(t => t.id === value) ?? null;

  return (
    <div className={`relative ${className}`}>
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value ? parseInt(e.target.value) : null)}
        disabled={disabled}
        className={`w-full border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${
          isLight
            ? 'bg-gray-100 border-gray-300 text-gray-900'
            : 'bg-gray-700 border-gray-600 text-white'
        }`}
      >
        <option value="">{placeholder}</option>
        {teams.map(t => (
          <option key={t.id} value={t.id}>
            {teamFlag(t.name)} {t.name}
          </option>
        ))}
      </select>
      {/* Flaga wybranej drużyny jako overlay po lewej */}
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base leading-none">
        {selectedTeam ? teamFlag(selectedTeam.name) : '🏳️'}
      </span>
    </div>
  );
};
