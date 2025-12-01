const envVars = import.meta.env;

const createConfig = () => {
  return {
    user: {
      registrationKey: '3fd11664-30dd-450b-81b6-e8962aa377a7',
    },
    api: {
      idxboost: envVars.VITE_IDXBOOST_API_URL,
    },
  };
};

export const config = createConfig();
