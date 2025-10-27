export type ValidationRule = {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  len?: number;
  type?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'method'
    | 'regexp'
    | 'integer'
    | 'float'
    | 'array'
    | 'object'
    | 'enum'
    | 'date'
    | 'url'
    | 'hex'
    | 'email';
  validator?: (
    rule: any,
    value: any,
    callback: (error?: string) => void,
  ) => void;
};

export type TFunction = (key: string, options?: Record<string, any>) => string;

/**
 * 通用验证规则组合工具
 * Generic validation rule composition utility with multi-language support
 */
export class ValidationBuilder {
  private rules: ValidationRule[] = [];
  private t: TFunction;

  constructor(t: TFunction) {
    this.t = t;
  }

  /**
   * 添加必填验证
   * Add required validation
   */
  required(fieldName?: string): ValidationBuilder {
    this.rules.push({
      required: true,
      message: fieldName
        ? this.t('common.pleaseEnterField', { field: fieldName })
        : this.t('common.fieldRequired'),
    });
    return this;
  }

  /**
   * 添加必选验证（用于下拉框等选择型组件）
   * Add required selection validation
   */
  requiredSelect(fieldName?: string): ValidationBuilder {
    this.rules.push({
      required: true,
      message: fieldName
        ? this.t('common.pleaseSelectField', { field: fieldName })
        : this.t('common.fieldRequired'),
    });
    return this;
  }

  /**
   * 添加最小长度验证
   * Add minimum length validation
   */
  minLength(min: number, fieldName?: string): ValidationBuilder {
    this.rules.push({
      min,
      message: fieldName
        ? this.t('common.fieldMinLength', { field: fieldName, min })
        : this.t('common.minLength', { min }),
    });
    return this;
  }

  /**
   * 添加最大长度验证
   * Add maximum length validation
   */
  maxLength(max: number, fieldName?: string): ValidationBuilder {
    this.rules.push({
      max,
      message: fieldName
        ? this.t('common.fieldMaxLength', { field: fieldName, max })
        : this.t('common.maxLength', { max }),
    });
    return this;
  }

  /**
   * 添加长度范围验证
   * Add length range validation
   */
  lengthRange(min: number, max: number, fieldName?: string): ValidationBuilder {
    this.rules.push({
      min,
      max,
      message: fieldName
        ? this.t('common.fieldLengthRange', { field: fieldName, min, max })
        : this.t('common.lengthRange', { min, max }),
    });
    return this;
  }

  /**
   * 添加数字范围验证
   * Add number range validation
   */
  numberRange(min: number, max: number, fieldName?: string): ValidationBuilder {
    this.rules.push({
      type: 'number',
      min,
      max,
      message: fieldName
        ? this.t('common.fieldNumberRange', { field: fieldName, min, max })
        : this.t('common.numberRange', { min, max }),
    });
    return this;
  }

  /**
   * 添加邮箱验证
   * Add email validation
   */
  email(): ValidationBuilder {
    this.rules.push({
      type: 'email',
      message: this.t('common.emailInvalid'),
    });
    return this;
  }

  /**
   * 添加手机号验证
   * Add phone number validation
   */
  phone(): ValidationBuilder {
    this.rules.push({
      pattern: /^1[3-9]\d{9}$/,
      message: this.t('common.phoneInvalid'),
    });
    return this;
  }

  /**
   * 添加密码验证
   * Add password validation
   */
  password(minLength = 6): ValidationBuilder {
    this.rules.push({
      min: minLength,
      message: this.t('common.passwordMinLength', { min: minLength }),
    });
    return this;
  }

  /**
   * 添加正则表达式验证
   * Add regex pattern validation
   */
  pattern(regex: RegExp, message: string): ValidationBuilder {
    this.rules.push({
      pattern: regex,
      message,
    });
    return this;
  }

  /**
   * 添加自定义验证函数
   * Add custom validator function
   */
  custom(
    validator: (
      rule: any,
      value: any,
      callback: (error?: string) => void,
    ) => void,
  ): ValidationBuilder {
    this.rules.push({
      validator,
    });
    return this;
  }

  /**
   * 构建验证规则数组
   * Build validation rules array
   */
  build(): ValidationRule[] {
    return [...this.rules];
  }

  /**
   * 重置构建器
   * Reset builder
   */
  reset(): ValidationBuilder {
    this.rules = [];
    return this;
  }
}

/**
 * 创建验证规则构建器
 * Create validation rule builder
 */
export const createValidator = (t: TFunction): ValidationBuilder => {
  return new ValidationBuilder(t);
};

/**
 * 常用验证规则预设
 * Common validation rule presets
 */
export const ValidationPresets = {
  /**
   * 必填文本输入
   * Required text input
   */
  requiredText: (t: TFunction, fieldName?: string) =>
    createValidator(t).required(fieldName).build(),

  /**
   * 必选下拉框
   * Required select
   */
  requiredSelect: (t: TFunction, fieldName?: string) =>
    createValidator(t).requiredSelect(fieldName).build(),

  /**
   * 必填邮箱
   * Required email
   */
  requiredEmail: (t: TFunction, fieldName?: string) =>
    createValidator(t).required(fieldName).email().build(),

  /**
   * 必填手机号
   * Required phone
   */
  requiredPhone: (t: TFunction, fieldName?: string) =>
    createValidator(t).required(fieldName).phone().build(),

  /**
   * 必填密码
   * Required password
   */
  requiredPassword: (t: TFunction, minLength = 6, fieldName?: string) =>
    createValidator(t).required(fieldName).password(minLength).build(),

  /**
   * 可选邮箱
   * Optional email
   */
  optionalEmail: (t: TFunction) => createValidator(t).email().build(),

  /**
   * 可选手机号
   * Optional phone
   */
  optionalPhone: (t: TFunction) => createValidator(t).phone().build(),

  /**
   * 数字范围
   * Number range
   */
  numberRange: (t: TFunction, min: number, max: number, fieldName?: string) =>
    createValidator(t).numberRange(min, max, fieldName).build(),

  /**
   * 必填数字范围
   * Required number range
   */
  requiredNumberRange: (
    t: TFunction,
    min: number,
    max: number,
    fieldName?: string,
  ) =>
    createValidator(t)
      .required(fieldName)
      .numberRange(min, max, fieldName)
      .build(),

  /**
   * 文本长度限制
   * Text length limit
   */
  textLength: (t: TFunction, min: number, max: number, fieldName?: string) =>
    createValidator(t).lengthRange(min, max, fieldName).build(),

  /**
   * 必填文本长度限制
   * Required text with length limit
   */
  requiredTextLength: (
    t: TFunction,
    min: number,
    max: number,
    fieldName?: string,
  ) =>
    createValidator(t)
      .required(fieldName)
      .lengthRange(min, max, fieldName)
      .build(),
};

/**
 * 验证规则组合函数
 * Validation rule composition functions
 */
export const ValidationComposers = {
  /**
   * 组合多个验证规则
   * Combine multiple validation rules
   */
  combine: (...ruleArrays: ValidationRule[][]): ValidationRule[] => {
    return ruleArrays.reduce((acc, rules) => acc.concat(rules), []);
  },

  /**
   * 条件验证规则
   * Conditional validation rules
   */
  conditional: (
    condition: boolean,
    rules: ValidationRule[],
  ): ValidationRule[] => {
    return condition ? rules : [];
  },

  /**
   * 根据字段类型自动生成基础验证规则
   * Auto-generate basic validation rules based on field type
   */
  autoRules: (
    t: TFunction,
    fieldType:
      | 'input'
      | 'select'
      | 'email'
      | 'phone'
      | 'password'
      | 'number'
      | 'textarea',
    options: {
      required?: boolean;
      fieldName?: string;
      min?: number;
      max?: number;
      passwordMinLength?: number;
    } = {},
  ): ValidationRule[] => {
    const {
      required = false,
      fieldName,
      min,
      max,
      passwordMinLength = 6,
    } = options;
    const validator = createValidator(t);

    switch (fieldType) {
      case 'input':
      case 'textarea':
        if (required) validator.required(fieldName);
        if (min !== undefined && max !== undefined)
          validator.lengthRange(min, max, fieldName);
        else if (min !== undefined) validator.minLength(min, fieldName);
        else if (max !== undefined) validator.maxLength(max, fieldName);
        break;

      case 'select':
        if (required) validator.requiredSelect(fieldName);
        break;

      case 'email':
        if (required) validator.required(fieldName);
        validator.email();
        break;

      case 'phone':
        if (required) validator.required(fieldName);
        validator.phone();
        break;

      case 'password':
        if (required) validator.required(fieldName);
        validator.password(passwordMinLength);
        break;

      case 'number':
        if (required) validator.required(fieldName);
        if (min !== undefined && max !== undefined)
          validator.numberRange(min, max, fieldName);
        break;

      default:
        if (required) validator.required(fieldName);
        break;
    }

    return validator.build();
  },
};
