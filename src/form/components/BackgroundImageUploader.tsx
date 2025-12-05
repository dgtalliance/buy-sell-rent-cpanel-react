import { useFormikContext } from 'formik';
import { useRef, useState, ChangeEvent } from 'react';
import { IdxForm } from '../interfaces/responses';

export const BackgroundImageUploader: React.FC = () => {
  const { values, setFieldValue } =
    useFormikContext<Omit<IdxForm, 'created_at' | 'modified_in' | 'registration_key' | 'id'>>();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(values.background_image);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSelectImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await toBase64(file);
      setBackgroundImage(base64);
      setFieldValue('background_image', base64);
    }
  };

  const handleRemove = () => {
    setBackgroundImage(null);
    setFieldValue('background_image', null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div style={container}>
      {!backgroundImage ? (
        <div style={uploadBox} onClick={() => inputRef.current?.click()}>
          <span style={addText}>+ Add Background Image</span>
        </div>
      ) : (
        <div style={imageBox}>
          <img src={backgroundImage} alt="Background Preview" style={image} />
          <div style={{ display: 'flex', position: 'absolute', bottom: 0, width: '100%' }}>
            <button type="button" style={updateButton} onClick={() => inputRef.current?.click()}>
              Update Image
            </button>
            <button type="button" style={removeButton} onClick={handleRemove}>
              Remove Image
            </button>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleSelectImage} />
    </div>
  );
};

const container: React.CSSProperties = {
  width: '100%',
  maxWidth: '280px',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
};

const uploadBox: React.CSSProperties = {
  width: '100%',
  height: '150px',
  border: '2px dashed #9e9e9e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: '0.2s',
  background: '#fafafa',
};

const addText: React.CSSProperties = {
  color: '#1976d2',
  fontSize: '14px',
  fontWeight: 500,
};

const imageBox: React.CSSProperties = {
  width: '100%',
  height: '150px',
  position: 'relative',
  border: '1px solid #ddd',
  overflow: 'hidden',
  borderRadius: '8px',
};

const image: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const updateButton: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0,0,0,0.75)',
  color: '#fff',
  border: 'none',
  padding: '10px',
  cursor: 'pointer',
  fontSize: '13px',
};

const removeButton: React.CSSProperties = {
  width: '100%',
  background: '#d32f2f',
  color: '#fff',
  border: 'none',
  padding: '10px',
  cursor: 'pointer',
  fontSize: '13px',
};
