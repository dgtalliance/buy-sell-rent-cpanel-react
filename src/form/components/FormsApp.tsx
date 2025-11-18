import { useState } from 'react';
import { FormEditor, FormsList } from '.';

export const FormsApp = () => {
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [editingForm, setEditingForm] = useState(null);
  const [forms, setForms] = useState([
    {
      id: 1,
      name: 'Buy Form',
      slug: 'buy',
      type: 'BUY',
      stepsCount: 6,
      dateCreated: '11/06/2025',
      lastUpdate: '11/06/2025',
      submissionsCount: 24,
      backgroundImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
      steps: [
        {
          id: 1,
          order: 1,
          question: 'What Are You Looking To Buy?',
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 101, text: 'CONDO', value: 'condo' },
            { id: 102, text: 'SINGLE FAMILY HOME', value: 'single_family_home' },
            { id: 103, text: 'TOWNHOUSE', value: 'townhouse' },
          ],
        },
        {
          id: 2,
          order: 2,
          question: "What's Your Price Range?",
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 201, text: 'BELOW $1M', value: 'below_1m' },
            { id: 202, text: '$1M TO $3M', value: '1m_to_3m' },
            { id: 203, text: '$3M TO $5M', value: '3m_to_5m' },
            { id: 204, text: '$5M+', value: '5m_plus' },
          ],
        },
        {
          id: 3,
          order: 3,
          question: 'How Many Bedrooms?',
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 301, text: '1', value: '1' },
            { id: 302, text: '2', value: '2' },
            { id: 303, text: '3', value: '3' },
            { id: 304, text: '4+', value: '4_plus' },
          ],
        },
        {
          id: 4,
          order: 4,
          question: 'How Many Bathrooms?',
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 401, text: '1', value: '1' },
            { id: 402, text: '2', value: '2' },
            { id: 403, text: '3', value: '3' },
            { id: 404, text: '4+', value: '4_plus' },
          ],
        },
        {
          id: 5,
          order: 5,
          question: 'Timeline To Purchase',
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 501, text: 'NOW', value: 'now' },
            { id: 502, text: 'SOON', value: 'soon' },
            { id: 503, text: 'LATER', value: 'later' },
          ],
        },
        {
          id: 'contact-info',
          order: 999,
          question: 'Contact Information',
          fieldType: 'contact_form',
          required: true,
          options: [],
          isDefault: true,
        },
      ],
    },
    {
      id: 2,
      name: 'Sell Form',
      slug: 'sell',
      type: 'SELL',
      stepsCount: 5,
      dateCreated: '11/05/2025',
      lastUpdate: '11/06/2025',
      submissionsCount: 18,
      backgroundImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200',
      steps: [
        {
          id: 11,
          order: 1,
          question: "What's Your Home Worth?",
          fieldType: 'address',
          required: true,
          options: [],
          placeholder: 'Enter your address here',
          backgroundImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200',
        },
        {
          id: 12,
          order: 2,
          question: 'How Many Bedrooms?',
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 601, text: '1', value: '1' },
            { id: 602, text: '2', value: '2' },
            { id: 603, text: '3', value: '3' },
            { id: 604, text: '4+', value: '4_plus' },
          ],
        },
        {
          id: 13,
          order: 3,
          question: 'How Many Bathrooms?',
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 701, text: '1', value: '1' },
            { id: 702, text: '2', value: '2' },
            { id: 703, text: '3', value: '3' },
            { id: 704, text: '4+', value: '4_plus' },
          ],
        },
        {
          id: 14,
          order: 4,
          question: 'Planning Stages',
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 801, text: "I'M READY", value: 'im_ready' },
            { id: 802, text: 'ALMOST THERE', value: 'almost_there' },
            { id: 803, text: 'FLEXIBLE', value: 'flexible' },
            { id: 804, text: 'PLANNING STAGES', value: 'planning_stages' },
          ],
        },
        {
          id: 'contact-info',
          order: 999,
          question: 'Contact Information',
          fieldType: 'contact_form',
          required: true,
          options: [],
          isDefault: true,
        },
      ],
    },
    {
      id: 3,
      name: 'Rent Form',
      slug: 'rent',
      type: 'RENT',
      stepsCount: 5,
      dateCreated: '11/04/2025',
      lastUpdate: '11/04/2025',
      submissionsCount: 8,
      backgroundImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
      steps: [
        {
          id: 21,
          order: 1,
          question: 'What Are You Looking To Rent?',
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 901, text: 'APARTMENT', value: 'apartment' },
            { id: 902, text: 'HOUSE', value: 'house' },
            { id: 903, text: 'CONDO', value: 'condo' },
            { id: 904, text: 'TOWNHOUSE', value: 'townhouse' },
          ],
        },
        {
          id: 22,
          order: 2,
          question: "What's Your Budget?",
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 1001, text: 'BELOW $1,000', value: 'below_1000' },
            { id: 1002, text: '$1,000 - $2,000', value: '1000_to_2000' },
            { id: 1003, text: '$2,000 - $3,000', value: '2000_to_3000' },
            { id: 1004, text: '$3,000+', value: '3000_plus' },
          ],
        },
        {
          id: 23,
          order: 3,
          question: 'How Many Bedrooms?',
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 1101, text: 'STUDIO', value: 'studio' },
            { id: 1102, text: '1', value: '1' },
            { id: 1103, text: '2', value: '2' },
            { id: 1104, text: '3+', value: '3_plus' },
          ],
        },
        {
          id: 24,
          order: 4,
          question: 'When Do You Need To Move?',
          fieldType: 'single_select',
          required: true,
          options: [
            { id: 1201, text: 'IMMEDIATELY', value: 'immediately' },
            { id: 1202, text: 'WITHIN 1 MONTH', value: 'within_1_month' },
            { id: 1203, text: '1-3 MONTHS', value: '1_to_3_months' },
            { id: 1204, text: '3+ MONTHS', value: '3_plus_months' },
          ],
        },
        {
          id: 'contact-info',
          order: 999,
          question: 'Contact Information',
          fieldType: 'contact_form',
          required: true,
          options: [],
          isDefault: true,
        },
      ],
    },
  ]);

  const handleEdit = (form: any) => {
    setEditingForm(form);
    setView('editor');
  };

  const handleSave = (formData: any) => {
    if (formData.id) {
      // Update
      setForms(forms.map(f => (f.id === formData.id ? formData : f)));
    } else {
      // Create
      formData.id = Date.now();
      formData.dateCreated = new Date().toLocaleDateString();
      formData.lastUpdate = new Date().toLocaleDateString();
      formData.stepsCount = formData.steps.length;
      formData.submissionsCount = 0;
      setForms([...forms, formData]);
    }
    setView('list');
    alert('Formulario guardado exitosamente');
  };

  const handleCancel = () => {
    setView('list');
  };

  const handleDelete = (form: any) => {
    if (confirm(`¿Eliminar "${form.name}"?`)) {
      setForms(forms.filter(f => f.id !== form.id));
    }
  };

  return (
    <div>
      {view === 'list' ? (
        <FormsList forms={forms} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <FormEditor form={editingForm} onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
};
