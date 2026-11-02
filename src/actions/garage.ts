"use server";

import { auth } from "@clerk/nextjs/server";
import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { savedConfigs, type SavedConfig } from "@/db/schema";

// payload schema for creating a new variation
export type CreateConfigInput = {
  name: string;
  modelType: string;
  configData: Record<string, unknown>;
  thumbnailUrl?: string;
  isPublic?: boolean;
  isLocked?: boolean;
};

// payload schema for updating an existing variation
export type UpdateConfigInput = {
  id: number;
  name?: string;
  configData?: Record<string, unknown>;
  thumbnailUrl?: string;
  isPublic?: boolean;
  isLocked?: boolean;
};

// generic action result response type
export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// maximum allowed saved configurations per user
const MAX_CONFIGS_PER_USER = 20;

// create a new saved configuration in the user garage
export async function saveNewConfig(
  input: CreateConfigInput
): Promise<ActionResult<{ id: number }>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized: Please sign in to save configurations" };
    }

    // check current total configurations against quota limit
    const [countResult] = await db
      .select({ total: count() })
      .from(savedConfigs)
      .where(eq(savedConfigs.clerkUserId, userId));

    const total = Number(countResult?.total ?? 0);
    if (total >= MAX_CONFIGS_PER_USER) {
      return {
        success: false,
        error: `Garage limit reached (maximum ${MAX_CONFIGS_PER_USER} builds). Please delete an older build to save a new one.`,
      };
    }

    const trimmedName = input.name.trim() || "Untitled Build";

    // insert new variation record into database
    const [inserted] = await db
      .insert(savedConfigs)
      .values({
        clerkUserId: userId,
        name: trimmedName,
        modelType: input.modelType,
        configData: input.configData,
        thumbnailUrl: input.thumbnailUrl || null,
        isPublic: input.isPublic ?? true,
        isLocked: input.isLocked ?? false,
      })
      .returning({ id: savedConfigs.id });

    revalidatePath("/garage");

    return { success: true, data: { id: inserted.id } };
  } catch (err) {
    console.error("Failed to save configuration:", err);
    return { success: false, error: "Failed to save configuration to garage" };
  }
}

// update an existing saved configuration
export async function updateConfig(
  input: UpdateConfigInput
): Promise<ActionResult<{ id: number }>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized: Please sign in to update configurations" };
    }

    // fetch existing record to verify ownership and lock state
    const [existing] = await db
      .select()
      .from(savedConfigs)
      .where(eq(savedConfigs.id, input.id));

    if (!existing) {
      return { success: false, error: "Configuration not found" };
    }

    if (existing.clerkUserId !== userId) {
      return { success: false, error: "Forbidden: You do not own this configuration" };
    }

    // prevent modifying locked builds unless unlocking is explicitly requested
    if (existing.isLocked && input.isLocked === undefined && input.configData) {
      return {
        success: false,
        error: "This configuration is locked. Unlock it in your garage settings before saving changes.",
      };
    }

    // update configuration values and timestamp
    await db
      .update(savedConfigs)
      .set({
        name: input.name !== undefined ? input.name.trim() || existing.name : existing.name,
        configData: input.configData ?? existing.configData,
        thumbnailUrl: input.thumbnailUrl !== undefined ? input.thumbnailUrl : existing.thumbnailUrl,
        isPublic: input.isPublic !== undefined ? input.isPublic : existing.isPublic,
        isLocked: input.isLocked !== undefined ? input.isLocked : existing.isLocked,
        updatedAt: new Date(),
      })
      .where(and(eq(savedConfigs.id, input.id), eq(savedConfigs.clerkUserId, userId)));

    revalidatePath("/garage");
    revalidatePath("/configurator");

    return { success: true, data: { id: input.id } };
  } catch (err) {
    console.error("Failed to update configuration:", err);
    return { success: false, error: "Failed to update configuration" };
  }
}

// delete a saved configuration from garage
export async function deleteConfig(
  configId: number
): Promise<ActionResult<null>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized: Please sign in to delete configurations" };
    }

    // delete record verifying owner authorization
    await db
      .delete(savedConfigs)
      .where(and(eq(savedConfigs.id, configId), eq(savedConfigs.clerkUserId, userId)));

    revalidatePath("/garage");

    return { success: true, data: null };
  } catch (err) {
    console.error("Failed to delete configuration:", err);
    return { success: false, error: "Failed to delete configuration" };
  }
}

// fork an existing configuration into the current user garage
export async function forkConfig(
  sourceId: number,
  customName?: string
): Promise<ActionResult<{ id: number }>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized: Please sign in to fork configurations" };
    }

    // check current total configurations against quota limit
    const [countResult] = await db
      .select({ total: count() })
      .from(savedConfigs)
      .where(eq(savedConfigs.clerkUserId, userId));

    const total = Number(countResult?.total ?? 0);
    if (total >= MAX_CONFIGS_PER_USER) {
      return {
        success: false,
        error: `Garage limit reached (maximum ${MAX_CONFIGS_PER_USER} builds). Please delete an older build to fork this one.`,
      };
    }

    // fetch source configuration
    const [source] = await db
      .select()
      .from(savedConfigs)
      .where(eq(savedConfigs.id, sourceId));

    if (!source) {
      return { success: false, error: "Source configuration not found" };
    }

    // verify public visibility or ownership
    if (!source.isPublic && source.clerkUserId !== userId) {
      return { success: false, error: "This configuration is private and cannot be copied" };
    }

    const forkName = customName?.trim() || `${source.name} (Copy)`;

    // insert cloned record under the active user account
    const [inserted] = await db
      .insert(savedConfigs)
      .values({
        clerkUserId: userId,
        name: forkName,
        modelType: source.modelType,
        configData: source.configData,
        thumbnailUrl: source.thumbnailUrl,
        isPublic: true,
        isLocked: false,
      })
      .returning({ id: savedConfigs.id });

    revalidatePath("/garage");

    return { success: true, data: { id: inserted.id } };
  } catch (err) {
    console.error("Failed to fork configuration:", err);
    return { success: false, error: "Failed to fork configuration" };
  }
}

// retrieve a configuration by identifier with access check
export async function getConfigById(
  configId: number
): Promise<ActionResult<{ config: SavedConfig; isOwner: boolean }>> {
  try {
    const { userId } = await auth();

    // fetch configuration by primary identifier
    const [config] = await db
      .select()
      .from(savedConfigs)
      .where(eq(savedConfigs.id, configId));

    if (!config) {
      return { success: false, error: "Configuration not found" };
    }

    const isOwner = Boolean(userId && config.clerkUserId === userId);

    // block access if private and visitor is not the owner
    if (!config.isPublic && !isOwner) {
      return { success: false, error: "This configuration is private" };
    }

    return { success: true, data: { config, isOwner } };
  } catch (err) {
    console.error("Failed to fetch configuration:", err);
    return { success: false, error: "Failed to load configuration" };
  }
}

