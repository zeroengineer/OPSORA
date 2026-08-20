export interface SearchResultItem {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
}

export interface SearchResultGroup {
  category: "Finance Ledger" | "Templates" | "Document Vault";
  results: SearchResultItem[];
}

export interface SearchResponse {
  groups: SearchResultGroup[];
}
