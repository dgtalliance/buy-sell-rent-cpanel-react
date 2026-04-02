import { useState } from 'react';
import { useFormikContext } from 'formik';
import { IdxForm, QuestionType, StepOption } from '../interfaces/responses';
import { FormErrorMessage } from './FormErrorMessage';

interface OptionInputProps {
  stepIndex: number;
  optIndex: number;
  questionType?: QuestionType;
}

const genericSlug = (label: string) =>
  label
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_')
    .replace(/^_+|_+$/g, '');

const parsePrice = (str: string): number | null => {
  const match = str.trim().match(/^\$?(\d+(?:\.\d+)?)\s*([KkMm])?$/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  const mult = match[2]?.toUpperCase();
  if (mult === 'K') return Math.round(num * 1000);
  if (mult === 'M') return Math.round(num * 1_000_000);
  return num;
};

const generatePriceValue = (label: string): string => {
  const t = label.trim();

  // Range: "$1M TO $3M" or "$100K - $250K"
  const rangeMatch = t.match(/^(.+?)\s+(?:to|-)\s+(.+)$/i);
  if (rangeMatch) {
    const lo = parsePrice(rangeMatch[1]);
    const hi = parsePrice(rangeMatch[2]);
    if (lo !== null && hi !== null) return `${lo}-${hi}`;
  }

  // Plus: "$1M+"
  const plusMatch = t.match(/^(.+?)\+\s*$/);
  if (plusMatch) {
    const v = parsePrice(plusMatch[1]);
    if (v !== null) return `${v}+`;
  }

  // "Below/Bellow/Under $1M" → "0-1000000"
  const belowMatch = t.match(/^(?:below|bellow|under)\s+(.+)$/i);
  if (belowMatch) {
    const v = parsePrice(belowMatch[1]);
    if (v !== null) return `0-${v}`;
  }

  // Single price
  const v = parsePrice(t);
  if (v !== null) return `${v}`;

  return genericSlug(t);
};

export const OptionInput = ({ stepIndex, optIndex, questionType }: OptionInputProps) => {
  const { values, setFieldValue } =
    useFormikContext<Omit<IdxForm, 'created_at' | 'modified_in' | 'registration_key'>>();
  const [isValueManuallyEdited, setIsValueManuallyEdited] = useState(false);

  const option = values.steps[stepIndex]?.options?.[optIndex] as StepOption | undefined;

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setFieldValue(`steps[${stepIndex}].options[${optIndex}].label`, newLabel);

    if (!isValueManuallyEdited) {
      const generatedValue =
        questionType === QuestionType.Price ? generatePriceValue(newLabel) : genericSlug(newLabel);
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
