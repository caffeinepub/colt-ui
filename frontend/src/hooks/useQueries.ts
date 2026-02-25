import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Preferences } from '../backend';

export function useGetPreferences() {
  const { actor, isFetching } = useActor();

  return useQuery<Preferences | null>({
    queryKey: ['preferences'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPreferences();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSavePreferences() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lastActiveTab, accentColor }: { lastActiveTab: string; accentColor: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.savePreferences(lastActiveTab, accentColor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}

export function useSaveNotepad() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notepad: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveNotepad(notepad);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}
