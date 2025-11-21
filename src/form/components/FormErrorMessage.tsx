import { ErrorMessage, getIn, useFormikContext } from 'formik';

export const FormErrorMessage = ({ name }: { name: string }) => {
  const { errors, touched } = useFormikContext();

  const error = getIn(errors, name);
  const isTouched = getIn(touched, name);

  if (!error || !isTouched) return null;
  return (
    <ErrorMessage
      name={name}
      render={msg => (
        <p
          style={{
            color: '#e63946',
            fontSize: '12px',
            marginTop: '4px',
          }}
        >
          {msg}
        </p>
      )}
    />
  );
};
