import React from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-dm-dark bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-dm-dark-2 p-8 rounded-lg shadow-lg relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-dm-accent hover:text-dm-secondary transition-all duration-200"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};
