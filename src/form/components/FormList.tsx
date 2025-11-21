import { useEffect, useState } from 'react';
import { EditIcon, TrashIcon } from 'lucide-react';
import { useIdxFormsService } from '../hooks';
import { config } from '../../core/config';
import { Modal } from 'antd';
import { FormEditor } from '.';
import { useDisclosure } from '../../core/hooks';
import { IdxForm } from '../interfaces/responses';
import moment from 'moment';

export const FormsList = () => {
  const idxFormsService = useIdxFormsService();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [idxForms, setIdxForms] = useState<IdxForm[]>();
  const [formId, setFormId] = useState<string>();

  useEffect(() => {
    idxFormsService.list(config.user.registrationKey).then(({ items }) => {
      setIdxForms(items);
    });
  }, []);

  return (
    <>
      <Modal
        open={isOpen}
        style={{ top: 20 }}
        width="1200px"
        footer={[]}
        onCancel={onClose}
        destroyOnHidden
      >
        {formId && <FormEditor formId={formId} onCancel={onClose} />}
      </Modal>
      <div className="forms-module-container">
        <div className="forms-header">
          <div>
            <h2 className="forms-title">Lead Generation Forms ({idxForms?.length})</h2>
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
            {idxForms?.map(form => (
              <tr key={form.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <span className="form-name">{form.name}</span>
                </td>
                <td>
                  <span className="form-type-badge">{form.form_type}</span>
                </td>
                <td>{form.steps.length}</td>
                <td>{moment(form.created_at).format('DD/MM/YYYY')}</td>
                <td>{moment(form.modified_in).format('DD/MM/YYYY')}</td>
                <td>{'???'}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn"
                      onClick={() => {
                        setFormId(form.id);
                        onOpen();
                      }}
                    >
                      <EditIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
