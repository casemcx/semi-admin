import { ProForm } from 'rslib-project';

const AdminPage = () => {
  return (
    <div>
      <ProForm
        columns={[
          {
            name: 'name',
            title: 'Name',
            type: 'input',
          },
        ]}
      />
    </div>
  );
};

export default AdminPage;
