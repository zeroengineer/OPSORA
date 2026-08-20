CREATE TYPE "public"."transaction_type" AS ENUM('in', 'out');--> statement-breakpoint
CREATE TYPE "public"."document_source" AS ENUM('generated', 'uploaded');--> statement-breakpoint
CREATE TABLE "finance_transaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "transaction_type" NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"amount_minor" integer NOT NULL,
	"occurred_on" timestamp NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"source" "document_source" NOT NULL,
	"client_name" text,
	"linked_to" text,
	"storage_key" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"source_template_id" uuid,
	"variables_used" jsonb,
	"current_version" integer DEFAULT 1 NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_file_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_file_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"description" text NOT NULL,
	"storage_key" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_template" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"body" text NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "finance_transaction" ADD CONSTRAINT "finance_transaction_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_file" ADD CONSTRAINT "document_file_source_template_id_document_template_id_fk" FOREIGN KEY ("source_template_id") REFERENCES "public"."document_template"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_file" ADD CONSTRAINT "document_file_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_file_version" ADD CONSTRAINT "document_file_version_document_file_id_document_file_id_fk" FOREIGN KEY ("document_file_id") REFERENCES "public"."document_file"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_file_version" ADD CONSTRAINT "document_file_version_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_template" ADD CONSTRAINT "document_template_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "finance_transaction_occurred_on_idx" ON "finance_transaction" USING btree ("occurred_on");--> statement-breakpoint
CREATE INDEX "finance_transaction_type_idx" ON "finance_transaction" USING btree ("type");--> statement-breakpoint
CREATE INDEX "document_file_category_idx" ON "document_file" USING btree ("category");--> statement-breakpoint
CREATE INDEX "document_file_source_idx" ON "document_file" USING btree ("source");--> statement-breakpoint
CREATE INDEX "document_file_version_file_idx" ON "document_file_version" USING btree ("document_file_id");