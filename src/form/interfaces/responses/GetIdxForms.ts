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
  form_type: string;
  steps: Step[];
  registration_key: string;
  background_image: string;
}

export interface Step {
  question: string;
  quetionType: QuestionType;
  options: string[];
}

export enum QuestionType {
  SelectSimple = 'select_simple',
}
