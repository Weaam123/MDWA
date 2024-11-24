import { openDB, DBSchema } from 'idb';

interface EimpilioDBSchema extends DBSchema {
  dispatches: {
    key: string;
    value: {
      id: string;
      staffId: string;
      vehicleId: string;
      patientId: string;
      location: {
        lat: number;
        lng: number;
        address: string;
      };
      status: 'pending' | 'en-route' | 'on-scene' | 'completed';
      timestamp: number;
    };
    indexes: { 'by-status': string };
  };
  staff: {
    key: string;
    value: {
      id: string;
      name: string;
      role: string;
      qualification: string;
      licenseNo: string;
      contact: string;
      status: 'available' | 'dispatched' | 'off-duty';
    };
  };
  vehicles: {
    key: string;
    value: {
      id: string;
      type: string;
      registrationNo: string;
      status: 'available' | 'dispatched' | 'maintenance';
      location?: {
        lat: number;
        lng: number;
      };
    };
  };
}

export const db = await openDB<EimpilioDBSchema>('eimpilio-db', 1, {
  upgrade(db) {
    const dispatchStore = db.createObjectStore('dispatches', {
      keyPath: 'id',
    });
    dispatchStore.createIndex('by-status', 'status');

    db.createObjectStore('staff', { keyPath: 'id' });
    db.createObjectStore('vehicles', { keyPath: 'id' });
  },
});