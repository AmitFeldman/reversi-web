import * as React from 'react';
import ReactTooltip from 'react-tooltip';

interface MenuButtonProps {
  text: string;
  disabledTooltipText?: string;
  enabled?: boolean;
  onClick?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  text,
  onClick,
  disabledTooltipText,
  enabled = true,
}) => {
  return (
    <>
      <p
        data-tip={disabledTooltipText}
        data-place="right"
        className={`w-fitcontent text-3xl ${
          enabled ? 'cursor-pointer hover:text-black' : 'cursor-default'
        }`}
        onClick={() => enabled && onClick && onClick()}>
        {text}
      </p>
      <ReactTooltip />
    </>
  );
};

export default MenuButton;
