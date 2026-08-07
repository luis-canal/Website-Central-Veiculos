import Select, { components } from 'react-select';
import { ChevronDown } from 'lucide-react';

const customStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 46,
    height: 46,
    borderRadius: 12,
    border: `1px solid ${state.isFocused ? 'rgba(217, 43, 43, 0.75)' : 'rgba(0, 0, 0, 0.06)'}`,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: state.isFocused
      ? '0 0 0 4px rgba(217, 43, 43, 0.12), 0 8px 20px rgba(0, 0, 0, 0.08)'
      : '0 8px 20px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    transition: 'border-color 200ms ease, box-shadow 200ms ease',
    '&:hover': {
      borderColor: state.isFocused ? 'rgba(217, 43, 43, 0.75)' : 'rgba(0, 0, 0, 0.16)',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    height: 44,
    padding: '0 14px',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#1a1a1a',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.92rem',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#8b929d',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.92rem',
  }),
  input: (base) => ({
    ...base,
    color: '#1a1a1a',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.92rem',
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: 44,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    padding: '0 12px 0 4px',
    color: state.isFocused ? '#d92b2b' : '#777',
    transition: 'color 200ms ease, transform 200ms ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    '&:hover': {
      color: '#d92b2b',
    },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  clearIndicator: (base) => ({
    ...base,
    padding: 4,
    color: '#777',
    '&:hover': {
      color: '#d92b2b',
    },
  }),
  menu: (base) => ({
    ...base,
    marginTop: 8,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#fff',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.16)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: 6,
    maxHeight: 220,
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: 8,
    padding: '10px 12px',
    color: state.isSelected ? '#fff' : '#1a1a1a',
    backgroundColor: state.isSelected
      ? '#d92b2b'
      : state.isFocused
        ? 'rgba(217, 43, 43, 0.10)'
        : '#fff',
    cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.88rem',
    transition: 'background-color 150ms ease, color 150ms ease',
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: '#777',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.85rem',
  }),
};

function DropdownIndicator(props) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
    </components.DropdownIndicator>
  );
}

function CustomSelect({
  value = '',
  options = [],
  placeholder,
  onChange,
  isSearchable = false,
  ariaLabel,
}) {
  const selectOptions = options.map((option) => ({
    value: String(option.value ?? option),
    label: String(option.label ?? option),
  }));

  const selectedOption = selectOptions.find((option) => option.value === String(value)) || null;

  return (
    <Select
      classNamePrefix="custom-select"
      value={selectedOption}
      options={selectOptions}
      placeholder={placeholder}
      onChange={(option) => onChange(option?.value || '')}
      isSearchable={isSearchable}
      isClearable
      aria-label={ariaLabel}
      styles={customStyles}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      components={{ DropdownIndicator }}
      noOptionsMessage={() => 'Nenhuma opção encontrada'}
    />
  );
}

export default CustomSelect;
