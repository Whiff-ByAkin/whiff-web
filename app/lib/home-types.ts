export type HomeVariant = "classic" | "city";
export type HomeSettings = {
  variant: HomeVariant;
  source: "default" | "environment" | "stored";
  editable: boolean;
  error?: string;
};
export function isHomeVariant(value: unknown): value is HomeVariant {
  return value === "classic" || value === "city";
}
/** An unset or mistyped setting never launches an unfinished page. */
export function homeVariantOverride(value = process.env.HOME_VARIANT): HomeVariant | undefined {
  return isHomeVariant(value) ? value : undefined;
}
