export type Ctx = { params: Record<string, string>; type: 'samestate' | 'popstate' | 'pushstate' };

export interface HyperHTMLApplication {
  get(path: string, handler: (ctx: Ctx) => void): void;
  use(path: string | string[], handler: (ctx: Ctx, next: () => void) => void): void;
  delete(path: string, handler: (ctx: Ctx) => void): void;
  param(path: string, handler: (ctx: Ctx) => void): void;
  navigate(path: string, options?: { replace?: boolean; replaceState?: boolean }): void;
}

declare const hyperHTMLApp: { new (): HyperHTMLApplication };

export default hyperHTMLApp;
