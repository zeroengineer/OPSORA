import { db, ilike, or, schema } from "@opsora/database";
import type { SearchResponse, SearchResultGroup } from "@opsora/types";
import { ROUTES } from "@opsora/config";
import { formatCurrency } from "@opsora/utils";

const { documentFile, documentTemplate, financeTransaction } = schema;
const RESULT_LIMIT = 5;

/**
 * Fans out across the domains that actually have real data (Finance,
 * Documents). No Clients/Deals/Invoices groups — those domains don't
 * exist yet, and a fake result group would be worse than none.
 */
export const searchService = {
  async search(term: string): Promise<SearchResponse> {
    if (term.trim().length === 0) return { groups: [] };

    const like = `%${term}%`;

    const [transactions, templates, vaultFiles] = await Promise.all([
      db
        .select()
        .from(financeTransaction)
        .where(or(ilike(financeTransaction.description, like), ilike(financeTransaction.category, like)))
        .limit(RESULT_LIMIT),
      db
        .select()
        .from(documentTemplate)
        .where(or(ilike(documentTemplate.name, like), ilike(documentTemplate.category, like)))
        .limit(RESULT_LIMIT),
      db
        .select()
        .from(documentFile)
        .where(or(ilike(documentFile.name, like), ilike(documentFile.clientName, like)))
        .limit(RESULT_LIMIT),
    ]);

    const groups: SearchResultGroup[] = [];

    if (transactions.length > 0) {
      groups.push({
        category: "Finance Ledger",
        results: transactions.map((row) => ({
          id: row.id,
          label: row.description,
          sublabel: `${row.category} · ${formatCurrency(row.amountMinor)}`,
          href: ROUTES.finance,
        })),
      });
    }

    if (templates.length > 0) {
      groups.push({
        category: "Templates",
        results: templates.map((row) => ({
          id: row.id,
          label: row.name,
          sublabel: `${row.category} · V${String(row.version)}`,
          href: ROUTES.documents,
        })),
      });
    }

    if (vaultFiles.length > 0) {
      groups.push({
        category: "Document Vault",
        results: vaultFiles.map((row) => ({
          id: row.id,
          label: row.name,
          sublabel: row.clientName ?? row.category,
          href: ROUTES.documentVault,
        })),
      });
    }

    return { groups };
  },
};
