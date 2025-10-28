// src/context/ToastContext.jsx
import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};