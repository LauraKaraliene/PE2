export default function Modal({ isOpen, onClose, children, size = "auto" }) {
  if (!isOpen) return null;

  const modalClasses =
    size === "calendar" ? "min-h-[450px] max-h-[90vh]" : "max-h-[90vh]";

  return (
    <div className="fixed inset-0 backdrop-blur-xl flex justify-center items-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg max-w-lg w-full relative mx-4 flex flex-col ${modalClasses}`}
      >
        <button
          className="absolute top-2 right-5 text-xl font-bold text-black hover:scale-130 transition-transform duration-200 z-10"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
