import { useUserStore } from '@/stores/user';
import { ProForm } from '@packages/components';

const Login = () => {
  const userStore = useUserStore();

  const columns = [
    {
      title: '用户名',
      name: 'username',
      key: 'username',
    },
    {
      title: '密码',
      name: 'password',
      key: 'password',
    },
  ];

  const onSubmit = async (values: any) => {
    await userStore.login(values);
    console.log(values);
  };

  return (
    <div className="auth-login-container bg-white p-4 rounded-md">
      <ProForm columns={columns} onSubmit={onSubmit} />
    </div>
  );
};

export default Login;
