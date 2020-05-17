import * as React from 'react';
import {ButtonHTMLAttributes} from 'react';

type TooltipDirections = 'left' | 'right';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tooltipText?: string;
  tooltipDir?: TooltipDirections;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  tooltipText,
  tooltipDir = 'right',
  onClick,
  children,
}) => {
  return (
    <div className={`p-2 ${tooltipText ? 'tooltip' : ''}`}>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-2 rounded-full focus:outline-none"
        onClick={onClick}>
        {children}
      </button>
      {tooltipText && (
        <span className={`tooltip-text float-${tooltipDir}`}>
          {tooltipText}
        </span>
      )}
    </div>
  );
};

export default IconButton;
