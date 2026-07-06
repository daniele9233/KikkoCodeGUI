import type { Model } from "@opencode-ai/sdk/client";
import { useConfig } from "./config";
import { useProviders } from "./context";
import { useModelStore } from "@/stores/model.store";

/**
 * Does this model accept image input (vision)? Uses the 1.x SDK `Model`
 * capabilities shape (`capabilities.input.image` + `capabilities.attachment`).
 */
export function modelSupportsVision(model?: Pick<Model, "capabilities">): boolean {
  if (!model?.capabilities) return false;
  if (model.capabilities.input?.image) return true;
  return !!model.capabilities.attachment;
}

/**
 * Vision capability of the currently selected model. `known` is false when we
 * can't find the model in the provider catalog (so callers can stay quiet
 * instead of claiming "no vision" wrongly).
 */
export function useModelVision(): { known: boolean; vision: boolean } {
  const { data: config } = useConfig();
  const { data: providers = [] } = useProviders();
  const localSelected = useModelStore((s) => s.selected);

  const model = localSelected ?? config?.model ?? "";
  const slash = model.indexOf("/");
  const providerId = slash > 0 ? model.slice(0, slash) : "";
  const modelId = slash > 0 ? model.slice(slash + 1) : model;
  const m = providers.find((p) => p.id === providerId)?.models?.[modelId];

  return { known: !!m, vision: modelSupportsVision(m) };
}
