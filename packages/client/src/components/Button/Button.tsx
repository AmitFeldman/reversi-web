import * as React from 'react';

interface ButtonProps {
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({onClick, className, children}) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        className={`${className} shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
        type="button">
        {children}
      </button>
    </div>
  );
};

export default Button;
