import { ConfigProvider } from 'antd';
import { type PropsWithChildren } from 'react';

export const IDXConfiguration = ({ children }: PropsWithChildren) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 4,
          borderRadiusXS: 4,
          borderRadiusSM: 4,
          borderRadiusLG: 4,
          fontFamily: 'Open Sans',
        },
        components: {
          Button: {
            defaultShadow: 'none',
            primaryShadow: 'none',
            dangerShadow: 'none',
          },
          Pagination: {
            colorPrimary: '#e32454',
            colorPrimaryHover: '#f51a51',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
