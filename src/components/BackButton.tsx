'use client';

import { useRouter } from 'next/navigation';
import { AiOutlineArrowLeft } from 'react-icons/ai';

interface BackButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export default function BackButton({ label = 'Voltar', href, className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 text-[var(--content-secondary)] hover:text-[var(--primary)] transition ${className}`}
    >
      <AiOutlineArrowLeft className="text-xl" />
      <span>{label}</span>
    </button>
  );
}
