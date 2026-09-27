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
  const [localOptions, setLocalOptions] = useState<FargharSelectOption[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync value with inputValue
  useEffect(() => { setInputValue(value); }, [value]);

  // Update localOptions when options prop changes
  useEffect(() => { setLocalOptions(options); }, [options]);

  const [inputValue, setInputValue] = useState(value);

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
        if (isCustomValue && allowCustom) {
          onChange(inputValue);
          if (!localOptions.some(opt => opt.value === inputValue)) {
            setLocalOptions(prev => [...prev, { value: inputValue, label: inputValue }]);
          }
        } else {
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

  const handleFocus = useCallback(() => { setIsOpen(true); }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') { setIsOpen(true); e.preventDefault(); }
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
            handleSelect(filteredOptions[highlightedIndex].value);
          } else if (isCustomValue && allowCustom) {
            onChange(inputValue);
            if (!localOptions.some(opt => opt.value === inputValue)) {
              setLocalOptions(prev => [...prev, { value: inputValue, label: inputValue }]);
            }
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
        } else if (isCustomValue && allowCustom) {
          onChange(inputValue);
          if (!localOptions.some(opt => opt.value === inputValue)) {
            setLocalOptions(prev => [...prev, { value: inputValue, label: inputValue }]);
          }
          setIsOpen(false);
          setHighlightedIndex(-1);
        } else if (filteredOptions.length > 0) {
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
          className={`farghar-input pr-10 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--farghar-text-muted)' }}>
          <FargharChevronDownIcon />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="farghar-menu-panel absolute z-50 mt-2 w-full farghar-fade-in">
          <div className="max-h-60 overflow-y-auto py-1">
            {/* Clear option */}
            {value && (
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleSelect(''); }}
                className="farghar-menu-item w-full flex items-center justify-between px-4 py-2.5 text-sm text-right"
                style={{ color: '#f87171' }}
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
                    onMouseDown={(e) => { e.preventDefault(); handleSelect(option.value); }}
                    className="farghar-menu-item w-full flex items-center justify-between px-4 py-2.5 text-sm text-right"
                    style={option.value === value ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe' } : { color: highlightedIndex === index ? 'var(--farghar-text)' : 'var(--farghar-text-secondary)' }}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.value === value && (
                      <span className="flex-shrink-0 mr-2" style={{ color: '#c084fc' }}><FargharCheckIcon /></span>
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
                    className="farghar-menu-item w-full flex items-center gap-2 px-4 py-2.5 text-sm text-right mt-1"
                    style={{ color: '#86efac', borderTop: '1px solid var(--farghar-glass-border)', paddingTop: '0.75rem' }}
                  >
                    <FargharPlusIcon />
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
