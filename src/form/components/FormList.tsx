import { useEffect, useState } from 'react';
import { Edit } from '@mui/icons-material';
import { useIdxFormsService } from '../hooks';
import { config } from '../../core/config';
import { Modal } from 'antd';
import { FormEditor } from '.';
import { useDisclosure } from '../../core/hooks';
import { IdxForm } from '../interfaces/responses';
import moment from 'moment';
import { IDXButton } from '../../core/components';
import { IDXTitle } from '../../core/components/IDXTitle';

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
        closable={false}
        onCancel={onClose}
        destroyOnHidden
      >
        {formId && <FormEditor formId={formId} onCancel={onClose} />}
      </Modal>
      <div className="forms-module-container">
        <div className="forms-header">
          <div>
            <IDXTitle htmlTag="h1">Lead Generation Forms ({idxForms?.length})</IDXTitle>
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
                <td>{'No data'}</td>
                <td>
                  <div className="action-buttons">
                    <IDXButton
                      onClick={() => {
                        setFormId(form.id);
                        onOpen();
                      }}
                    >
                      <Edit />
                    </IDXButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <IDXTable
          rowKey="id"
          columns={[
            {
              key: 'name',
              dataIndex: 'name',
              title: 'FORM NAME',
            },
            {
              key: 'form_type',
              dataIndex: 'form_type',
              title: 'FORM TYPE',
            },
            {
              key: 'steps',
              dataIndex: 'steps',
              title: 'STEPS',
              render: value => value.length,
            },
            {
              key: 'created_at',
              dataIndex: 'created_at',
              title: 'DATE CREATED',
            },
            {
              key: 'modified_in',
              dataIndex: 'modified_in',
              title: 'LAST UPDATE	',
            },
            {
              key: 'submissions',
              dataIndex: 'submissions',
              title: 'SUBMISSIONS',
            },
            {
              key: 'actions',
              dataIndex: 'actions',
              title: 'ACTIONS',
            },
          ]}
          dataSource={idxForms}
        /> */}
      </div>
    </>
  );
};
