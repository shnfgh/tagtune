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

const FargharCheckIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const FargharSelect: React.FC<FargharSelectProps> = ({ value, onChange, options, placeholder = 'Select...', disabled = false, searchable = false, allowCustom = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [localOptions, setLocalOptions] = useState<FargharSelectOption[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync value with inputValue
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Update localOptions when options prop changes
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  // Filtered options based on input
  const filteredOptions = inputValue
    ? localOptions.filter(opt => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
    : localOptions;

  // Check if current input is a custom value
  const isCustomValue = allowCustom && inputValue && inputValue.trim() && !localOptions.some(opt => opt.value.toLowerCase() === inputValue.toLowerCase());

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // If there's a custom value and allowCustom is true, save it
        if (isCustomValue && allowCustom) {
          onChange(inputValue);
          if (!localOptions.some(opt => opt.value === inputValue)) {
            setLocalOptions(prev => [...prev, { value: inputValue, label: inputValue }]);
          }
        } else {
          // Reset to current value
          setInputValue(value);
        }
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue, value, isCustomValue, allowCustom, onChange, localOptions]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, []);

  const handleSelect = useCallback((optionValue: string) => {
    setInputValue(optionValue);
    onChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [onChange]);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => {
          const maxIndex = filteredOptions.length + (isCustomValue ? 1 : 0) - 1;
          return prev < maxIndex ? prev + 1 : 0;
        });
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => {
          const maxIndex = filteredOptions.length + (isCustomValue ? 1 : 0) - 1;
          return prev > 0 ? prev - 1 : maxIndex;
        });
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (highlightedIndex < filteredOptions.length) {
            // Select from filtered options
            handleSelect(filteredOptions[highlightedIndex].value);
          } else if (isCustomValue && allowCustom) {
            // Add custom value
            onChange(inputValue);
            if (!localOptions.some(opt => opt.value === inputValue)) {
              setLocalOptions(prev => [...prev, { value: inputValue, label: inputValue }]);
            }
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
        } else if (isCustomValue && allowCustom) {
          // Add custom value directly
          onChange(inputValue);
          if (!localOptions.some(opt => opt.value === inputValue)) {
            setLocalOptions(prev => [...prev, { value: inputValue, label: inputValue }]);
          }
          setIsOpen(false);
          setHighlightedIndex(-1);
        } else if (filteredOptions.length > 0) {
          // Select first option
          handleSelect(filteredOptions[0].value);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setInputValue(value);
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isOpen, filteredOptions, highlightedIndex, isCustomValue, allowCustom, inputValue, value, onChange, localOptions, handleSelect]);

  return (
    <div ref={containerRef} className="relative">
      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 text-sm rounded-xl border transition-all duration-200 text-right
            ${disabled ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/10 text-gray-500' : 'bg-white/5 border-white/10 text-white hover:border-purple-400/50'}
            ${isOpen ? 'border-purple-500/50 shadow-[0_0_0_2px_rgba(168,85,247,0.3)]' : ''}
          `}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FargharChevronDownIcon />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-2 w-full rounded-xl shadow-2xl overflow-hidden farghar-fade-in"
          style={{ backgroundColor: 'var(--farghar-bg-secondary)', border: '1px solid var(--farghar-glass-border)' }}
        >
          <div className="max-h-60 overflow-y-auto py-1">
            {/* Clear option */}
            {value && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect('');
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-right ${highlightedIndex === -2 ? 'bg-red-500/10' : ''}`}
              >
                <span>Clear selection</span>
              </button>
            )}

            {filteredOptions.length === 0 && !isCustomValue ? (
              <div className="px-4 py-3 text-sm text-center" style={{ color: 'var(--farghar-text-muted)' }}>No results found</div>
            ) : (
              <>
                {filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(option.value);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-right"
                    style={option.value === value ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe' } : { color: highlightedIndex === index ? 'var(--farghar-text)' : 'var(--farghar-text-secondary)' }}
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
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange(inputValue);
                      if (!localOptions.some(opt => opt.value === inputValue)) {
                        setLocalOptions(prev => [...prev, { value: inputValue, label: inputValue }]);
                      }
                      setIsOpen(false);
                      setHighlightedIndex(-1);
                    }}
                    className={`
                      w-full flex items-center gap-2 px-4 py-2.5 text-sm text-green-400 hover:bg-green-500/10 transition-colors text-right border-t border-white/10 mt-1
                      ${highlightedIndex === filteredOptions.length ? 'bg-green-500/10' : ''}
                    `}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add "{inputValue}" as custom value</span>
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
