import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { initBackgroundFetch, stopBackgroundFetch } from "~/utils/wishlist";

interface WishlistState {
  notificationEnabled: boolean;
  enableNotification: () => Promise<void>;
  disableNotification: () => Promise<void>;
  skinIds: string[];
  toggleSkin: (uuid: string) => void;
}
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      notificationEnabled: false,
      enableNotification: async () => {
        await initBackgroundFetch();
        set({ notificationEnabled: true });
      },
      disableNotification: async () => {
        await stopBackgroundFetch();
        set({ notificationEnabled: false });
      },
      skinIds: [],
      toggleSkin: (uuid: string) =>
        set({
          skinIds: get().skinIds.includes(uuid)
            ? get().skinIds.filter((el) => el !== uuid)
            : [...get().skinIds, uuid],
        }),
    }),
    {
      name: "wishlist",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
