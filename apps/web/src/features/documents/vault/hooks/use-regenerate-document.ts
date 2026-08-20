import type { RegenerateInput } from "@opsora/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { regenerateDocument } from "@/features/documents/vault/services/vault.service.ts";

export function useRegenerateDocument(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegenerateInput) => regenerateDocument(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["documents", "vault"] });
    },
  });
}
