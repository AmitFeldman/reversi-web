import * as React from 'react';

type InputValue = string | string[] | number;

interface LabeledInputProps {
  label: string;
  value: InputValue;
  onValueChange: (e: React.FormEvent<HTMLInputElement>) => void;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onValueChange,
}) => {
  return (
    <div className="md:flex md:items-center mb-6">
      <div className="md:w-1/3">
        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
          {label}
        </label>
      </div>
      <div className="md:w-2/3">
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          type="text"
          value={value}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            onValueChange(e);
          }}
        />
      </div>
    </div>
  );
};

export default LabeledInput;
