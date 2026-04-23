import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: '',
      user: null, // { id, email, role }
      hydrateDone: false,

      setSession: ({ token, user }) => set({ token, user }),
      clearSession: () => set({ token: '', user: null }),
      markHydrated: () => set({ hydrateDone: true }),
    }),
    {
      name: 'smart-study-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated?.();
      },
    }
  )
);

export default useAuthStore;

