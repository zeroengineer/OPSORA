export type DocumentSource = "generated" | "uploaded";

export interface TemplateDto {
  id: string;
  name: string;
  category: string;
  version: number;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  category: string;
  body: string;
}

export interface UpdateTemplateInput {
  name?: string;
  category?: string;
  body?: string;
}

export interface VaultFileVersionDto {
  id: string;
  version: number;
  description: string;
  sizeBytes: number;
  createdAt: string;
}

export interface VaultFileDto {
  id: string;
  name: string;
  category: string;
  source: DocumentSource;
  clientName: string | null;
  linkedTo: string | null;
  mimeType: string;
  sizeBytes: number;
  currentVersion: number;
  sourceTemplateId: string | null;
  variablesUsed: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
  versions: VaultFileVersionDto[];
}

export interface ListVaultQuery {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface GenerateFromTemplateInput {
  templateId: string;
  name: string;
  clientName?: string;
  variables: Record<string, string>;
}

export interface RegenerateInput {
  variables: Record<string, string>;
}
