export interface UserInfo {
  /**
   * id
   */
  id: number;
  /**
   * 用户名
   */
  username: string;
  /**
   * 昵称
   */
  nickName: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 手机号
   */
  phone: string;
  /**
   * 角色
   */
  role: string;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;

  /**
   * 角色列表
   */
  roles: string[];
  /**
   * 权限列表
   */
  permissions: string[];
}
