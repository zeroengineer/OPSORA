import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./users.ts";

export const transactionTypeEnum = pgEnum("transaction_type", ["in", "out"]);

/**
 * A single-workspace ledger of income/expense entries. Amounts are stored
 * as positive integer minor units (cents) — sign is derived from `type`.
 */
export const financeTransaction = pgTable(
  "finance_transaction",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: transactionTypeEnum("type").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    amountMinor: integer("amount_minor").notNull(),
    occurredOn: timestamp("occurred_on", { mode: "date" }).notNull(),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("finance_transaction_occurred_on_idx").on(table.occurredOn),
    index("finance_transaction_type_idx").on(table.type),
  ],
);

export type FinanceTransaction = typeof financeTransaction.$inferSelect;
export type NewFinanceTransaction = typeof financeTransaction.$inferInsert;
