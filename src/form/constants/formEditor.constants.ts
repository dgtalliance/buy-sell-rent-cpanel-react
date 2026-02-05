import { FormType, IdxForm, QuestionType, StepOption } from '../interfaces/responses';

export const BEDS_BATHS_OPTIONS: StepOption[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4+', value: '4+' },
];

export const PROPERTY_TYPE_OPTIONS: StepOption[] = [
  { label: 'Single Family Homes', value: 'homes' },
  { label: 'Condominiums', value: 'condos' },
  { label: 'Townhouses', value: 'townhouse' },
  { label: 'Multi-family', value: 'multifamily' },
  { label: 'Vacant Land', value: 'vacantland' },
];

export const PRICE_OPTIONS: StepOption[] = [
  { label: '$0 - $100K', value: '0-100000' },
  { label: '$100K - $250K', value: '100000-250000' },
  { label: '$250K - $500K', value: '250000-500000' },
  { label: '$500K - $750K', value: '500000-750000' },
  { label: '$750K - $1M', value: '750000-1000000' },
  { label: '$1M+', value: '1000000+' },
];

export const DEFAULT_FORM_VALUES: Omit<
  IdxForm,
  'created_at' | 'modified_in' | 'registration_key' | 'id'
> = {
  name: 'New Form',
  slug: '',
  form_type: FormType.Buy,
  background_image: null,
  redirect_on_submit: false,
  redirect_url: null,
  redirect_message: `For a personalized valuation that accounts for your property's unique features, one of our experts will contact you shortly.

You can now view properties sold within the last 6 months in your micro-area. Modify the filters to explore different scenarios.

If you would like a more detailed report, feel free to reach out.`,
  steps: [
    {
      question: 'Contact Information',
      questionType: QuestionType.Contact,
      options: [],
      order: 0,
      is_default: true,
    },
  ],
};
