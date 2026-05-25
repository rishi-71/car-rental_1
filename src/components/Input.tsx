import React, { forwardRef } from "react";

// Extend standard HTML input attributes so we get autocomplete, required, disabled, min, max, etc. for free
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    // Generate a unique ID if one isn't provided so the label connects properly to the input
    const inputId = id || React.useId();

    return (
      <div className="w-full flex flex-col">
        {/* Optional Label */}
        {label && (
          <label 
            htmlFor={inputId} 
            className="text-sm font-semibold text-slate-700 mb-2"
          >
            {label}
          </label>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full bg-white border rounded-xl px-5 py-3.5 outline-none transition-all duration-300
            placeholder:text-slate-400 text-slate-900
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" // Error state
                : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" // Normal state
            }
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {/* Optional Error Message */}
        {error && (
          <p className="text-sm text-red-500 mt-1.5 font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;