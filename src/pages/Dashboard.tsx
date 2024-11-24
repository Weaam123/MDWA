import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { useDispatchStore } from '../stores/dispatchStore';
import { Activity, Users, Ambulance, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const dispatches = useDispatchStore((state) => state.dispatches);
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => ({
      activeDispatches: dispatches.filter(d => d.status !== 'completed').length,
      availableStaff: 12,
      availableVehicles: 8,
      pendingReports: 5
    })
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Dispatches"
          value={stats?.activeDispatches}
          icon={Activity}
          color="text-blue-600"
        />
        <StatCard
          title="Available Staff"
          value={stats?.availableStaff}
          icon={Users}
          color="text-green-600"
        />
        <StatCard
          title="Available Vehicles"
          value={stats?.availableVehicles}
          icon={Ambulance}
          color="text-yellow-600"
        />
        <StatCard
          title="Pending Reports"
          value={stats?.pendingReports}
          icon={AlertCircle}
          color="text-red-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4 h-[500px]">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {dispatches.map((dispatch) => (
            <Marker
              key={dispatch.id}
              position={[dispatch.location.lat, dispatch.location.lng]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">Dispatch #{dispatch.id}</h3>
                  <p>Status: {dispatch.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value?: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-full bg-opacity-10`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <p className="text-2xl font-semibold text-gray-900">{value ?? '-'}</p>
        </div>
      </div>
    </div>
  );
}