
import React from 'react';
import { SelectOption } from '../../types';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, id, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-light-secondary mb-1">
        {label}
      </label>
      <select
        id={id}
        className="w-full bg-dark-secondary border border-dark-tertiary text-white rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
