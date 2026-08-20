import { useQuery } from "@tanstack/react-query";

import { fetchTemplates } from "@/features/documents/services/templates.service.ts";

export function useTemplates() {
  return useQuery({ queryKey: ["documents", "templates"], queryFn: fetchTemplates });
}
