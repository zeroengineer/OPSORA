import type { CreateTemplateInput, TemplateDto, UpdateTemplateInput } from "@opsora/types";

import { HttpError } from "@/lib/response.ts";

import { documentTemplatesRepository } from "./document-templates.repository.ts";

function toDto(
  row: Awaited<ReturnType<typeof documentTemplatesRepository.findAll>>[number],
): TemplateDto {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    version: row.version,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const documentTemplatesService = {
  async list(): Promise<TemplateDto[]> {
    const rows = await documentTemplatesRepository.findAll();
    return rows.map(toDto);
  },

  async getById(id: string): Promise<TemplateDto> {
    const row = await documentTemplatesRepository.findById(id);
    if (!row) throw HttpError.notFound(`Template ${id} was not found`);
    return toDto(row);
  },

  async create(input: CreateTemplateInput, userId: string): Promise<TemplateDto> {
    const row = await documentTemplatesRepository.insert({ ...input, createdBy: userId });
    return toDto(row);
  },

  async update(id: string, input: UpdateTemplateInput): Promise<TemplateDto> {
    const existing = await documentTemplatesRepository.findById(id);
    if (!existing) throw HttpError.notFound(`Template ${id} was not found`);

    const row = await documentTemplatesRepository.update(id, input, existing.version + 1);
    if (!row) throw HttpError.notFound(`Template ${id} was not found`);
    return toDto(row);
  },
};
