import { pgTable, serial, text, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

// saved product configurations table schema
export const savedConfigs = pgTable("saved_configs", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  name: text("name").notNull().default("Untitled Build"),
  modelType: text("model_type").notNull(),
  configData: jsonb("config_data").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isPublic: boolean("is_public").notNull().default(true),
  isLocked: boolean("is_locked").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// saved configuration record type
export type SavedConfig = typeof savedConfigs.$inferSelect;

// new configuration insertion type
export type NewSavedConfig = typeof savedConfigs.$inferInsert;
