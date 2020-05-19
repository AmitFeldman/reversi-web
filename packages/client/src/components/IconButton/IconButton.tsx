import * as React from 'react';
import {ButtonHTMLAttributes} from 'react';
import ReactTooltip, {TooltipProps} from 'react-tooltip';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tooltipText?: string;
  place?: TooltipProps['place'];
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  tooltipText,
  place = 'right',
  onClick,
  children,
}) => {
  return (
    <>
      <div className="p-2">
        <button
          data-tip={tooltipText}
          data-place={place}
          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white py-2 px-2 rounded-full focus:outline-none"
          onClick={onClick}>
          {children}
        </button>
      </div>
      <ReactTooltip />
    </>
  );
};

export default IconButton;
