import React from 'react';
import { createPortal } from 'react-dom';
import { useLoading } from '../store/useLoading';
import GemSpinner from './GemSpinner';

const LoadingOverlay = () => {
  const { isLoading, loadingMessage, loadingVariant } = useLoading();

  if (!isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <GemSpinner 
        message={loadingMessage}
        size="large"
        variant={loadingVariant}
      />
    </div>,
    document.body
  );
};

export default LoadingOverlay; 