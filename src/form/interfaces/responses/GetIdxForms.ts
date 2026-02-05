export interface GetIdxForms {
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: IdxForm[];
}

export interface IdxForm {
  id: string;
  name: string;
  created_at: Date;
  modified_in: Date;
  slug: string;
  form_type: FormType;
  steps: Step[];
  registration_key: string;
  background_image: string | null;
  redirect_on_submit: boolean;
  redirect_url: string | null;
  redirect_message: string | null;
}

export interface StepOption {
  label: string;
  value: string;
}

export interface Step {
  question: string;
  questionType: QuestionType;
  options: StepOption[];
  order: number;
  is_default: boolean;
  placeholder?: string;
}

export enum QuestionType {
  SelectSingle = 'select_single',
  SelectMultiple = 'multi_select',
  Contact = 'contact',
  Text = 'text',
  Address = 'address',
  PropertyType = 'property_type',
  Beds = 'beds',
  Baths = 'baths',
  Price = 'price',
}

export enum FormType {
  Buy = 'buy',
  Sell = 'sell',
  Rent = 'rent',
  Custom = 'custom',
}
