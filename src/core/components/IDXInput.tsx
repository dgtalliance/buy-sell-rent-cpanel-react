import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

interface IDXInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

export const IDXInput = ({ ...props }: IDXInputProps) => {
  return (
    <div
      style={{
        width: '270px',
        height: '40px',
        border: '1px solid #e8e8e8',
        boxSizing: 'border-box',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        paddingRight: '5px',
      }}
    >
      <input
        style={{
          width: 'calc(100% - 20px)',
          height: '100%',
          paddingLeft: '15px',
          border: 'none',
          ...props.style,
        }}
        {...props}
      />
    </div>
  );
};
