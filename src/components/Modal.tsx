'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export type ModalMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'print';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerIcon?: React.ReactNode;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: ModalMaxWidth;
  hideCloseButton?: boolean;
  closeButtonAriaLabel?: string;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  contentPadding?: boolean;
  ariaLabel?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const MAX_WIDTH_MAP: Record<ModalMaxWidth, string> = {
  sm: 'max-w-sm',     // 384px
  md: 'max-w-md',     // 448px (padrão compacto: login, encaixe rápido)
  lg: 'max-w-lg',     // 512px (padrão agendamento / confirmação)
  xl: 'max-w-xl',     // 576px (guias visuais, formulários completos)
  '2xl': 'max-w-2xl', // 672px (detalhes ricos)
  print: 'max-w-4xl', // 896px (prontuário médico oficial timbrado)
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerIcon,
  headerExtra,
  children,
  footer,
  maxWidth = 'md',
  hideCloseButton = false,
  closeButtonAriaLabel = 'Fechar modal',
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  contentPadding = true,
  ariaLabel,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // 1. Scroll Locking: Bloqueia scroll do body e preserva estado anterior
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    // Calcular largura da barra de rolagem para evitar layout shift no desktop
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  // 2. Fechamento via tecla Escape (Esc)
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const widthClass = MAX_WIDTH_MAP[maxWidth] || 'max-w-md';

  return (
    <div
      className="unified-modal-backdrop"
      onClick={closeOnBackdropClick ? onClose : undefined}
      role="presentation"
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || (typeof title === 'string' ? title : 'Janela modal')}
        className={`unified-modal-card ${widthClass} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO DO MODAL (SE HOUVER TÍTULO OU BOTÃO DE FECHAR) */}
        {(title || !hideCloseButton || headerIcon || headerExtra) && (
          <div className={`unified-modal-header ${headerClassName}`}>
            <div className="unified-modal-header-content">
              {headerIcon && (
                <div className="unified-modal-header-icon" aria-hidden="true">
                  {headerIcon}
                </div>
              )}
              {(title || subtitle) && (
                <div className="unified-modal-title-group">
                  {title && <h2 className="unified-modal-title">{title}</h2>}
                  {subtitle && <p className="unified-modal-subtitle">{subtitle}</p>}
                </div>
              )}
              {headerExtra}
            </div>

            {!hideCloseButton && (
              <button
                ref={closeButtonRef}
                type="button"
                className="unified-modal-close-btn"
                onClick={onClose}
                aria-label={closeButtonAriaLabel}
                title="Fechar (Esc)"
              >
                <X size={20} strokeWidth={2.2} />
              </button>
            )}
          </div>
        )}

        {/* CORPO DO MODAL COM ROLAGEM SUAVE INDEPENDENTE */}
        <div
          className={`unified-modal-body ${
            contentPadding ? 'unified-modal-body-pad' : ''
          } ${bodyClassName}`}
        >
          {children}
        </div>

        {/* RODAPÉ DO MODAL (SE FORNECIDO, PERMANECE FIXADO COM SAFE AREA) */}
        {footer && (
          <div className={`unified-modal-footer ${footerClassName}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
