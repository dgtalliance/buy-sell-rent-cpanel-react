interface IDXFormPreviewAPI {
  openFormPreview: (formData: {
    id: string;
    name: string;
    slug: string;
    form_type: string;
    steps: Array<{
      question: string;
      questionType: string;
      options: Array<{ label: string; value: string }>;
      order: number;
      is_default?: boolean;
      placeholder?: string;
    }>;
    background_image: string | null;
    redirect_on_submit: boolean;
    redirect_url: string | null;
    redirect_message?: string | null;
    registration_key: string;
    created_at: Date;
    modified_in: Date;
  }) => void;
  closeFormPreview: () => void;
}

interface Window {
  registrationKey?: string;
  idxboostApiUrl?: string;
  IDXFormPreview?: IDXFormPreviewAPI;
}
