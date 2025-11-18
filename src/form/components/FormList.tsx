import { useState } from 'react';
import { EditIcon, TrashIcon } from 'lucide-react';

interface FormsListProps {
  forms: any[];
  onEdit: (form: any) => void;
  onDelete: (form: any) => void;
}

export const FormsList = ({ forms, onEdit, onDelete }: FormsListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="forms-module-container">
      <div className="forms-header">
        <div>
          <h2 className="forms-title">Lead Generation Forms ({forms.length})</h2>
        </div>
      </div>

      <table className="forms-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>FORM NAME</th>
            <th>FORM TYPE</th>
            <th>STEPS</th>
            <th>DATE CREATED</th>
            <th>LAST UPDATE</th>
            <th>SUBMISSIONS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredForms.map(form => (
            <tr key={form.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <span className="form-name">{form.name}</span>
              </td>
              <td>
                <span className="form-type-badge">{form.type}</span>
              </td>
              <td>{form.stepsCount}</td>
              <td>{form.dateCreated}</td>
              <td>{form.lastUpdate}</td>
              <td>{form.submissionsCount}</td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn" onClick={() => onEdit(form)}>
                    <EditIcon />
                  </button>
                  <button className="action-btn danger" onClick={() => onDelete(form)}>
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
