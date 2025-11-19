const envVars = import.meta.env;

const createConfig = () => {
  return {
    user: {
      registrationKey: '123',
    },
    api: {
      idxboost: envVars.VITE_IDXBOOST_API_URL,
    },
  };
};

export const config = createConfig();
