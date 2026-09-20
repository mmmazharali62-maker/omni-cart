import { cjDropshipping } from "./cj-dropshipping";
import { aliExpress } from "./aliexpress";
import { amazon } from "./amazon";
import type { SupplierConnector } from "./types";

export const suppliers: Record<string, SupplierConnector> = {
  CJ_DROPSHIPPING: cjDropshipping,
  ALIEXPRESS: aliExpress,
  AMAZON: amazon
};

export function getSupplierConnector(name: string): SupplierConnector {
  const connector = suppliers[name];
  if (!connector) throw new Error(`Unknown supplier connector: ${name}`);
  return connector;
}
