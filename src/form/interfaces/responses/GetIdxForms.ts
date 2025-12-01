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
  background_image: string;
}

export interface Step {
  question: string;
  questionType: QuestionType;
  options: string[];
  order: number;
  is_default: boolean;
}

export enum QuestionType {
  SelectSingle = 'select_single',
  Contact = 'contact',
  Text = 'text',
  Address = 'address',
}

export enum FormType {
  Buy = 'buy',
  Sell = 'sell',
  Rent = 'rent',
}
