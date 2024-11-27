import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { loadPredefinedGames } from '../services/games/gamesLoader';
import { useContentState } from './useContentState';
import type { Content } from '../types/content';

export function useContent() {
  const { contents, setContents } = useContentState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listContent = async (params?: {
    type?: string;
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // In development, use predefined games
      if (import.meta.env.DEV) {
        const games = await loadPredefinedGames();
        setContents(games);
        return games;
      }

      const { data } = await api.get('/api/content', { params });
      setContents(data.data);
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch content';
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createContent = async (contentData: Partial<Content>) => {
    try {
      setIsLoading(true);
      setError(null);

      if (import.meta.env.DEV) {
        const newContent = {
          id: Date.now().toString(),
          ...contentData,
          status: 'published' as const,
          version: 1,
          createdBy: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        } as Content;

        setContents(prev => [...prev, newContent]);
        return newContent;
      }

      const { data } = await api.post('/api/content', contentData);
      setContents(prev => [...prev, data.data]);
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create content';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (id: string, contentData: Partial<Content>) => {
    try {
      setIsLoading(true);
      setError(null);

      if (import.meta.env.DEV) {
        const updatedContent = {
          ...contents.find(c => c.id === id),
          ...contentData,
          updatedAt: new Date()
        } as Content;

        setContents(prev => prev.map(c => c.id === id ? updatedContent : c));
        return updatedContent;
      }

      const { data } = await api.put(`/api/content/${id}`, contentData);
      setContents(prev => prev.map(c => c.id === id ? data.data : c));
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update content';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContent = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (import.meta.env.DEV) {
        setContents(prev => prev.filter(c => c.id !== id));
        return;
      }

      await api.delete(`/api/content/${id}`);
      setContents(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete content';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial content including games
  useEffect(() => {
    listContent();
  }, []);

  return {
    contents,
    listContent,
    createContent,
    updateContent,
    deleteContent,
    isLoading,
    error
  };
}