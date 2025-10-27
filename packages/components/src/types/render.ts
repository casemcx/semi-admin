import type { SemiFormType } from './semi';

/** 支持智能渲染的字段类型 */
export type IntelligentRenderType =
  | 'image'
  | 'upload'
  | 'markdown'
  | 'date'
  | 'datetime'
  | 'select'
  | 'switch';

/** 检查字段类型是否支持智能渲染 */
export const isIntelligentRenderType = (
  type: SemiFormType | undefined,
): type is IntelligentRenderType => {
  if (!type) return false;

  const intelligentTypes: IntelligentRenderType[] = [
    'image',
    'upload',
    'markdown',
    'date',
    'datetime',
    'select',
    'switch',
  ];

  return intelligentTypes.includes(type as IntelligentRenderType);
};
