import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BackgroundStyle,
  CursorStyle,
  FontStyle,
  Preferences,
  TabCloakPreset,
} from "../backend";
import { useActor } from "./useActor";

export function useGetPreferences() {
  const { actor, isFetching } = useActor();

  return useQuery<Preferences | null>({
    queryKey: ["preferences"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPreferences();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePreferences() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefs: {
      lastActiveTab: string;
      accentColor: string;
      cursorStyle: CursorStyle;
      backgroundStyle: BackgroundStyle;
      fontStyle: FontStyle;
      cloakPreset: TabCloakPreset;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.savePreferences(
        prefs.lastActiveTab,
        prefs.accentColor,
        prefs.cursorStyle,
        prefs.backgroundStyle,
        prefs.fontStyle,
        prefs.cloakPreset,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
  });
}

export function useSaveNotepad() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notepad: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveNotepad(notepad);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
  });
}

export function useGetCCoins() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ["ccoins"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return await actor.getCCoins();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSpendCCoins() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint): Promise<boolean> => {
      if (!actor) throw new Error("Actor not available");
      return await actor.spendCCoins(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ccoins"] });
      queryClient.refetchQueries({ queryKey: ["ccoins"] });
    },
  });
}

export function useAddCCoins() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint): Promise<void> => {
      // addCCoins accepts anonymous callers — no auth check required
      if (!actor) throw new Error("Actor not available");
      await actor.addCCoins(amount);
    },
    onSuccess: () => {
      // Invalidate AND immediately refetch so the balance updates in the Store tab
      queryClient.invalidateQueries({ queryKey: ["ccoins"] });
      queryClient.refetchQueries({ queryKey: ["ccoins"] });
    },
  });
}

export function useGetPurchasedEffects() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ["purchasedEffects"],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getPurchasedEffects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetPurchasedEffects() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (effects: string[]): Promise<string[]> => {
      if (!actor) throw new Error("Actor not available");
      await actor.setPurchasedEffects(effects);
      return effects;
    },
    onSuccess: (effects: string[]) => {
      // Optimistically update the cache immediately so App.tsx re-renders
      queryClient.setQueryData(["purchasedEffects"], effects);
      queryClient.invalidateQueries({ queryKey: ["purchasedEffects"] });
      queryClient.refetchQueries({ queryKey: ["purchasedEffects"] });
    },
  });
}
