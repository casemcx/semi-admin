import { ResultCode } from './result-code';
import { ResultPage } from './result-page';
export class Result<T> {
  code: number;
  msg: string;
  message: string;
  data?: T;
  ok: boolean;

  constructor(
    ok: boolean,
    code: number,
    message: string,
    msg: string,
    data?: T,
  ) {
    this.ok = ok;
    this.code = code;
    this.message = message;
    this.msg = msg;
    this.data = data;
  }

  /**
   * 成功
   * @param data 数据
   * @param message 消息
   * @returns Result<T>
   */
  static success<T>(data: T, message = 'success'): Result<T> {
    return new Result<T>(true, ResultCode.SUCCESS, message, 'success', data);
  }

  static page<T>(data: ResultPage<T>, message: string): Result<ResultPage<T>> {
    return new Result<ResultPage<T>>(
      true,
      ResultCode.SUCCESS,
      message,
      'success',
      data,
    );
  }

  /**
   * 错误
   * @param message 消息
   * @param msg 消息
   * @param code 错误码
   * @returns Result<T>
   */
  static error<T>(
    message: string,
    msg = 'error',
    code = ResultCode.ERROR,
  ): Result<T> {
    return new Result<T>(false, code, message, msg);
  }

  /**
   * 超时
   * @param message 消息
   * @param msg 消息
   * @param code 错误码
   * @returns Result<T>
   */
  static timeout<T>(
    message: string,
    msg = 'timeout',
    code = ResultCode.TIMEOUT,
  ): Result<T> {
    return new Result<T>(false, code, message, msg);
  }

  /**
   * 过期
   * @param message 消息
   * @param msg 消息
   * @param code 错误码
   * @returns Result<T>
   */
  static overdue<T>(
    message: string,
    msg = 'overdue',
    code = ResultCode.OVERDUE,
  ): Result<T> {
    return new Result<T>(false, code, message, msg);
  }

  /**
   * 未授权
   * @param message 消息
   * @param msg 消息
   * @param code 错误码
   * @returns Result<T>
   */
  static unauthorized<T>(
    message: string,
    msg = 'unauthorized',
    code = ResultCode.UNAUTHORIZED,
  ): Result<T> {
    return new Result<T>(
      false,
      ResultCode.UNAUTHORIZED,
      message,
      'unauthorized',
    );
  }
}
