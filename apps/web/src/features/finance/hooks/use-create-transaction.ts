import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTransaction } from "@/features/finance/services/finance.service.ts";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["finance"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
