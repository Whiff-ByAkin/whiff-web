export const CTA_LABELS = { begin: "Get the app", seat: "Get the app" } as const;
export type CtaVariant = keyof typeof CTA_LABELS;

export function AskLabel() {
  return <>Get the app</>;
}
