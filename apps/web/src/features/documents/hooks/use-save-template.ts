import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTemplate, updateTemplate } from "@/features/documents/services/templates.service.ts";

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["documents", "templates"] });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; name?: string; category?: string; body?: string }) =>
      updateTemplate(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["documents", "templates"] });
    },
  });
}
