export enum ResultCode {
  /**
   * 成功
   */
  SUCCESS = 200,
  /**
   * 错误
   */
  ERROR = 500,
  /**
   * 过期
   */
  OVERDUE = 599,
  /**
   * 未授权
   */
  UNAUTHORIZED = 401,
  /**
   * 超时
   */
  TIMEOUT = 10000,
}
