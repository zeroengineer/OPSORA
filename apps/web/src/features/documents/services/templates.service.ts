import type { CreateTemplateInput, TemplateDto, UpdateTemplateInput } from "@opsora/types";

import { apiClient } from "@/services/api-client.ts";

export function fetchTemplates(): Promise<TemplateDto[]> {
  return apiClient.get<TemplateDto[]>("/api/documents/templates");
}

export function createTemplate(input: CreateTemplateInput): Promise<TemplateDto> {
  return apiClient.post<TemplateDto>("/api/documents/templates", input);
}

export function updateTemplate(id: string, input: UpdateTemplateInput): Promise<TemplateDto> {
  return apiClient.patch<TemplateDto>(`/api/documents/templates/${id}`, input);
}
