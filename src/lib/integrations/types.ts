// Shared types for the integrations system (spec section 17/19).
export type FieldType = "secret" | "text" | "select";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: string[]; // for select fields
};

export type ProviderDef = {
  id: string; // slug used in URLs + db
  label: string;
  category: "database" | "payments" | "supplier" | "notifications";
  description: string;
  docsPath: string; // in-repo setup guide
  docsUrl?: string; // external docs
  fields: FieldDef[];
  webhooks?: { label: string; path: string }[]; // webhook URLs to register
  envFallback?: Record<string, string>; // env var names that override stored keys
};

export type TestResult = { ok: boolean; message: string };

export type ProviderStatus = {
  provider: string;
  label: string;
  category: ProviderDef["category"];
  ready: boolean; // all required fields saved
  active: boolean;
  missing: string[]; // required field labels not yet saved
  lastTestedAt: string | null;
  lastTestStatus: "ok" | "fail" | null;
  lastTestMessage: string | null;
};
