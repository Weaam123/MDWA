import React from 'react';
import { useForm } from 'react-hook-form';
import { PatientReport } from '../types';
import { usePatientReportStore } from '../stores/patientReportStore';

type PatientReportFormData = Omit<PatientReport, 'id' | 'timestamp'>;

interface PatientReportFormProps {
  initialData?: PatientReport;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PatientReportForm({
  initialData,
  onSuccess,
  onCancel,
}: PatientReportFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PatientReportFormData>({
    defaultValues: initialData,
  });
  const { addReport, updateReport } = usePatientReportStore();

  const onSubmit = async (data: PatientReportFormData) => {
    try {
      if (initialData) {
        await updateReport(initialData.id, data);
      } else {
        await addReport(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient ID</label>
          <input
            type="text"
            {...register('patientId', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
          {errors.patientId && (
            <span className="text-red-500 text-sm">Patient ID is required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Care Level</label>
          <select
            {...register('careLevel', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="">Select level</option>
            <option value="ALS">Advanced Life Support</option>
            <option value="ILS">Intermediate Life Support</option>
            <option value="BLS">Basic Life Support</option>
          </select>
          {errors.careLevel && (
            <span className="text-red-500 text-sm">Care level is required</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Clinical Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
            <input
              type="text"
              {...register('clinicalInfo.vitals.bp')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pulse</label>
            <input
              type="text"
              {...register('clinicalInfo.vitals.pulse')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Temperature</label>
            <input
              type="text"
              {...register('clinicalInfo.vitals.temp')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SpO2</label>
            <input
              type="text"
              {...register('clinicalInfo.vitals.spo2')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          {initialData ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}