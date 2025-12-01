import { FormsList } from '.';
import { ToastProvider } from '../../core/providers';

export const FormsApp = () => {
  return (
    <ToastProvider>
      <div>
        <FormsList />
      </div>
    </ToastProvider>
  );
};
