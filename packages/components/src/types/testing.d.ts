import '@testing-library/jest-dom';

declare module '@rstest/core' {
  interface Assertion<T> {
    toBeInTheDocument(): void;
    toBeVisible(): void;
    toBeEmptyDOMElement(): void;
    toBeEnabled(): void;
    toBeDisabled(): void;
    toBeRequired(): void;
    toBeInvalid(): void;
    toBeValid(): void;
    toHaveValue(value?: string | string[] | number | null): void;
    toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): void;
    toBeChecked(): void;
    toBePartiallyChecked(): void;
    toHaveDescription(text?: string | RegExp): void;
    toHaveErrorMessage(text?: string | RegExp): void;
    toHaveAttribute(attr: string, value?: unknown): void;
    toHaveClass(...classNames: string[]): void;
    toHaveFocus(): void;
    toHaveFormValues(expectedValues: Record<string, unknown>): void;
    toHaveStyle(css: string | Record<string, unknown>): void;
    toHaveTextContent(
      text: string | RegExp,
      options?: { normalizeWhitespace: boolean },
    ): void;
    toHaveAccessibleDescription(text?: string | RegExp): void;
    toHaveAccessibleErrorMessage(text?: string | RegExp): void;
    toHaveAccessibleName(text?: string | RegExp): void;
    toContainElement(element: HTMLElement | null): void;
    toContainHTML(htmlText: string): void;
  }
}
