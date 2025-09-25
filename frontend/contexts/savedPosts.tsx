import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlaceResult } from '../utils/types/places_api_types';

interface SavedPostsContextType {
  savedPosts: PlaceResult[];
  savePost: (post: PlaceResult) => Promise<void>;
  unsavePost: (placeId: string) => Promise<void>;
  isPostSaved: (placeId: string) => boolean;
  clearSavedPosts: () => Promise<void>;
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

const STORAGE_KEY = 'saved_posts';

export const SavedPostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState<PlaceResult[]>([]);

  // Load saved posts from storage on mount
  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPosts) {
        setSavedPosts(JSON.parse(storedPosts));
      }
    } catch (error) {
      console.error('Error loading saved posts:', error);
    }
  };

  const savePost = async (post: PlaceResult) => {
    try {
      const updatedPosts = [...savedPosts, post];
      setSavedPosts(updatedPosts);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const unsavePost = async (placeId: string) => {
    try {
      const updatedPosts = savedPosts.filter(post => post.place_id !== placeId);
      setSavedPosts(updatedPosts);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const isPostSaved = (placeId: string): boolean => {
    return savedPosts.some(post => post.place_id === placeId);
  };

  const clearSavedPosts = async () => {
    try {
      setSavedPosts([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing saved posts:', error);
    }
  };

  const value: SavedPostsContextType = {
    savedPosts,
    savePost,
    unsavePost,
    isPostSaved,
    clearSavedPosts,
  };

  return (
    <SavedPostsContext.Provider value={value}>
      {children}
    </SavedPostsContext.Provider>
  );
};

export const useSavedPosts = () => {
  const context = useContext(SavedPostsContext);
  if (context === undefined) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
};

