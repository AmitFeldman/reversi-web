import * as React from 'react';

interface ButtonProps {
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({onClick, children}) => {
  return (
    <div className="md:flex md:items-center">
      <div className="md:w-1/3" />
      <div className="md:w-2/3">
        <button
          onClick={onClick}
          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="button">
          {children}
        </button>
      </div>
    </div>
  );
};

export default Button;
