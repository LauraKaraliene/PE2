/**
 * Modal component.
 *
 * - Displays a modal dialog with customizable content.
 * - Includes a close button and supports conditional rendering based on the `isOpen` prop.
 * - Provides a scrollable content area for larger content.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Determines whether the modal is visible.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {React.ReactNode} props.children - The content to display inside the modal.
 * @param {string} [props.size="auto"] - Determines the modal's size (e.g., "calendar" for larger modals).
 * @returns {JSX.Element|null} The rendered modal component, or `null` if `isOpen` is `false`.
 */

export default function Modal({ isOpen, onClose, children, size = "auto" }) {
  if (!isOpen) return null;

  const modalClasses =
    size === "calendar" ? "min-h-[450px] max-h-[90vh]" : "max-h-[90vh]";

  return (
    <div className="fixed inset-0 backdrop-blur-xl flex justify-center items-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg max-w-lg w-full relative flex flex-col ${modalClasses}`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-2 relative z-10">
          <button
            className="text-2xl font-bold text-black hover:scale-130 transition-transform duration-200"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 -mt-2">{children}</div>
      </div>
    </div>
  );
}
