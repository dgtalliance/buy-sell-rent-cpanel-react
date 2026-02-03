import { useCallback, useEffect, useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';
import { useIdxFormsService } from '../hooks';
import { config } from '../../core/config';
import { Modal } from 'antd';
import { FormEditor } from '.';
import { useDisclosure, useToast } from '../../core/hooks';
import { IdxForm } from '../interfaces/responses';
import moment from 'moment';
import { IDXButton } from '../../core/components';
import { IDXTitle } from '../../core/components/IDXTitle';

export const FormsList = () => {
  const idxFormsService = useIdxFormsService();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { notify } = useToast();
  const [idxForms, setIdxForms] = useState<IdxForm[]>();
  const [formId, setFormId] = useState<string>();

  const loadForms = useCallback(() => {
    idxFormsService.list(config.user.registrationKey).then(({ items }) => {
      setIdxForms(items);
    });
  }, [idxFormsService]);

  const handleDelete = useCallback(
    (id: string, name: string) => {
      Modal.confirm({
        title: 'Delete Form',
        content: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            await idxFormsService.delete(Number(id), config.user.registrationKey);
            notify('Form deleted successfully.', { type: 'success', position: 'top-right' });
            loadForms();
          } catch {
            notify('Error deleting form. Please try again.', { type: 'error', position: 'top-right' });
          }
        },
      });
    },
    [idxFormsService, loadForms, notify]
  );

  useEffect(() => {
    loadForms();
  }, []);

  return (
    <>
      <Modal
        open={isOpen}
        style={{ top: 20 }}
        width="900px"
        footer={[]}
        closable={false}
        onCancel={onClose}
        destroyOnHidden
      >
        <FormEditor formId={formId} onCancel={onClose} onSuccess={loadForms} />
      </Modal>
      <div className="forms-module-container">
        <div className="forms-header">
          <IDXTitle htmlTag="h1">Lead Generation Forms ({idxForms?.length})</IDXTitle>
          <IDXButton type='primary' onClick={() => {
            setFormId(undefined);
            onOpen();
          }}>
            CREATE NEW FORM
          </IDXButton>
        </div>
        <div className="forms-content">
          <div className="forms-grid-header">
            <div className="forms-grid-cell">
              <input type="checkbox" />
            </div>
            <div className="forms-grid-cell">FORM NAME</div>
            <div className="forms-grid-cell">FORM TYPE</div>
            <div className="forms-grid-cell">STEPS</div>
            <div className="forms-grid-cell">DATE CREATED</div>
            <div className="forms-grid-cell">LAST UPDATE</div>
            <div className="forms-grid-cell">SUBMISSIONS</div>
            <div className="forms-grid-cell">EDIT</div>
            <div className="forms-grid-cell">DELETE</div>
          </div>
          <div className="forms-list">
            {idxForms?.map(form => (
              <div key={form.id} className="form-row">
                <div className="forms-grid-cell">
                  <input type="checkbox" />
                </div>
                <div className="forms-grid-cell">
                  <span className="form-name" onClick={() => {
                    setFormId(form.id);
                    onOpen();
                  }}>{form.name}</span>
                </div>
                <div className="forms-grid-cell">
                  <span className="form-type-badge">{form.form_type}</span>
                </div>
                <div className="forms-grid-cell">{form.steps.length}</div>
                <div className="forms-grid-cell">{moment(form.created_at).format('DD/MM/YYYY')}</div>
                <div className="forms-grid-cell">{moment(form.modified_in).format('DD/MM/YYYY')}</div>
                <div className="forms-grid-cell">No data</div>
                <div className="forms-grid-cell">
                  <IDXButton
                    type="icon"
                    onClick={() => {
                      setFormId(form.id);
                      onOpen();
                    }}
                  >
                    <Edit />
                  </IDXButton>
                </div>
                <div className="forms-grid-cell">
                  <IDXButton
                    type="icon"
                    onClick={() => handleDelete(form.id, form.name)}
                    disabled={form.form_type === 'buy' || form.form_type === 'sell' || form.form_type === 'rent'}
                  >
                    <Delete />
                  </IDXButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
