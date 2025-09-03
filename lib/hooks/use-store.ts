import { useStore as useZustandStore, StoreApi } from "zustand";

export function useStore<T>(
  store: StoreApi<T>,
  selector: (state: T) => unknown
) {
  if (!store) {
    throw new Error("Store is not defined");
  }
  return useZustandStore(store, selector);
}
