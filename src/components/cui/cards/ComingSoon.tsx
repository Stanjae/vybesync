"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from '../../../../public/veslogo1.png'

export default function ComingSoon() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#25F4EE] rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#FE2C55] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* TikTok Icon */}
        <div
          className={`mb-8 transition-all duration-1000 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          <Image src={Logo} className=" mx-auto block" width={100} height={100} alt="TikTok Icon" />
        </div>

        {/* Main heading */}
        <div
          className={`transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#25F4EE] via-[#FE2C55] to-[#FE2C55] bg-clip-text text-transparent mb-6">
            Coming Soon
          </h1>
        </div>

        {/* Description */}
        <div
          className={`transition-all duration-1000 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-gray-300 text-xl md:text-2xl mb-4 max-w-2xl mx-auto">
            Something amazing is on the way
          </p>
          <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">
            We &apos; re working hard to bring you an incredible experience.
            Stay tuned for updates!
          </p>
        </div>

        {/* Email signup */}
        <div
          className={`transition-all duration-1000 delay-600 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="max-w-md mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-gray-900 border border-gray-800 text-white rounded-lg focus:outline-none focus:border-[#25F4EE] transition-colors"
              />
              <button className="px-8 py-4 bg-[#FE2C55] text-white font-semibold rounded-lg hover:bg-[#ff1744] transition-all duration-200 hover:scale-105">
                Notify Me
              </button>
            </div>
          </div>
        </div>

        {/* Social links */}
        <div
          className={`transition-all duration-1000 delay-800 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-gray-500 text-sm mb-4">Follow us for updates</p>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors group"
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-[#25F4EE] transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors group"
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-[#25F4EE] transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors group"
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-[#25F4EE] transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Loading dots */}
        <div className="mt-16 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
