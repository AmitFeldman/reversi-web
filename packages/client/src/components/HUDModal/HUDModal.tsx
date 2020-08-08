import * as React from 'react';
import Modal, {Props} from 'react-modal';
import {GrClose} from 'react-icons/gr';

const DEFAULT_STYLE = {overlay: {zIndex: 1000}};

interface HUDModalProps extends Props {
  closeButton?: boolean;
}

const HUDModal: React.FC<HUDModalProps> = ({
  style,
  className,
  closeButton = true,
  children,
  onRequestClose,
  ...props
}) => {
  return (
    <Modal
      style={Object.assign({}, DEFAULT_STYLE, style)}
      className={`bg-white shadow-md rounded px-8 pt-3 pb-8 mb-4 m-5 outline-none ${className}`}
      onRequestClose={onRequestClose}
      overlayClassName=""
      {...props}>
      {closeButton && (
        <GrClose
          className="float-right -mr-5 cursor-pointer"
          onClick={onRequestClose}
        />
      )}
      {children}
    </Modal>
  );
};

export default HUDModal;
