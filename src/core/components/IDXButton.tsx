import { Button, type ButtonProps } from 'antd';
import { theme } from '../theme';
import { type CSSProperties, type ReactNode } from 'react';

interface IDXButtonProps extends ButtonProps {
  type?: 'primary' | 'default';
  children?: ReactNode;
  disabled?: boolean;
  style?: CSSProperties;
  width?: string;
  onClick?: () => void;
}

export const IDXButton = ({
  type = 'default',
  children,
  disabled,
  style,
  width,
  onClick,
  ...props
}: IDXButtonProps) => {
  const backgroundColor = type === 'primary' ? 'primaryColor' : 'secondaryColor';
  const customStyle: CSSProperties | undefined = !disabled
    ? {
        background: theme[backgroundColor],
        borderColor: backgroundColor === 'primaryColor' ? '#eee' : '#d9d9d9',
        color: backgroundColor === 'primaryColor' ? '#fff' : theme.typography.color,
        fontSize: '12px',
        fontWeight: '600',
        fontFamily: theme.typography.fontFamily,
        width,
        boxShadow: 'none',
        borderRadius: '4px',
        ...style,
      }
    : style;
  return (
    <Button
      disabled={disabled}
      size="large"
      style={customStyle}
      type="primary"
      onClick={onClick}
      htmlType="button"
      {...props}
    >
      {children}
    </Button>
  );
};
