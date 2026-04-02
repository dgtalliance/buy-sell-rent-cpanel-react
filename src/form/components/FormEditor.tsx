import { Field, Formik } from 'formik';
import { Close, Visibility } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useIdxFormsService } from '../hooks';
import { config } from '../../core/config';
import { FormType, IdxForm, ListFilter } from '../interfaces/responses';
import { FormErrorMessage } from './FormErrorMessage';
import { useToast } from '../../core/hooks';
import { BackgroundImageUploader } from '.';
import { IDXButton } from '../../core/components';
import { IDXTitle } from '../../core/components/IDXTitle';
import { DEFAULT_FORM_VALUES } from '../constants';
import { SlugSync } from './SlugSync';
import { FormSteps } from './FormSteps';

interface FormEditorProps {
  formId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const FormEditor = ({
  formId,
  onCancel = () => {},
  onSuccess = () => {},
}: FormEditorProps) => {
  const idxFormsService = useIdxFormsService();
  const { notify } = useToast();

  const isEditMode = !!formId;

  const [initialFormValues, setInitialFormValues] =
    useState<Omit<IdxForm, 'created_at' | 'modified_in' | 'registration_key' | 'id'>>(
      DEFAULT_FORM_VALUES
    );

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'settings'>('form');

  const [currentFile, setCurrentFile] = useState<File>();
  const [listFilters, setListFilters] = useState<ListFilter[]>([]);
  const [redirectDropdownOpen, setRedirectDropdownOpen] = useState(false);
  const redirectDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (redirectDropdownRef.current && !redirectDropdownRef.current.contains(e.target as Node)) {
        setRedirectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
  };

  useEffect(() => {
    if (!formId) {
      // Create mode - use default values
      setInitialFormValues(DEFAULT_FORM_VALUES);
      setTempName(DEFAULT_FORM_VALUES.name);
      return;
    }

    // Edit mode - fetch existing form
    idxFormsService
      .getById({ id: formId, registration_key: config.user.registrationKey })
      .then(data => {
        const { created_at, modified_in, registration_key, id, ...restFormValues } = data;
        setInitialFormValues(restFormValues);
        setTempName(restFormValues.name);
      });
  }, [formId]);

  useEffect(() => {
    idxFormsService
      .listFilters(config.user.registrationKey)
      .then(data => setListFilters(data))
      .catch(() => {});
  }, []);

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
    subtitle: Yup.string().optional(),
    options: Yup.array()
      .of(
        Yup.object({
          label: Yup.string().required('Label is required'),
          value: Yup.string().required('Value is required'),
        })
      )
      .test('skip-if-default', 'There must be at least one option', function (value) {
        const { is_default, questionType } = this.parent;

        // ignorar validación si is_default es true
        if (is_default) return true;

        // tipos que no requieren opciones
        const typesWithoutOptions = ['text', 'address'];
        if (typesWithoutOptions.includes(questionType)) return true;

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
        redirect_on_submit: Yup.boolean(),
        redirect_url: Yup.string()
          .nullable()
          .when('redirect_on_submit', {
            is: true,
            then: schema => schema.required('Redirect is required'),
          }),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        const orderedSteps = values.steps
          .map((item, i) => ({ ...item, order: i }))
          .sort((a, b) => a.order - b.order);
        values.steps = orderedSteps;

        const dataToSubmit = {
          ...values,
          registration_key: config.user.registrationKey,
        };

        if (isEditMode) {
          // Update existing form
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
                onSuccess();
                onCancel();
              }
            })
            .catch(error => {
              notify('Error updating form. Please try again.', {
                type: 'error',
                position: 'top-right',
              });
              setSubmitting(false);
            });
        } else {
          // Create new form
          idxFormsService
            .create(dataToSubmit)
            .then(() => {
              notify('The form was created successfully.', {
                type: 'success',
                position: 'top-right',
              });
              setSubmitting(false);
              onSuccess();
              onCancel();
            })
            .catch(error => {
              notify('Error creating form. Please try again.', {
                type: 'error',
                position: 'top-right',
              });
              setSubmitting(false);
            });
        }
      }}
    >
      {({ handleSubmit, values, errors, touched, setFieldValue }) => (
        <div className="form-editor-container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h3 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
              {values.name || 'New Form'}
            </h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <IDXButton
                type="default"
                onClick={() => {
                  const now = new Date();
                  window.IDXFormPreview?.openFormPreview({
                    id: formId || 'preview',
                    name: values.name,
                    slug: values.slug,
                    form_type: values.form_type,
                    steps: values.steps,
                    background_image: values.background_image,
                    redirect_on_submit: values.redirect_on_submit,
                    redirect_url: values.redirect_url,
                    redirect_message: values.redirect_message,
                    registration_key: config.user.registrationKey,
                    created_at: now,
                    modified_in: now,
                  });
                }}
              >
                <Visibility style={{ marginRight: '8px' }} />
                PREVIEW
              </IDXButton>
              <IDXButton type="primary" onClick={() => handleSubmit()}>
                SAVE
              </IDXButton>
              <IDXButton type="icon" onClick={onCancel}>
                <Close />
              </IDXButton>
            </div>
          </div>

          <div className="editor-tabs">
            <button
              type="button"
              className={`editor-tab ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              Form Steps
            </button>
            <button
              type="button"
              className={`editor-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          {/* Tab: Form Steps */}
          {activeTab === 'form' && (
            <>
              <SlugSync isEditMode={isEditMode} />
              <FormSteps />
            </>
          )}

          {/* Tab: Settings */}
          {activeTab === 'settings' && (
            <>
              <div className="editor-section">
                <IDXTitle htmlTag="h3">General Settings</IDXTitle>
                <div className="form-grid" style={{ marginTop: '16px' }}>
                  <div className="form-group">
                    <label>Form Name *</label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter form name"
                      className="form-input"
                    />
                    <FormErrorMessage name="name" />
                  </div>
                  <div className="form-group">
                    <label>Form Type *</label>
                    <select
                      value={values.form_type}
                      onChange={e => setFieldValue('form_type', e.target.value)}
                      className="form-select"
                    >
                      <option value={FormType.Buy}>Buy</option>
                      <option value={FormType.Sell}>Sell</option>
                      <option value={FormType.Rent}>Rent</option>
                    </select>
                    <FormErrorMessage name="form_type" />
                  </div>
                  <div className="form-group">
                    <label>Slug (URL)</label>
                    <input
                      type="text"
                      value={values.slug}
                      className="form-input"
                      disabled
                      style={{
                        backgroundColor: '#f5f5f7',
                        cursor: 'not-allowed',
                        color: '#86868b',
                      }}
                    />
                    <small
                      style={{
                        color: '#86868b',
                        fontSize: '12px',
                        marginTop: '4px',
                        display: 'block',
                      }}
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
                      <small className="help-text help-text--compact">
                        This image applies to all steps. You can override it. Max size: 2 MB.
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="editor-section editor-section--spaced">
                <IDXTitle htmlTag="h3">Redirect Settings</IDXTitle>
                <div className="form-grid form-grid--spaced">
                  <div className="form-group full-width">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span>Redirect on Submit</span>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={values.redirect_on_submit || false}
                          onChange={e => {
                            setFieldValue('redirect_on_submit', e.target.checked);
                          }}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <small className="help-text help-text--spaced">
                      Redirect to the general search page or a specific map search filter you have
                      created.
                    </small>
                  </div>

                  {values.redirect_on_submit && (
                    <>
                      <div className="form-group full-width">
                        <label>Redirect To *</label>
                        <div ref={redirectDropdownRef} style={{ position: 'relative' }}>
                          <div
                            className="form-select"
                            onClick={() => setRedirectDropdownOpen(v => !v)}
                            style={{
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span>
                              {(() => {
                                const url = values.redirect_url || '/search';
                                if (url === '/search') return 'Search Result Page - /search';
                                const found = listFilters.find(f => f.value === url);
                                return found ? found.name : url;
                              })()}
                            </span>
                            <span style={{ fontSize: '10px', color: '#86868b' }}>
                              {redirectDropdownOpen ? '▲' : '▼'}
                            </span>
                          </div>
                          {redirectDropdownOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                maxHeight: '180px',
                                overflowY: 'auto',
                                background: 'white',
                                border: '1px solid #d2d2d7',
                                borderRadius: '0 0 8px 8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                zIndex: 10,
                              }}
                            >
                              {[
                                { name: 'Search Result Page - /search', value: '/search' },
                                ...listFilters,
                              ].map(filter => (
                                <div
                                  key={filter.value}
                                  onClick={() => {
                                    setFieldValue('redirect_url', filter.value);
                                    setRedirectDropdownOpen(false);
                                  }}
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    background:
                                      (values.redirect_url || '/search') === filter.value
                                        ? '#f0f0f5'
                                        : 'transparent',
                                    fontWeight:
                                      (values.redirect_url || '/search') === filter.value
                                        ? 500
                                        : 400,
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
                                  onMouseLeave={e =>
                                    (e.currentTarget.style.background =
                                      (values.redirect_url || '/search') === filter.value
                                        ? '#f0f0f5'
                                        : 'transparent')
                                  }
                                >
                                  {filter.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <FormErrorMessage name="redirect_url" />
                      </div>
                      <div className="form-group full-width">
                        <label>Redirect Message</label>
                        <textarea
                          value={values.redirect_message || ''}
                          onChange={e => setFieldValue('redirect_message', e.target.value)}
                          className="form-textarea"
                          rows={5}
                          placeholder="Enter a message to show users before redirecting..."
                        />
                        <small className="help-text help-text--compact">
                          This message will be shown to users after submitting the form, before
                          redirecting to the search page.
                        </small>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="editor-footer">
            <IDXButton onClick={onCancel}>Cancel</IDXButton>
            <IDXButton type="primary" onClick={() => handleSubmit()}>
              SAVE
            </IDXButton>
          </div>
        </div>
      )}
    </Formik>
  );
};
