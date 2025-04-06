import { fetchUserBookmarks, getInitialFollowingArray, getInitialLikeArray, handleFollow, handleLikes, handleToogleBookmarks } from '@/lib/actions';
import { VideoType } from '@/lib/definitions';
import { persist, createJSONStorage } from 'zustand/middleware'
// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla';

export type SessionType = {
  email?:string | null | undefined;
  id?:string | null | undefined;
  image?:string | null | undefined;
  name?:string | null | undefined;
}

export type CounterState = {
  session: SessionType | null;
  likedVideos:Array<string>;
  bookmarked:VideoType[];
  likeCounts: Record<string, number>;  // Object to track likes per video
  following: Array<string>;
}

export type CounterActions = {
  setSession:(session:SessionType) => void;
  deleteSession:() => void;
  toggleLike: (videoId: string, userId: string) => void;
  togglefollow: (celebrityId: string, userId: string) => void;
  togglebookmark: (userId: string, video: VideoType) => void;
  fetchLikesCount?: (videoId: string) => void;
  setLikesCount:(videoId: string, count:number, userId:string) => void;
  setFollowing:(userId:string, celebrityId:string) => void;
  fetchBookmarked:(celebrityId:string) => void;
}

export type CounterStore = CounterState & CounterActions

export const initCounterStore = (): CounterState => {
  return {session:null, likedVideos: [], bookmarked: [], likeCounts:{}, following:[]}
}

export const defaultInitState: CounterState = {
  session:null,
  likedVideos: [],
  bookmarked: [],
  likeCounts:{},
  following:[]
}

export const createCounterStore = (initState: CounterState = defaultInitState) => {
  return createStore<CounterStore>()(persist((set, get) => ({
    ...initState,

    setSession:(user)=>{
      set(() => ({session:user}))
    },

    deleteSession:()=>{
      set(() => ({session:null}))
    },

    toggleLike: async (videoId, userId) => {
      const isLiked = get().likedVideos.includes(videoId);
      
      // Optimistically update state
      set((state) => ({
        likedVideos: isLiked ? state.likedVideos.filter((id) => id !== videoId) : [...state.likedVideos, videoId], // Add like
        likeCounts: {
          ...state.likeCounts,
          [videoId]: (state.likeCounts[videoId] || 0) + (isLiked ? -1 : 1), // Adjust like count
        },
      }));
  
      try {
        await handleLikes(videoId, userId);
      } catch (error) {
        console.error('Like/Unlike failed', error);
  
        // Revert state if request fails
        set((state) => ({
          likedVideos: isLiked ? [...state.likedVideos, videoId] : state.likedVideos.filter((id) => id !== videoId),
          likeCounts: {
            ...state.likeCounts,
            [videoId]: (state.likeCounts[videoId] || 0) - (isLiked ? -1 : 1),
          },
        }));
      }
    },

    setFollowing:async(userId, celebrityId)=>{
      try{
        const response:Array<string> = await getInitialFollowingArray(userId);
        const newUserId = celebrityId || '';

        set((state) => ({
          following: response?.includes(newUserId) ? [...state.following, celebrityId] : [...state.following],
        }));
      }catch(err){
        console.error('Failed to fetch like count', err);
      }
    },

    setLikesCount:async(videoId, count, userId)=>{
      set((state) => ({
        likeCounts: {
          ...state.likeCounts,
          [videoId]: count
        },
      }));
      try{
        const response:Array<string> = await getInitialLikeArray(videoId);
        const newUserId = userId || '';

        set((state) => ({
          likedVideos: response?.includes(newUserId) ? [...state.likedVideos, videoId] : [...state.likedVideos],
        }));
      }catch(err){
        console.error('Failed to fetch like count', err);
      }
    },

    togglefollow: async (celebrityId, userId) => {
      const isFollowing = get().following.includes(celebrityId);
      
      // Optimistically update state
      set((state) => ({
        following: isFollowing ? state.following.filter((id) => id !== celebrityId) : [...state.following, celebrityId], // Add like
      }));
  
      try {
        await handleFollow(celebrityId, userId);
      } catch (error) {
        console.error('follow/following', error);
  
        // Revert state if request fails
        set((state) => ({
          following: isFollowing ? [...state.following, celebrityId] : state.following.filter((id) => id !== celebrityId),
        }));
      }
    },

    fetchBookmarked:async(celebrityId)=>{
      try{
        const response:VideoType[] = await fetchUserBookmarks(celebrityId);
        set(() => ({
          bookmarked: [...response]
        }));
      }catch(err){
        console.error('Failed to fetch bookmarked', err);
      }
    },

    togglebookmark: async (userId, video) => {
      const isBookmarked = get().bookmarked.find((item:VideoType) => item._id == video?._id);
      
      // Optimistically update state
      set((state) => ({
        bookmarked: isBookmarked ? state.bookmarked.filter((item) => item._id !== video?._id) : [...state.bookmarked, video], // Add like
      }));
  
      try {
        await handleToogleBookmarks(userId, video?._id);
      } catch (error) {
        console.error('bookmark/unbookmarked', error);
  
        // Revert state if request fails
        set((state) => ({
          bookmarked: isBookmarked ? [...state.bookmarked, video] : state.bookmarked.filter((id) => id._id !== video?._id),
        }));
      }
    },

    /* fetchLikesCount: async (videoId) => {
      try {
        const { data } = await axios.get(`/api/like?videoId=${videoId}`);
        set((state) => ({
          likeCounts: { ...state.likeCounts, [videoId]: data.likesCount },
        }));
      } catch (error) {
        console.error('Failed to fetch like count', error);
      }
    }, */
  }),
  {
    name: 'vibesync', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), 
  })
)
}


/* 
import { create } from 'zustand';
import axios from 'axios';

interface LikeStore {
  likedVideos: string[];  // Array to track liked videos
  likeCounts: Record<string, number>;  // Object to track likes per video

  toggleLike: (videoId: string, userId: string) => void;
  fetchLikesCount: (videoId: string) => void;
}

export const useLikeStore = create<LikeStore>((set, get) => ({
  likedVideos: [],
  likeCounts: {},

  toggleLike: async (videoId, userId) => {
    const isLiked = get().likedVideos.includes(videoId);
    
    // Optimistically update state
    set((state) => ({
      likedVideos: isLiked
        ? state.likedVideos.filter((id) => id !== videoId) // Remove like
        : [...state.likedVideos, videoId], // Add like
      likeCounts: {
        ...state.likeCounts,
        [videoId]: (state.likeCounts[videoId] || 0) + (isLiked ? -1 : 1), // Adjust like count
      },
    }));

    try {
      await axios.post('/api/like', { videoId, userId });
    } catch (error) {
      console.error('Like/Unlike failed', error);

      // Revert state if request fails
      set((state) => ({
        likedVideos: isLiked ? [...state.likedVideos, videoId] : state.likedVideos.filter((id) => id !== videoId),
        likeCounts: {
          ...state.likeCounts,
          [videoId]: (state.likeCounts[videoId] || 0) - (isLiked ? -1 : 1),
        },
      }));
    }
  },

  fetchLikesCount: async (videoId) => {
    try {
      const { data } = await axios.get(`/api/like?videoId=${videoId}`);
      set((state) => ({
        likeCounts: { ...state.likeCounts, [videoId]: data.likesCount },
      }));
    } catch (error) {
      console.error('Failed to fetch like count', error);
    }
  },
}));

*/
