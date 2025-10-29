declare module 'vditor' {
  export type VditorOptions = Record<string, unknown>;

  export default class Vditor {
    constructor(id: string, options?: VditorOptions);

    static preview(
      element: HTMLElement,
      markdown: string,
      options?: VditorOptions,
    ): void;

    setValue(value: string): void;

    destroy(): void;
  }
}
