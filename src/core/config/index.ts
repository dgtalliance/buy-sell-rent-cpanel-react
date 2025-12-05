interface globalThis {
  registrationKey?: string;
}
const envVars = import.meta.env;

const createConfig = () => {
  return {
    user: {
      registrationKey: window.registrationKey || envVars.VITE_REGISTRATION_KEY,
    },
    api: {
      idxboost: window.idxboostApiUrl || envVars.VITE_IDXBOOST_API_URL,
    },
  };
};

export const config = createConfig();
