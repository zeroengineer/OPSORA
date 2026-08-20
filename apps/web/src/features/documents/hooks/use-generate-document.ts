import type { GenerateFromTemplateInput, VaultFileDto } from "@opsora/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/services/api-client.ts";

function generateDocument(input: GenerateFromTemplateInput): Promise<VaultFileDto> {
  return apiClient.post<VaultFileDto>("/api/documents/vault/generate", input);
}

export function useGenerateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateDocument,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["documents", "vault"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
