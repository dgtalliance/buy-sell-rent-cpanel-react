import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { generateSlug } from '../utils';

interface SlugSyncProps {
  isEditMode: boolean;
}

export const SlugSync = ({ isEditMode }: SlugSyncProps) => {
  const { values, setFieldValue } = useFormikContext<{ name: string; slug: string }>();

  useEffect(() => {
    if (!isEditMode) {
      setFieldValue('slug', generateSlug(values.name));
    }
  }, [values.name, isEditMode, setFieldValue]);

  return null;
};
