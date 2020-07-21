import * as React from 'react';

interface ErrorMsgProps {
  error: string;
}

const ErrorMsg: React.FC<ErrorMsgProps> = ({error}) => {
  return (
    <div className="w-full h-18px text-center -mt-4">
      {error && (
        <p className="text-red-500 text-xs italic font-bold">{error}</p>
      )}
    </div>
  );
};

export default ErrorMsg;
