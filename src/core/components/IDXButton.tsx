import { Button, type ButtonProps } from 'antd';
import { type CSSProperties, type ReactNode } from 'react';
import { theme } from '../theme';

interface IDXButtonProps extends Omit<ButtonProps, 'type'> {
  type?: 'primary' | 'default' | 'icon';
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
  const baseStyle: CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
    boxShadow: 'none',
    borderRadius: '4px',
    width,
  };

  const getTypeStyle = (): CSSProperties => {
    if (type === 'icon') {
      return {
        background: 'transparent',
        border: 'none',
        color: disabled ? theme.button.icon.colorDisabled : theme.button.icon.color,
        padding: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      };
    }

    if (type === 'primary') {
      return {
        background: theme.primaryColor,
        borderColor: '#eee',
        color: '#fff',
      };
    }

    // default
    return {
      background: theme.secondaryColor,
      borderColor: '#d9d9d9',
      color: theme.typography.color,
    };
  };

  const getClassName = () => {
    const classes = ['idx-btn', `idx-btn-${type}`];
    return classes.join(' ');
  };

  return (
    <Button
      disabled={disabled}
      size="large"
      style={{ ...baseStyle, ...getTypeStyle(), ...style }}
      className={getClassName()}
      onClick={onClick}
      htmlType="button"
      {...props}
    >
      {children}
    </Button>
  );
};
