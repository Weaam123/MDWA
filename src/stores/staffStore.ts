import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Staff } from '../types';
import { db } from '../utils/db';

interface StaffState {
  staff: Staff[];
  loading: boolean;
  error: string | null;
  addStaff: (data: Omit<Staff, 'id'>) => Promise<void>;
  updateStaff: (id: string, data: Partial<Staff>) => Promise<void>;
  loadStaff: () => Promise<void>;
}

export const useStaffStore = create<StaffState>()(
  persist(
    (set, get) => ({
      staff: [],
      loading: false,
      error: null,
      addStaff: async (data) => {
        try {
          const id = crypto.randomUUID();
          const newStaff = { ...data, id };
          await db.add('staff', newStaff);
          set((state) => ({
            staff: [...state.staff, newStaff],
            error: null,
          }));
        } catch (error) {
          set({ error: 'Failed to add staff member' });
          throw error;
        }
      },
      updateStaff: async (id, data) => {
        try {
          const updatedStaff = { ...get().staff.find(s => s.id === id), ...data };
          await db.put('staff', updatedStaff);
          set((state) => ({
            staff: state.staff.map(s => s.id === id ? updatedStaff : s),
            error: null,
          }));
        } catch (error) {
          set({ error: 'Failed to update staff member' });
          throw error;
        }
      },
      loadStaff: async () => {
        set({ loading: true });
        try {
          const staff = await db.getAll('staff');
          set({ staff, loading: false, error: null });
        } catch (error) {
          set({ loading: false, error: 'Failed to load staff' });
          throw error;
        }
      },
    }),
    {
      name: 'staff-storage',
    }
  )
);