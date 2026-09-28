import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const savedConfigs = pgTable("saved_configs", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  modelType: text("model_type").notNull(),
  configData: jsonb("config_data").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
