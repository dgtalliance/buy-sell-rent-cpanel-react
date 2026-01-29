import { useState } from 'react';
import { Field, FieldArray, getIn, useFormikContext } from 'formik';
import { ExpandMore, ExpandLess, LocationOn, Delete } from '@mui/icons-material';
import { IdxForm, QuestionType } from '../interfaces/responses';
import { FormErrorMessage } from './FormErrorMessage';
import { IDXButton } from '../../core/components';
import { IDXTitle } from '../../core/components/IDXTitle';
import { BEDS_BATHS_OPTIONS, PRICE_OPTIONS } from '../constants';
import { OptionInput } from './OptionInput';

export const FormSteps = () => {
  const { values, setValues, errors, setFieldValue } =
    useFormikContext<Omit<IdxForm, 'created_at' | 'modified_in' | 'registration_key'>>();
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
  };

  return (
    <FieldArray name="steps">
      {({ remove, insert }) => (
        <div className="editor-section">
          <div className="section-header">
            <IDXTitle htmlTag="h3">
              Form Steps ({values.steps.filter(s => !s.is_default).length})
            </IDXTitle>
            <IDXButton
              type='default'
              onClick={() => {
                const hasUnconfiguredStep = values.steps.some(
                  step => !step.is_default && !step.question.trim()
                );
                if (hasUnconfiguredStep) {
                  return;
                }
                const newIndex = values.steps.length - 1;
                insert(newIndex, {
                  question: '',
                  questionType: QuestionType.Text,
                });
                setTimeout(() => setExpandedStep(newIndex), 0);
              }}
              disabled={values.steps.some(step => !step.is_default && !step.question.trim())}
            >
              ADD STEP
            </IDXButton>
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
                          <span className="step-number" style={{ background: '#676767', color: 'white' }}>
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
                        <span className="step-question-preview" style={!step.question ? { color: '#86868b', fontStyle: 'italic' } : {}}>
                          {step.question || 'Enter question...'}
                        </span>
                        {step.questionType === QuestionType.Address && (
                          <span style={{ display: 'inline-flex' }}>
                            <LocationOn />
                          </span>
                        )}
                      </div>
                      <div className="step-header-right">
                        <button
                          className="icon-btn danger"
                          onClick={e => {
                            e.stopPropagation();
                            remove(index);
                          }}
                        >
                          <Delete />
                        </button>
                        <button className="icon-btn">
                          {expandedStep === index ? <ExpandLess /> : <ExpandMore />}
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
                              autoFocus
                            />
                            <FormErrorMessage name={`steps[${index}].question`} />
                          </div>
                          <div className="form-group">
                            <label>Field Type</label>
                            <select
                              value={step.questionType}
                              onChange={e => {
                                const newType = e.target.value as QuestionType;
                                setFieldValue(`steps[${index}].questionType`, newType);

                                // Load predefined options for Beds, Baths, Price
                                if (newType === QuestionType.Beds || newType === QuestionType.Baths) {
                                  setFieldValue(`steps[${index}].options`, [...BEDS_BATHS_OPTIONS]);
                                } else if (newType === QuestionType.Price) {
                                  setFieldValue(`steps[${index}].options`, [...PRICE_OPTIONS]);
                                } else if (newType !== QuestionType.SelectSingle) {
                                  // Clear options for types that don't use them
                                  setFieldValue(`steps[${index}].options`, []);
                                }
                              }}
                              className="form-select"
                            >
                              <option value={QuestionType.SelectSingle}>Single Select</option>
                              <option value={QuestionType.Text}>Text</option>
                              {(values.steps.findIndex(
                                  item => item.questionType === QuestionType.Address
                                ) === index ||
                                  values.steps.findIndex(
                                    item => item.questionType === QuestionType.Address
                                  ) === -1) && (
                                  <option value={QuestionType.Address}>Address</option>
                                )}
                              <option value={QuestionType.PropertyType}>Property Type</option>
                              <option value={QuestionType.Beds}>Beds</option>
                              <option value={QuestionType.Baths}>Baths</option>
                              <option value={QuestionType.Price}>Price</option>
                            </select>
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

                        {(step.questionType === QuestionType.SelectSingle ||
                          step.questionType === QuestionType.Beds ||
                          step.questionType === QuestionType.Baths ||
                          step.questionType === QuestionType.Price) && (
                          <FieldArray name={`steps[${index}].options`}>
                            {({ push, remove, form }) => (
                              <>
                                <div className="options-section">
                                  <div className="options-header">
                                    <h4>Options</h4>
                                    <IDXButton
                                      type="default"
                                      onClick={() => {
                                        push({ label: '', value: '' });
                                        form.setFieldTouched(`steps[${index}].options`, true);
                                      }}
                                    >
                                      ADD OPTION
                                    </IDXButton>
                                  </div>
                                  {typeof getIn(errors, `steps[${index}].options`) === 'string' && (
                                    <FormErrorMessage name={`steps[${index}].options`} />
                                  )}
                                  <div className="options-list">
                                    <div
                                      style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr auto',
                                        gap: '12px',
                                        marginBottom: '8px',
                                        padding: '0 4px',
                                      }}
                                    >
                                      <span style={{ fontSize: '12px', color: '#86868b', fontWeight: 500 }}>
                                        Label
                                      </span>
                                      <span style={{ fontSize: '12px', color: '#86868b', fontWeight: 500 }}>
                                        Value
                                      </span>
                                      <span style={{ width: '36px' }}></span>
                                    </div>
                                    {(step.options || []).map((_, optIndex) => (
                                      <div
                                        key={optIndex}
                                        style={{
                                          display: 'grid',
                                          gridTemplateColumns: '1fr 1fr auto',
                                          gap: '12px',
                                          alignItems: 'start',
                                        }}
                                      >
                                        <OptionInput stepIndex={index} optIndex={optIndex} />
                                        <button
                                          className="btn-delete-option icon-btn"
                                          onClick={() => {
                                            remove(optIndex);
                                            form.setFieldTouched(`steps[${index}].options`, true);
                                          }}
                                        >
                                          <Delete />
                                        </button>
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
