import React from 'react';
import { Plus, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Vehicle } from '../types';
import { useVehicleStore } from '../stores/vehicleStore';
import VehicleForm from '../components/VehicleForm';

export default function Vehicles() {
  const { vehicles, loadVehicles } = useVehicleStore();
  const [showForm, setShowForm] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={() => setSelectedVehicle(vehicle.id)}
          />
        ))}
      </div>

      {(showForm || selectedVehicle) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <VehicleForm
              initialData={vehicles.find(v => v.id === selectedVehicle)}
              onSuccess={() => {
                setShowForm(false);
                setSelectedVehicle(null);
                loadVehicles();
              }}
              onCancel={() => {
                setShowForm(false);
                setSelectedVehicle(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function VehicleCard({ vehicle, onEdit }: { vehicle: Vehicle; onEdit: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-500">{vehicle.registrationNo}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-gray-500"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium mr-2">Type:</span>
          {vehicle.type}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium mr-2">Call Sign:</span>
          {vehicle.callSign}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium mr-2">Year:</span>
          {vehicle.year}
        </div>
      </div>

      <div className="mt-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            vehicle.status === 'available'
              ? 'bg-green-100 text-green-800'
              : vehicle.status === 'dispatched'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {vehicle.status}
        </span>
      </div>

      {vehicle.location && (
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          <span>
            {vehicle.location.lat.toFixed(6)}, {vehicle.location.lng.toFixed(6)}
          </span>
        </div>
      )}
    </div>
  );
}</content></file>

<boltAction type="file" filePath="src/components/VehicleForm.tsx">import React from 'react';
import { useForm } from 'react-hook-form';
import { Vehicle } from '../types';
import { useVehicleStore } from '../stores/vehicleStore';

type VehicleFormData = Omit<Vehicle, 'id' | 'location'>;

interface VehicleFormProps {
  initialData?: Vehicle;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function VehicleForm({ initialData, onSuccess, onCancel }: VehicleFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<VehicleFormData>({
    defaultValues: initialData,
  });
  const { addVehicle, updateVehicle } = useVehicleStore();

  const onSubmit = async (data: VehicleFormData) => {
    try {
      if (initialData) {
        await updateVehicle(initialData.id, data);
      } else {
        await addVehicle(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            {...register('type', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="">Select type</option>
            <option value="ambulance">Ambulance</option>
            <option value="response">Response Vehicle</option>
            <option value="support">Support Vehicle</option>
          </select>
          {errors.type && (
            <span className="text-red-500 text-sm">Type is required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Registration No</label>
          <input
            type="text"
            {...register('registrationNo', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Call Sign</label>
          <input
            type="text"
            {...register('callSign', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Make</label>
          <input
            type="text"
            {...register('make', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            type="text"
            {...register('model', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="text"
            {...register('year', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        >
          <option value="available">Available</option>
          <option value="dispatched">Dispatched</option>
          <option value="maintenance">Maintenance</option>
        </select>
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
}</content></file>

<boltAction type="file" filePath="src/stores/vehicleStore.ts">import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Vehicle } from '../types';
import { db } from '../utils/db';

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  addVehicle: (data: Omit<Vehicle, 'id' | 'location'>) => Promise<void>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<void>;
  loadVehicles: () => Promise<void>;
  updateLocation: (id: string, lat: number, lng: number) => Promise<void>;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      loading: false,
      error: null,
      addVehicle: async (data) => {
        try {
          const id = crypto.randomUUID();
          const newVehicle = { ...data, id };
          await db.add('vehicles', newVehicle);
          set((state) => ({
            vehicles: [...state.vehicles, newVehicle],
            error: null,
          }));
        } catch (error) {
          set({ error: 'Failed to add vehicle' });
          throw error;
        }
      },
      updateVehicle: async (id, data) => {
        try {
          const updatedVehicle = { ...get().vehicles.find(v => v.id === id), ...data };
          await db.put('vehicles', updatedVehicle);
          set((state) => ({
            vehicles: state.vehicles.map(v => v.id === id ? updatedVehicle : v),
            error: null,
          }));
        } catch (error) {
          set({ error: 'Failed to update vehicle' });
          throw error;
        }
      },
      loadVehicles: async () => {
        set({ loading: true });
        try {
          const vehicles = await db.getAll('vehicles');
          set({ vehicles, loading: false, error: null });
        } catch (error) {
          set({ loading: false, error: 'Failed to load vehicles' });
          throw error;
        }
      },
      updateLocation: async (id, lat, lng) => {
        try {
          const vehicle = get().vehicles.find(v => v.id === id);
          if (!vehicle) throw new Error('Vehicle not found');
          
          const updatedVehicle = {
            ...vehicle,
            location: { lat, lng },
          };
          
          await db.put('vehicles', updatedVehicle);
          set((state) => ({
            vehicles: state.vehicles.map(v => v.id === id ? updatedVehicle : v),
            error: null,
          }));
        } catch (error) {
          set({ error: 'Failed to update vehicle location' });
          throw error;
        }
      },
    }),
    {
      name: 'vehicle-storage',
    }
  )
);</content></file>

<boltAction type="start">
<command>npm run dev</command>