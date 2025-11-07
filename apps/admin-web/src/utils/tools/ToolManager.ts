import type { IToolManager } from '@/types/tools';

/**
 * 工具管理器类
 * 用于统一管理各种工具实例
 */
export class ToolManager implements IToolManager {
  /** 工具存储容器 */
  private tools: Map<string, any> = new Map();

  /** 单例实例 */
  private static instance: ToolManager;

  /**
   * 获取单例实例
   * @returns ToolManager实例
   */
  static getInstance(): ToolManager {
    if (!ToolManager.instance) {
      ToolManager.instance = new ToolManager();
    }
    return ToolManager.instance;
  }

  /**
   * 私有构造函数，确保单例模式
   */
  private constructor() {}

  /**
   * 注册工具
   * @param name 工具名称
   * @param tool 工具实例
   */
  registerTool(name: string, tool: any): void {
    if (this.tools.has(name)) {
      console.warn(`工具 "${name}" 已存在，将被覆盖`);
    }
    this.tools.set(name, tool);
    console.log(`工具 "${name}" 注册成功`);
  }

  /**
   * 获取工具
   * @param name 工具名称
   * @returns 工具实例或null
   */
  getTool<T = any>(name: string): T | null {
    const tool = this.tools.get(name);
    if (!tool) {
      console.warn(`工具 "${name}" 不存在`);
      return null;
    }
    return tool as T;
  }

  /**
   * 移除工具
   * @param name 工具名称
   * @returns 是否移除成功
   */
  removeTool(name: string): boolean {
    const existed = this.tools.has(name);
    if (existed) {
      this.tools.delete(name);
      console.log(`工具 "${name}" 已移除`);
    } else {
      console.warn(`工具 "${name}" 不存在，无法移除`);
    }
    return existed;
  }

  /**
   * 列出所有已注册的工具
   * @returns 工具名称数组
   */
  listTools(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * 清空所有工具
   */
  clear(): void {
    this.tools.clear();
    console.log('所有工具已清空');
  }

  /**
   * 检查工具是否存在
   * @param name 工具名称
   * @returns 是否存在
   */
  hasTool(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * 获取已注册工具的数量
   * @returns 工具数量
   */
  getToolCount(): number {
    return this.tools.size;
  }
}
