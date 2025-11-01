import { fetchUserBookmarks, getInitialFollowingArray, handleFollow, handleToogleBookmarks } from '@/lib/actions';
import { VideoType } from '@/types/definitions.types';
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla';

export type SessionType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
};

export type CounterState = {
  session: SessionType | null;
  bookmarked:VideoType[];
  following: Array<string>;
}

export type CounterActions = {
  setSession:(session:SessionType) => void;
  deleteSession:() => void;
  togglefollow: (celebrityId: string, userId: string) => void;
  togglebookmark: (userId: string, video: VideoType) => void;
  setFollowing:(userId:string, celebrityId:string) => void;
  fetchBookmarked:(celebrityId:string) => void;
}

export type CounterStore = CounterState & CounterActions

export const initCounterStore = (): CounterState => {
  return {session:null, bookmarked: [], following:[]}
}

export const defaultInitState: CounterState = {
  session:null,
  bookmarked: [],
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
  }),
  {
    name: 'vibesync', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), 
  })
)
}
