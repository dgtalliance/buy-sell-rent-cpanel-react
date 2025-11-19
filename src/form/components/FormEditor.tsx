import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  PlusIcon,
  SaveIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';

interface FormEditorProps {
  form: any;
  onSave: (formData: any) => void;
  onCancel: () => void;
}

// Form Editor Component
export const FormEditor = ({ form, onSave, onCancel }: FormEditorProps) => {
  const [formData, setFormData] = useState(
    form || {
      id: null,
      name: '',
      slug: '',
      description: '',
      type: 'BUY',
      backgroundImage: '',
      steps: [
        // Pre-built Contact Information step
        {
          id: 'contact-info',
          order: 999,
          question: 'Contact Information',
          fieldType: 'contact_form',
          required: true,
          options: [],
          isDefault: true,
          backgroundImage: '',
        },
      ],
    }
  );

  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [draggedStep, setDraggedStep] = useState<number | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(formData.name || '');

  const handleAddStep = () => {
    const newStep = {
      id: Date.now(),
      order: formData.steps.length,
      question: '',
      subtitle: '',
      fieldType: 'single_select',
      required: true,
      options: [],
      backgroundImage: '',
    };
    // Insert before contact step
    const contactStep = formData.steps.find((s: any) => s.isDefault);
    const otherSteps = formData.steps.filter((s: any) => !s.isDefault);
    setFormData({
      ...formData,
      steps: [...otherSteps, newStep, contactStep],
    });
    setExpandedStep(otherSteps.length);
  };

  const handleUpdateStep = (index: number, updates: any) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setFormData({ ...formData, steps: newSteps });
  };

  const handleDeleteStep = (index: number) => {
    const step = formData.steps[index];
    if (step.isDefault) {
      alert('You cannot delete the Contact Information step');
      return;
    }
    if (confirm('Delete this step?')) {
      const newSteps = formData.steps.filter((_: any, i: number) => i !== index);
      setFormData({ ...formData, steps: newSteps });
    }
  };

  const handleAddOption = (stepIndex: number) => {
    const newSteps = [...formData.steps];
    newSteps[stepIndex].options.push({
      id: Date.now(),
      text: '',
    });
    setFormData({ ...formData, steps: newSteps });
  };

  const handleUpdateOption = (stepIndex: number, optionIndex: number, value: any) => {
    const newSteps = [...formData.steps];
    newSteps[stepIndex].options[optionIndex].text = value;
    newSteps[stepIndex].options[optionIndex].value = value.toLowerCase().replace(/\s+/g, '_');
    setFormData({ ...formData, steps: newSteps });
  };

  const handleDeleteOption = (stepIndex: number, optionIndex: number) => {
    const newSteps = [...formData.steps];
    newSteps[stepIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, steps: newSteps });
  };

  const handleEditName = () => {
    setTempName(formData.name);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setFormData({
        ...formData,
        name: tempName.trim(),
        slug: tempName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
      });
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    setTempName(formData.name);
    setIsEditingName(false);
  };

  const handleNameKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEditName();
    }
  };

  const handleDragStart = (index: number) => {
    const step = formData.steps[index];
    if (step.isDefault) return;
    setDraggedStep(index);
  };

  const handleDragOver = (e: any, index: number) => {
    e.preventDefault();
    const step = formData.steps[index];
    if (step.isDefault) return;
  };

  const handleDrop = (e: any, dropIndex: number) => {
    e.preventDefault();

    if (draggedStep === null || draggedStep === dropIndex) {
      setDraggedStep(null);
      return;
    }

    const step = formData.steps[dropIndex];
    if (step.isDefault) {
      setDraggedStep(null);
      return;
    }

    const newSteps = [...formData.steps];
    const draggedItem = newSteps[draggedStep];

    newSteps.splice(draggedStep, 1);
    newSteps.splice(dropIndex, 0, draggedItem);

    newSteps.forEach((step, i) => {
      if (!step.isDefault) {
        step.order = i + 1;
      }
    });

    setFormData({ ...formData, steps: newSteps });
    setDraggedStep(null);
    setExpandedStep(dropIndex);
  };

  return (
    <div className="form-editor-container">
      <div className="editor-content">
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
                    onKeyDown={handleNameKeyPress}
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
                    onClick={handleSaveName}
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
                    {formData.name || 'New Form'}
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
              <button className="btn-primary" onClick={() => onSave(formData)}>
                <SaveIcon /> Save
              </button>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Slug (URL)</label>
              <input
                type="text"
                value={formData.slug}
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
              <label>Background Image URL (General)</label>
              <input
                type="text"
                value={formData.backgroundImage || ''}
                onChange={e => setFormData({ ...formData, backgroundImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="form-input"
              />
              <small
                style={{ color: '#86868b', fontSize: '12px', marginTop: '4px', display: 'block' }}
              >
                This image will be applied to all steps. You can override it individually in each
                step.
              </small>
            </div>
          </div>
        </div>

        <div className="editor-section">
          <div className="section-header">
            <h3 className="section-title">
              Form Steps ({formData.steps.filter((s: any) => !s.isDefault).length})
            </h3>
            <button className="btn-add-step" onClick={handleAddStep}>
              <PlusIcon /> Add Step
            </button>
          </div>

          {formData.steps.filter((s: any) => !s.isDefault).length === 0 ? (
            <div className="empty-steps">
              <p>No steps configured yet.</p>
              <p style={{ marginTop: '8px', fontSize: '13px' }}>
                The "Contact Information" step is added automatically at the end
              </p>
            </div>
          ) : (
            <div className="steps-list">
              {formData.steps.map((step: any, index: any) => {
                // Contact Information Step (default)
                if (step.isDefault) {
                  return (
                    <div
                      key={step.id}
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
                    key={step.id}
                    className={`step-card ${expandedStep === index ? 'expanded' : ''} ${
                      draggedStep === index ? 'dragging' : ''
                    }`}
                    draggable={!step.isDefault}
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
                            handleDeleteStep(index);
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
                            <input
                              type="text"
                              value={step.question}
                              onChange={e => handleUpdateStep(index, { question: e.target.value })}
                              placeholder="e.g: What Are You Looking To Buy?"
                              className="form-input"
                            />
                          </div>
                          <div className="form-group full-width">
                            <label>Subtitle (Optional)</label>
                            <input
                              type="text"
                              value={step.subtitle || ''}
                              onChange={e => handleUpdateStep(index, { subtitle: e.target.value })}
                              placeholder="Brief description or additional context..."
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label>Field Type</label>
                            <select
                              value={step.fieldType}
                              onChange={e => handleUpdateStep(index, { fieldType: e.target.value })}
                              className="form-select"
                            >
                              <option value="single_select">Single Select</option>
                              <option value="text">Text</option>
                              {formData.type === 'SELL' && <option value="address">Address</option>}
                            </select>
                            {step.fieldType === 'address' && (
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
                                  style={{ fontSize: '13px', color: '#9a3412', fontWeight: '500' }}
                                >
                                  Address field - Only one per form
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="form-group full-width">
                            <label>Background Image URL (Step Specific)</label>
                            <input
                              type="text"
                              value={step.backgroundImage || ''}
                              onChange={e =>
                                handleUpdateStep(index, { backgroundImage: e.target.value })
                              }
                              placeholder="https://example.com/step-background.jpg"
                              className="form-input"
                            />
                            <small
                              style={{
                                color: '#86868b',
                                fontSize: '12px',
                                marginTop: '4px',
                                display: 'block',
                              }}
                            >
                              If empty, it will use the form's general background.
                            </small>
                          </div>
                        </div>

                        {step.fieldType === 'single_select' && (
                          <div className="options-section">
                            <div className="options-header">
                              <h4>Options</h4>
                              <button
                                className="btn-add-option"
                                onClick={() => handleAddOption(index)}
                              >
                                <PlusIcon /> Add Option
                              </button>
                            </div>
                            <div className="options-list">
                              {step.options.map((option: any, optIndex: number) => (
                                <div
                                  key={option.id}
                                  style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: '12px',
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={option.text}
                                    onChange={e =>
                                      handleUpdateOption(index, optIndex, e.target.value)
                                    }
                                    placeholder="Option text (e.g: CONDO)"
                                    className="option-input"
                                  />
                                  <button
                                    className="btn-delete-option"
                                    onClick={() => handleDeleteOption(index, optIndex)}
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
