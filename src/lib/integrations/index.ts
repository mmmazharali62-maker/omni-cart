// Barrel: one import surface for the whole integrations system.
export * from "./types";
export { PROVIDERS, getProviderDef } from "./catalog";
export { encryptValue, decryptValue, encryptKeys, decryptKeys } from "./encrypt";
export { getStoredProvider, saveProviderKeys, clearProvider, markTested, resolveProviderConfig } from "./store";
export { computeProviderStatus, computeAllStatuses, overallReadiness, maskSecret } from "./status";
export { SETUP_ORDER, GO_LIVE_STEPS } from "./defaults";
export { saveKeysSchema, testProviderSchema, validFieldNames } from "./validation";
export { logIntegrationChange } from "./audit";



import { testConnection as testDatabase } from "./providers/database";
import { testConnection as testStripe } from "./providers/stripe";
import { testConnection as testCj } from "./providers/cj";
import { testConnection as testAliexpress } from "./providers/aliexpress";
import { testConnection as testAmazon } from "./providers/amazon";
import { testConnection as testEmail } from "./providers/email";
import { testConnection as testSms } from "./providers/twilio-sms";

export const TESTERS: Record<string, (keys: Record<string, string>) => Promise<{ ok: boolean; message: string }>> = {
  database: testDatabase,
  stripe: testStripe,
  cj: testCj,
  aliexpress: testAliexpress,
  amazon: testAmazon,
  email: testEmail,
  sms: testSms
};
