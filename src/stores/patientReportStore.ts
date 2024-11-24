import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PatientReport } from '../types';
import { db } from '../utils/db';

interface PatientReportState {
  reports: PatientReport[];
  loading: boolean;
  error: string | null;
  addReport: (data: Omit<PatientReport, 'id' | 'timestamp'>) => Promise<void>;
  updateReport: (id: string, data: Partial<PatientReport>) => Promise<void>;
  loadReports: () => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
}

export const usePatientReportStore = create<PatientReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      loading: false,
      error: null,
      addReport: async (data) => {
        try {
          const id = crypto.randomUUID();
          const newReport = {
            ...data,
            id,
            timestamp: Date.now(),
          };
          await db.add('reports', newReport);
          set((state) => ({
            reports: [...state.reports, newReport],
            error: null,
          }));
        } catch (error) {
          set({ error: 'Failed to add report' });
          throw error;
        }
      },
      updateReport: async (id, data) => {
        try {
          const report = get().reports.find((r) => r.id === id);
          if (!report) throw new Error('Report not found');

          const updatedReport = {
            ...report,
            ...data,
          };
          await db.put('reports', updatedReport);
          set((state) => ({
            reports: state.reports.map((r) =>
              r.id === id ? updatedReport : r
            ),
            error: null,
          }));
        } catch (error) {
          set({ error: 'Failed to update report' });
          throw error;
        }
      },
      loadReports: async () => {
        set({ loading: true });
        try {
          const reports = await db.getAll('reports');
          set({ reports, loading: false, error: null });
        } catch (error) {
          set({ loading: false, error: 'Failed to load reports' });
          throw error;
        }
      },
      deleteReport: async (id) => {
        try {
          await db.delete('reports', id);
          set((state) => ({
            reports: state.reports.filter((r) => r.id !== id),
            error: null,
          }));
        } catch (error) {
          set({ error: 'Failed to delete report' });
          throw error;
        }
      },
    }),
    {
      name: 'patient-report-storage',
    }
  )
);