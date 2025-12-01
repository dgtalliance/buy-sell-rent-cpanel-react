import { Field, FieldArray, Formik, getIn, useFormikContext } from 'formik';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  Image,
  PlusIcon,
  SaveIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useIdxFormsService } from '../hooks';
import { config } from '../../core/config';
import { FormType, IdxForm, QuestionType } from '../interfaces/responses';
import { FormErrorMessage } from './FormErrorMessage';
import { useToast } from '../../core/hooks';
import { BackgroundImageUploader } from '.';

interface FormEditorProps {
  formId: string;
  onCancel?: () => void;
}

const FormSteps = () => {
  const { values, setValues, errors } =
    useFormikContext<Omit<IdxForm, 'created_at' | 'modified_in' | 'registration_key'>>();
  console.log({ errors, values });
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [draggedStep, setDraggedStep] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedStep(index);
  };

  const handleDragOver = (e: any, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: any, dropIndex: number) => {
    e.preventDefault();

    if (draggedStep === null || draggedStep === dropIndex) {
      setDraggedStep(null);
      return;
    }

    const newSteps = [...values.steps];
    const draggedItem = newSteps[draggedStep];

    newSteps.splice(draggedStep, 1);
    newSteps.splice(dropIndex, 0, draggedItem);

    setValues({ ...values, steps: newSteps });
    setDraggedStep(null);
    setExpandedStep(dropIndex);
  };
  return (
    <FieldArray name="steps">
      {({ remove, insert }) => (
        <div className="editor-section">
          <div className="section-header">
            <h3 className="section-title">
              Form Steps ({values.steps.filter(s => !s.is_default).length})
            </h3>
            <button
              className="btn-add-step"
              onClick={() =>
                insert(values.steps.length - 1, {
                  question: 'Untitled',
                  questionType: QuestionType.Text,
                })
              }
            >
              <PlusIcon /> Add Step
            </button>
          </div>

          {values.steps.filter(s => !s.is_default).length === 0 ? (
            <div className="empty-steps">
              <p>No steps configured yet.</p>
              <p style={{ marginTop: '8px', fontSize: '13px' }}>
                The "Contact Information" step is added automatically at the end
              </p>
            </div>
          ) : (
            <div className="steps-list">
              {values.steps.map((step, index) => {
                // Contact Information Step (default)
                if (step.is_default) {
                  return (
                    <div
                      key={index}
                      className="step-card"
                      style={{ borderColor: '#34d399', background: '#f0fdf4' }}
                    >
                      <div
                        className="step-header"
                        style={{ background: '#f0fdf4', cursor: 'default' }}
                      >
                        <div className="step-header-left">
                          <span className="step-number" style={{ background: '#34d399' }}>
                            Final
                          </span>
                          <span className="step-question-preview">{step.question}</span>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              background: '#34d399',
                              color: 'white',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            Pre-built
                          </span>
                        </div>
                        <div className="step-header-right">
                          <span style={{ fontSize: '12px', color: '#86868b' }}>
                            Email, Name, Phone, Comments
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Regular step
                return (
                  <div
                    key={index}
                    className={`step-card ${expandedStep === index ? 'expanded' : ''} ${
                      draggedStep === index ? 'dragging' : ''
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={e => handleDragOver(e, index)}
                    onDrop={e => handleDrop(e, index)}
                    style={{ cursor: 'move' }}
                  >
                    <div
                      className="step-header"
                      onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                    >
                      <div className="step-header-left">
                        <span className="step-number">Step {index + 1}</span>
                        <span className="step-question-preview">{step.question || 'Untitled'}</span>
                      </div>
                      <div className="step-header-right">
                        <button
                          className="icon-btn danger"
                          onClick={e => {
                            e.stopPropagation();
                            remove(index);
                          }}
                        >
                          <TrashIcon />
                        </button>
                        <button className="icon-btn">
                          {expandedStep === index ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                      </div>
                    </div>

                    {expandedStep === index && (
                      <div className="step-body">
                        <div className="form-grid">
                          <div className="form-group full-width">
                            <label>Question / Text *</label>
                            <Field
                              type="text"
                              name={`steps[${index}].question`}
                              placeholder="e.g: What Are You Looking To Buy?"
                              className="form-input"
                            />
                            <FormErrorMessage name={`steps[${index}].question`} />
                          </div>
                          <div className="form-group">
                            <label>Field Type</label>
                            <Field
                              as="select"
                              name={`steps[${index}].questionType`}
                              className="form-select"
                            >
                              <option value={QuestionType.SelectSingle}>Single Select</option>
                              <option value={QuestionType.Text}>Text</option>
                              {values.form_type === FormType.Sell &&
                                (values.steps.findIndex(
                                  item => item.questionType === QuestionType.Address
                                ) === index ||
                                  values.steps.findIndex(
                                    item => item.questionType === QuestionType.Address
                                  ) === -1) && (
                                  <option value={QuestionType.Address}>Address</option>
                                )}
                            </Field>
                            <FormErrorMessage name={`steps[${index}].questionType`} />
                            {step.questionType === QuestionType.Address && (
                              <div
                                style={{
                                  marginTop: '8px',
                                  padding: '8px 12px',
                                  background: '#fff7ed',
                                  border: '1px solid #fed7aa',
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <span style={{ fontSize: '16px' }}>📍</span>
                                <span
                                  style={{
                                    fontSize: '13px',
                                    color: '#9a3412',
                                    fontWeight: '500',
                                  }}
                                >
                                  Address field - Only one per form
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {step.questionType === QuestionType.SelectSingle && (
                          <FieldArray name={`steps[${index}].options`}>
                            {({ push, remove, form }) => (
                              <>
                                <div className="options-section">
                                  <div className="options-header">
                                    <h4>Options</h4>
                                    <button
                                      className="btn-add-option"
                                      onClick={() => {
                                        push('');
                                        form.setFieldTouched(`steps[${index}].options`, true);
                                      }}
                                    >
                                      <PlusIcon /> Add Option
                                    </button>
                                  </div>
                                  {typeof getIn(errors, `steps[${index}].options`) === 'string' && (
                                    <FormErrorMessage name={`steps[${index}].options`} />
                                  )}
                                  <div className="options-list">
                                    {(step.options || []).map((option, optIndex) => (
                                      <div key={optIndex}>
                                        <div
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr auto',
                                            gap: '12px',
                                          }}
                                        >
                                          <Field
                                            type="text"
                                            name={`steps[${index}].options[${optIndex}]`}
                                            placeholder="Option text (e.g: CONDO)"
                                            className="option-input"
                                          />
                                          <button
                                            className="btn-delete-option"
                                            onClick={() => {
                                              remove(optIndex);
                                              form.setFieldTouched(`steps[${index}].options`, true);
                                            }}
                                          >
                                            <TrashIcon />
                                          </button>
                                        </div>
                                        <FormErrorMessage
                                          name={`steps[${index}].options[${optIndex}]`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </FieldArray>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </FieldArray>
  );
};

// Form Editor Component
export const FormEditor = ({ formId, onCancel = () => {} }: FormEditorProps) => {
  const idxFormsService = useIdxFormsService();
  const { notify } = useToast();

  const [initialFormValues, setInitialFormValues] =
    useState<Omit<IdxForm, 'created_at' | 'modified_in' | 'registration_key' | 'id'>>();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const [currentFile, setCurrentFile] = useState<File>();

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
  };

  useEffect(() => {
    idxFormsService
      .getById({ id: formId, registration_key: config.user.registrationKey })
      .then(data => {
        const { created_at, modified_in, registration_key, id, ...restFormValues } = data;
        setInitialFormValues(restFormValues);
        setTempName(restFormValues.name);
      });
  }, [formId]);

  const stepSchema = Yup.object({
    order: Yup.number(),
    is_default: Yup.boolean(),
    question: Yup.string().test('skip-if-default', 'This field is required', function (value) {
      const { is_default } = this.parent;
      if (is_default) return true; // ignorar validación
      return !!value; // validar que exista
    }),
    questionType: Yup.string().test('skip-if-default', 'This field is required', function (value) {
      const { is_default } = this.parent;
      if (is_default) return true;
      return !!value;
    }),
    options: Yup.array()
      .of(Yup.string().required('This field is required'))
      .test('skip-if-default', 'There must be at least one option', function (value) {
        const { is_default, questionType } = this.parent;

        // ignorar validación si is_default es true
        if (is_default) return true;

        // si questionType es 'text' o 'address', options es opcional
        if (questionType === 'text' || questionType === 'address') return true;

        // de lo contrario, validar que sea un array con al menos un elemento
        return Array.isArray(value) && value.length > 0;
      }),
  });
  if (!initialFormValues) return <></>;

  return (
    <Formik
      initialValues={initialFormValues}
      enableReinitialize
      validationSchema={Yup.object({
        name: Yup.string().required('This field is required'),
        form_type: Yup.string().required('This field is required'),
        steps: Yup.array().of(stepSchema),
        background_image: Yup.string().nullable(),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        const orderedSteps = values.steps
          .map((item, i) => ({ ...item, order: i }))
          .sort((a, b) => a.order - b.order);
        values.steps = orderedSteps;
        idxFormsService
          .update({
            id: formId as string,
            registration_key: config.user.registrationKey,
            data: values,
          })
          .then(({ status }) => {
            if (status === 'updated') {
              notify('The form was updated successfully.', {
                type: 'success',
                position: 'top-right',
              });
              setSubmitting(false);
              onCancel();
            }
          });
      }}
    >
      {({ handleSubmit, values, setFieldValue, errors, touched }) => (
        <div className="form-editor-container">
          <div className="editor-section">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '2px solid #e5e5e7',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={tempName}
                      onChange={e => setTempName(e.target.value)}
                      style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        border: '2px solid #0071e3',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        outline: 'none',
                        minWidth: '300px',
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setFieldValue('name', tempName);
                        setIsEditingName(false);
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #34d399',
                        color: '#34d399',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Save"
                    >
                      <CheckIcon />
                    </button>
                    <button
                      onClick={handleCancelEditName}
                      style={{
                        background: 'transparent',
                        border: '1px solid #e5e5e7',
                        color: '#86868b',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Cancel"
                    >
                      <XIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <h3 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
                      {values.name || 'New Form'}
                    </h3>
                    <button
                      onClick={handleEditName}
                      style={{
                        background: 'transparent',
                        border: '1px solid #d2d2d7',
                        color: '#1d1d1f',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Edit form name"
                    >
                      <EditIcon />
                    </button>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={onCancel}>
                  <XIcon /> Cancel
                </button>
                <button className="btn-primary" onClick={() => handleSubmit()}>
                  <SaveIcon /> Save
                </button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Slug (URL)</label>
                <input
                  type="text"
                  value={values.slug}
                  className="form-input"
                  disabled
                  style={{ backgroundColor: '#f5f5f7', cursor: 'not-allowed', color: '#86868b' }}
                />
                <small
                  style={{ color: '#86868b', fontSize: '12px', marginTop: '4px', display: 'block' }}
                >
                  The slug is automatically generated from the name
                </small>
              </div>
              <div className="form-group full-width">
                <label>Background Image (General)</label>
                <BackgroundImageUploader />
                {errors.background_image && touched.background_image ? (
                  <FormErrorMessage name="background_image" />
                ) : (
                  <small
                    style={{
                      color: '#86868b',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'block',
                    }}
                  >
                    This image will be applied to all steps. You can override it individually in
                    each step.
                  </small>
                )}
              </div>
            </div>
          </div>
          <FormSteps />
        </div>
      )}
    </Formik>
  );
};
