"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { getConfigById } from "@/actions/garage";
import { useConfiguratorStore, type ConfiguratorModel } from "@/stores/useConfiguratorStore";

// automatic configuration data loader component based on url query
export default function ConfigDataLoader() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const modelParam = searchParams.get("model") as ConfiguratorModel | null;

  const loadConfigSnapshot = useConfiguratorStore((s) => s.loadConfigSnapshot);
  const setActiveConfig = useConfiguratorStore((s) => s.setActiveConfig);
  const lastLoadedIdRef = useRef<number | null>(null);

  // fetch and hydrate configuration when identifier query parameter changes
  useEffect(() => {
    if (!idParam) {
      setActiveConfig({ id: null, name: null, isOwner: false, isLocked: false });
      lastLoadedIdRef.current = null;
      return;
    }

    const configId = Number(idParam);
    if (isNaN(configId) || configId === lastLoadedIdRef.current) return;

    // asynchronous fetch from server action
    const fetchConfig = async () => {
      try {
        const result = await getConfigById(configId);

        if (!result.success || !result.data) {
          toast.error(result.error || "Unable to load saved variation");
          return;
        }

        const { config, isOwner } = result.data;
        const targetModel = (modelParam || config.modelType) as ConfiguratorModel;

        loadConfigSnapshot(targetModel, config.configData as Record<string, unknown>);
        setActiveConfig({
          id: config.id,
          name: config.name,
          isOwner,
          isLocked: config.isLocked,
        });

        lastLoadedIdRef.current = configId;
        toast.success(`Loaded "${config.name}"`, { id: "load-config-toast" });
      } catch (err) {
        console.error("Configuration hydration failed:", err);
        toast.error("Failed to load configuration", { id: "load-config-toast" });
      }
    };

    fetchConfig();
  }, [idParam, modelParam, loadConfigSnapshot, setActiveConfig]);

  return null;
}

