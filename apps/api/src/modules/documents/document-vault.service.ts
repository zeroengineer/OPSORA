import type {
  GenerateFromTemplateInput,
  ListVaultQuery,
  RegenerateInput,
  VaultFileDto,
  VaultFileVersionDto,
} from "@opsora/types";
import { renderTemplate, slugify } from "@opsora/utils";

import { getStorageAdapter } from "@/lib/storage.ts";
import { HttpError } from "@/lib/response.ts";

import { documentTemplatesRepository } from "./document-templates.repository.ts";
import { documentVaultRepository } from "./document-vault.repository.ts";

type VaultRow = Awaited<ReturnType<typeof documentVaultRepository.findAll>>[number];
type VaultVersionRow = Awaited<ReturnType<typeof documentVaultRepository.versionsFor>>[number];

function versionToDto(row: VaultVersionRow): VaultFileVersionDto {
  return {
    id: row.id,
    version: row.version,
    description: row.description,
    sizeBytes: row.sizeBytes,
    createdAt: row.createdAt.toISOString(),
  };
}

function toDto(row: VaultRow, versions: VaultVersionRow[]): VaultFileDto {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    source: row.source,
    clientName: row.clientName,
    linkedTo: row.linkedTo,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    currentVersion: row.currentVersion,
    sourceTemplateId: row.sourceTemplateId,
    variablesUsed: row.variablesUsed,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    versions: versions.map(versionToDto).sort((a, b) => b.version - a.version),
  };
}

export const documentVaultService = {
  async list(filters: ListVaultQuery): Promise<VaultFileDto[]> {
    const rows = await documentVaultRepository.findAll(filters);
    return rows.map((row) => toDto(row, []));
  },

  async getById(id: string): Promise<VaultFileDto> {
    const row = await documentVaultRepository.findById(id);
    if (!row) throw HttpError.notFound(`Document ${id} was not found`);

    const versions = await documentVaultRepository.versionsFor(id);
    return toDto(row, versions);
  },

  async download(id: string): Promise<{ data: Buffer; contentType: string; fileName: string }> {
    const row = await documentVaultRepository.findById(id);
    if (!row) throw HttpError.notFound(`Document ${id} was not found`);

    const stored = await getStorageAdapter().read(row.storageKey);
    return { data: stored.data, contentType: row.mimeType, fileName: row.name };
  },

  async generateFromTemplate(
    input: GenerateFromTemplateInput,
    userId: string,
  ): Promise<VaultFileDto> {
    const template = await documentTemplatesRepository.findById(input.templateId);
    if (!template) {
      throw HttpError.notFound(`Template ${input.templateId} was not found`);
    }

    const rendered = renderTemplate(template.body, input.variables);
    const buffer = Buffer.from(rendered, "utf-8");
    const id = crypto.randomUUID();
    const storageKey = `documents/${id}/1/${slugify(input.name) || "document"}.md`;

    await getStorageAdapter().save(storageKey, buffer, "text/markdown");

    const row = await documentVaultRepository.insert({
      id,
      name: input.name,
      category: template.category,
      source: "generated",
      clientName: input.clientName ?? null,
      linkedTo: input.clientName ? `Client · ${input.clientName}` : null,
      storageKey,
      mimeType: "text/markdown",
      sizeBytes: buffer.byteLength,
      sourceTemplateId: template.id,
      variablesUsed: input.variables,
      currentVersion: 1,
      createdBy: userId,
    });

    const version = await documentVaultRepository.insertVersion({
      documentFileId: id,
      version: 1,
      description: "Generated from template",
      storageKey,
      sizeBytes: buffer.byteLength,
      createdBy: userId,
    });

    return toDto(row, [version]);
  },

  async regenerate(
    id: string,
    input: RegenerateInput,
    userId: string,
  ): Promise<VaultFileDto> {
    const existing = await documentVaultRepository.findById(id);
    if (!existing) throw HttpError.notFound(`Document ${id} was not found`);

    if (existing.source !== "generated" || !existing.sourceTemplateId) {
      throw HttpError.badRequest("Only generated documents can be regenerated");
    }

    const template = await documentTemplatesRepository.findById(existing.sourceTemplateId);
    if (!template) throw HttpError.notFound("Source template no longer exists");

    const rendered = renderTemplate(template.body, input.variables);
    const buffer = Buffer.from(rendered, "utf-8");
    const nextVersion = existing.currentVersion + 1;
    const storageKey = `documents/${id}/${nextVersion}/${slugify(existing.name) || "document"}.md`;

    await getStorageAdapter().save(storageKey, buffer, "text/markdown");

    const row = await documentVaultRepository.updateCurrent(id, {
      storageKey,
      sizeBytes: buffer.byteLength,
      currentVersion: nextVersion,
      variablesUsed: input.variables,
    });
    if (!row) throw HttpError.notFound(`Document ${id} was not found`);

    // Record the version just produced, mirroring generateFromTemplate. The
    // prior version already wrote its own history row when it was created, so
    // snapshotting it here would duplicate it.
    await documentVaultRepository.insertVersion({
      documentFileId: id,
      version: nextVersion,
      description: "Regenerated from template",
      storageKey,
      sizeBytes: buffer.byteLength,
      createdBy: userId,
    });

    const versions = await documentVaultRepository.versionsFor(id);
    return toDto(row, versions);
  },

  async upload(
    input: { file: File; name: string; category: string; clientName?: string },
    userId: string,
  ): Promise<VaultFileDto> {
    const buffer = Buffer.from(await input.file.arrayBuffer());
    const id = crypto.randomUUID();
    const storageKey = `documents/${id}/1/${input.file.name || slugify(input.name)}`;

    await getStorageAdapter().save(
      storageKey,
      buffer,
      input.file.type || "application/octet-stream",
    );

    const row = await documentVaultRepository.insert({
      id,
      name: input.name,
      category: input.category,
      source: "uploaded",
      clientName: input.clientName ?? null,
      linkedTo: null,
      storageKey,
      mimeType: input.file.type || "application/octet-stream",
      sizeBytes: buffer.byteLength,
      sourceTemplateId: null,
      variablesUsed: null,
      currentVersion: 1,
      createdBy: userId,
    });

    const version = await documentVaultRepository.insertVersion({
      documentFileId: id,
      version: 1,
      description: "Uploaded",
      storageKey,
      sizeBytes: buffer.byteLength,
      createdBy: userId,
    });

    return toDto(row, [version]);
  },

  async recentGenerated(limit: number) {
    return documentVaultRepository.recentGenerated(limit);
  },
};
