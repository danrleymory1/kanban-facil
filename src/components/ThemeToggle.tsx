'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { MdContrast } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Claro', icon: FiSun },
    { value: 'dark', label: 'Escuro', icon: FiMoon },
    { value: 'high-contrast-light', label: 'Alto Contraste Claro', icon: MdContrast },
    { value: 'high-contrast-dark', label: 'Alto Contraste Escuro', icon: AiOutlineEye },
  ] as const;

  return (
    <div className="relative group">
      <button
        className="p-2 rounded-lg bg-surface-secondary hover:bg-surface-tertiary transition-colors"
        title="Mudar tema"
      >
        {theme === 'light' && <FiSun className="text-xl text-content-primary" />}
        {theme === 'dark' && <FiMoon className="text-xl text-content-primary" />}
        {theme === 'high-contrast-light' && <MdContrast className="text-xl text-content-primary" />}
        {theme === 'high-contrast-dark' && <AiOutlineEye className="text-xl text-content-primary" />}
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-64 bg-surface-primary border border-border-primary rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-2 space-y-1">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                theme === value
                  ? 'bg-primary text-white'
                  : 'hover:bg-surface-secondary text-content-primary'
              }`}
            >
              <Icon className="text-lg" />
              <span className="text-sm font-medium">{label}</span>
              {theme === value && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
