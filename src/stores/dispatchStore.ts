import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface Dispatch {
  id: string;
  staffId: string;
  vehicleId: string;
  patientId: string;
  location: Location;
  status: 'pending' | 'en-route' | 'on-scene' | 'completed';
  timestamp: number;
}

interface DispatchState {
  dispatches: Dispatch[];
  activeDispatch: Dispatch | null;
  createDispatch: (dispatch: Omit<Dispatch, 'id' | 'timestamp'>) => void;
  updateDispatchStatus: (id: string, status: Dispatch['status']) => void;
}

export const useDispatchStore = create<DispatchState>()(
  persist(
    (set, get) => ({
      dispatches: [],
      activeDispatch: null,
      createDispatch: (dispatchData) => {
        const newDispatch = {
          ...dispatchData,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        set((state) => ({
          dispatches: [...state.dispatches, newDispatch],
          activeDispatch: newDispatch,
        }));
      },
      updateDispatchStatus: (id, status) => {
        set((state) => ({
          dispatches: state.dispatches.map((d) =>
            d.id === id ? { ...d, status } : d
          ),
        }));
      },
    }),
    {
      name: 'dispatch-storage',
    }
  )
);