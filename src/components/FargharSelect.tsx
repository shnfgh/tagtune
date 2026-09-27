// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface FargharSelectOption {
  value: string;
  label: string;
}

interface FargharSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FargharSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  allowCustom?: boolean;
}

const FargharChevronDownIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FargharSearchIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FargharCheckIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FargharPlusIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const FargharSelect: React.FC<FargharSelectProps> = ({ value, onChange, options, placeholder = 'Select...', disabled = false, searchable = false, allowCustom = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = searchable && searchQuery
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  // Check if search query is a custom value (not in options)
  const isCustomValue = allowCustom && searchQuery && !options.some(opt => opt.value.toLowerCase() === searchQuery.toLowerCase());

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!isOpen) setSearchQuery('');
  }, [isOpen, searchable]);

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  }, [onChange]);

  const handleToggle = useCallback(() => {
    if (!disabled) setIsOpen(prev => !prev);
  }, [disabled]);

  const handleCustomAdd = useCallback(() => {
    if (searchQuery) {
      onChange(searchQuery);
      setIsOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, onChange]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl border
          transition-all duration-200 text-right
          ${disabled ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/10 text-gray-500' : 'bg-white/5 border-white/10 text-white hover:border-purple-400/50 cursor-pointer'}
          ${isOpen ? 'border-purple-500/50 shadow-[0_0_0_2px_rgba(168,85,247,0.3)]' : ''}
        `}
      >
        <span className={`truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`flex-shrink-0 mr-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <FargharChevronDownIcon />
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-gray-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden farghar-fade-in">
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-white/10">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                <span className="text-gray-400"><FargharSearchIcon /></span>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isCustomValue) {
                      e.preventDefault();
                      handleCustomAdd();
                    }
                  }}
                  placeholder="Search or type custom value..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {/* Clear option */}
            {value && (
              <button
                type="button"
                onClick={() => handleSelect('')}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-right"
              >
                <span>Clear selection</span>
              </button>
            )}

            {filteredOptions.length === 0 && !isCustomValue ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
            ) : (
              <>
                {filteredOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-right
                      ${option.value === value
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-gray-300 hover:bg-white/5'
                      }
                    `}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.value === value && (
                      <span className="flex-shrink-0 mr-2 text-purple-400"><FargharCheckIcon /></span>
                    )}
                  </button>
                ))}

                {/* Custom value option */}
                {isCustomValue && (
                  <button
                    type="button"
                    onClick={handleCustomAdd}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-green-400 hover:bg-green-500/10 transition-colors text-right border-t border-white/10 mt-1 pt-3"
                  >
                    <FargharPlusIcon />
                    <span>Add custom: "{searchQuery}"</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
