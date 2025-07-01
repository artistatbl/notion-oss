CREATE TABLE "collaboration_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"cursor_position" jsonb,
	"is_active" boolean DEFAULT true,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "database_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"database_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"filters" jsonb,
	"sorts" jsonb,
	"group_by" jsonb,
	"visible_properties" jsonb,
	"is_default" boolean DEFAULT false,
	"position" integer DEFAULT 0,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" jsonb NOT NULL,
	"properties" jsonb,
	"change_type" varchar(50) NOT NULL,
	"change_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_relations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_page_id" uuid NOT NULL,
	"to_page_id" uuid NOT NULL,
	"relation_type" varchar(50) NOT NULL,
	"property_name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blocks" ADD COLUMN "properties" jsonb;--> statement-breakpoint
ALTER TABLE "blocks" ADD COLUMN "is_toggled" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "blocks" ADD COLUMN "background_color" varchar(50);--> statement-breakpoint
ALTER TABLE "blocks" ADD COLUMN "text_color" varchar(50);--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "page_type" varchar(50) DEFAULT 'page';--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "database_type" varchar(50);--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "position" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "is_locked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "schema" jsonb;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "view_settings" jsonb;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "collaboration_sessions" ADD CONSTRAINT "collaboration_sessions_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_sessions" ADD CONSTRAINT "collaboration_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "database_views" ADD CONSTRAINT "database_views_database_id_notes_id_fk" FOREIGN KEY ("database_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "database_views" ADD CONSTRAINT "database_views_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_history" ADD CONSTRAINT "page_history_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_history" ADD CONSTRAINT "page_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_relations" ADD CONSTRAINT "page_relations_from_page_id_notes_id_fk" FOREIGN KEY ("from_page_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_relations" ADD CONSTRAINT "page_relations_to_page_id_notes_id_fk" FOREIGN KEY ("to_page_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collaboration_sessions_note_id_idx" ON "collaboration_sessions" USING btree ("note_id");--> statement-breakpoint
CREATE INDEX "collaboration_sessions_user_id_idx" ON "collaboration_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "collaboration_sessions_active_idx" ON "collaboration_sessions" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "collaboration_sessions_unique_idx" ON "collaboration_sessions" USING btree ("note_id","user_id","session_id");--> statement-breakpoint
CREATE INDEX "database_views_database_id_idx" ON "database_views" USING btree ("database_id");--> statement-breakpoint
CREATE INDEX "database_views_created_by_idx" ON "database_views" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "database_views_position_idx" ON "database_views" USING btree ("database_id","position");--> statement-breakpoint
CREATE INDEX "page_history_note_id_idx" ON "page_history" USING btree ("note_id");--> statement-breakpoint
CREATE INDEX "page_history_user_id_idx" ON "page_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "page_history_created_at_idx" ON "page_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "page_history_version_idx" ON "page_history" USING btree ("note_id","version");--> statement-breakpoint
CREATE INDEX "page_relations_from_page_idx" ON "page_relations" USING btree ("from_page_id");--> statement-breakpoint
CREATE INDEX "page_relations_to_page_idx" ON "page_relations" USING btree ("to_page_id");--> statement-breakpoint
CREATE INDEX "page_relations_type_idx" ON "page_relations" USING btree ("relation_type");--> statement-breakpoint
CREATE UNIQUE INDEX "page_relations_unique_idx" ON "page_relations" USING btree ("from_page_id","to_page_id","relation_type","property_name");--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_parent_id_notes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blocks_updated_at_idx" ON "blocks" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "notes_parent_id_idx" ON "notes" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "notes_page_type_idx" ON "notes" USING btree ("page_type");--> statement-breakpoint
CREATE INDEX "notes_slug_idx" ON "notes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "notes_position_idx" ON "notes" USING btree ("folder_id","parent_id","position");