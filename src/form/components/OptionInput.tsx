import { useState } from 'react';
import { useFormikContext } from 'formik';
import { IdxForm, StepOption } from '../interfaces/responses';
import { FormErrorMessage } from './FormErrorMessage';

interface OptionInputProps {
  stepIndex: number;
  optIndex: number;
}

export const OptionInput = ({ stepIndex, optIndex }: OptionInputProps) => {
  const { values, setFieldValue } =
    useFormikContext<Omit<IdxForm, 'created_at' | 'modified_in' | 'registration_key'>>();
  const [isValueManuallyEdited, setIsValueManuallyEdited] = useState(false);

  const option = values.steps[stepIndex]?.options?.[optIndex] as StepOption | undefined;

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setFieldValue(`steps[${stepIndex}].options[${optIndex}].label`, newLabel);

    if (!isValueManuallyEdited) {
      const generatedValue = newLabel
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '_')
        .replace(/^_+|_+$/g, '');
      setFieldValue(`steps[${stepIndex}].options[${optIndex}].value`, generatedValue);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsValueManuallyEdited(true);
    setFieldValue(`steps[${stepIndex}].options[${optIndex}].value`, e.target.value);
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={option?.label || ''}
          onChange={handleLabelChange}
          placeholder="Label (e.g: Condo)"
          className="option-input"
          style={{ width: '100%' }}
        />
        <FormErrorMessage name={`steps[${stepIndex}].options[${optIndex}].label`} />
      </div>
      <div>
        <input
          type="text"
          value={option?.value || ''}
          onChange={handleValueChange}
          placeholder="Value (e.g: condo)"
          className="option-input"
          style={{ width: '100%', backgroundColor: isValueManuallyEdited ? '#fff' : '#f9f9f9' }}
        />
        <FormErrorMessage name={`steps[${stepIndex}].options[${optIndex}].value`} />
      </div>
    </>
  );
};
