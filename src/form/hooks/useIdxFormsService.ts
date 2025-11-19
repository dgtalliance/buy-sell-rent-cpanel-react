import { useMemo } from 'react';
import { IdxFormsService } from '../services';

export const useIdxFormsService = () => {
  const idxFormsService = useMemo(() => new IdxFormsService(), []);
  return idxFormsService;
};
