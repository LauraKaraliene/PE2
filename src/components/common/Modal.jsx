export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xl flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full relative mx-4 max-h-[100vh] min-h-[300px] flex flex-col">
        <button
          className="absolute top-2 right-5 text-xl font-bold text-black hover:scale-130 transition-transform duration-200 z-10"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex-1 flex flex-col p-6">{children}</div>
      </div>
    </div>
  );
}
