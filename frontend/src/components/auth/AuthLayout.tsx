import React, { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  image?: string;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  image,
  isDark = false,
  onThemeToggle,
}) => {
  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="flex h-screen bg-white dark:bg-gray-900">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              RDN Banking
            </div>
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>
          </div>

          {/* Form Container */}
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>

            {children}

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                © 2024 RDN Banking Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        {image && (
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
            <div className="text-center text-white">
              <img
                src={image}
                alt="Auth illustration"
                className="max-w-sm mx-auto mb-8 opacity-90"
              />
              <h2 className="text-3xl font-bold mb-4">Welcome to RDN Banking</h2>
              <p className="text-blue-100 text-lg">
                Secure, modern banking at your fingertips
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
