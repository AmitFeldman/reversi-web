import * as React from 'react';

interface MenuButtonProps {
  text: string;
  onClick?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({text, onClick}) => {
  return (
    <p
      className="w-fitcontent text-3xl cursor-pointer hover:text-black"
      onClick={onClick}>
      {text}
    </p>
  );
};

export default MenuButton;
