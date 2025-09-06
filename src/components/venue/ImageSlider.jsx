/**
 * Image slider component.
 *
 * - Displays a set of images with navigation controls.
 * - Supports touch gestures for swiping between images.
 * - Includes navigation arrows and indicators for the current image.
 * - Falls back to a placeholder message if no images are provided.
 *
 * @param {object} props - Component props.
 * @param {Array} props.images - An array of image objects to display.
 * @param {string} props.images[].url - The URL of the image.
 * @param {string} [props.images[].alt] - The alt text for the image.
 * @returns {JSX.Element} The rendered image slider component.
 */

import { useState, useRef } from "react";

export default function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  /**
   * Navigates to the previous image.
   */
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  /**
   * Navigates to the next image.
   */
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  /**
   * Handles the start of a touch gesture.
   *
   * @param {TouchEvent} e - The touch event.
   */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  /**
   * Handles the movement during a touch gesture.
   *
   * @param {TouchEvent} e - The touch event.
   */
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  /**
   * Handles the end of a touch gesture and determines if a swipe occurred.
   */
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipe = 50;

    if (distance > minSwipe) nextSlide();
    else if (distance < -minSwipe) prevSlide();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video bg-[color:var(--color-background-gray)] flex items-center justify-center rounded">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-video overflow-hidden rounded shadow-xl"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={images[currentIndex].url}
        alt={images[currentIndex].alt || "Venue image"}
        className="w-full h-full object-cover transition duration-300"
      />

      {/* Left Arrow */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[color:var(--color-background)] p-2 rounded-full align-center flex justify-center items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-[color:var(--color-neutral)]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[color:var(--color-background)] p-2 rounded-full
              align-center flex justify-center items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-[color:var(--color-neutral)]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex
                    ? "bg-[color:var(--color-background)]"
                    : "bg-[color:var(--color-background-gray)] "
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
