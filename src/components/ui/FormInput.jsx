import React from 'react'

export default function FormInput({ label, id, type = 'text', value, onChange, placeholder, error, required = false, className = '', ...rest }){
  const errorId = id ? `${id}-error` : undefined
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        required={required}
        className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
          placeholder-gray-400 dark:placeholder-gray-500
          focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all
          disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}`}
        {...rest}
      />
      {error && <p id={errorId} className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
