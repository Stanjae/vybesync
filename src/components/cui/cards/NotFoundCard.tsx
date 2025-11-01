'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFoundCard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div
          className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
        >
          <h1 className="text-[120px] md:text-[180px] font-bold bg-gradient-to-r from-[#25F4EE] via-[#FE2C55] to-[#FE2C55] bg-clip-text text-transparent leading-none mb-4">
            404
          </h1>
        </div>

        {/* Message */}
        <div
          className={`transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
            This page is lost in the algorithm
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            We couldn&apos;t find what you &apos; re looking for. The video might have been
            removed or the link is broken.
          </p>
        </div>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Link
            href="/"
            className="px-8 py-4 bg-[#FE2C55] text-white font-semibold rounded-lg hover:bg-[#ff1744] transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-primary-custom text-white font-semibold rounded-lg hover:bg-primary-custom/80 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full bg-[#25F4EE] transition-all duration-1000 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
              style={{ transitionDelay: `${600 + i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
