import { Typography } from 'antd';
import { TitleProps } from 'antd/es/typography/Title';
import { PropsWithChildren } from 'react';
import { theme } from '../theme';

interface IDXTitle extends TitleProps {
  htmlTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
}

export const IDXTitle = ({ children, htmlTag, ...props }: PropsWithChildren<IDXTitle>) => {
  const getLevel = () => {
    switch (htmlTag) {
      case 'h1':
        return 1;
      case 'h2':
        return 2;
      case 'h3':
        return 3;
      case 'h4':
        return 4;
      case 'h5':
        return 5;
      default:
        return 1;
    }
  };
  return (
    <Typography.Title
      style={{
        margin: 0,
        fontWeight: '700',
        fontSize: '16px',
        fontFamily: theme.typography.fontFamily,
        color: theme.typography.color,
        ...props.style,
      }}
      level={getLevel()}
      {...props}
    >
      {children}
    </Typography.Title>
  );
};
