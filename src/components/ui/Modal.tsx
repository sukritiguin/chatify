/* eslint-disable @typescript-eslint/no-explicit-any */
// Modal.js
const Modal = ({ isOpen, onClose, children }: {isOpen: any, onClose: any, children: any}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
