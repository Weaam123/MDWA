export interface Staff {
  id: string;
  name: string;
  surname: string;
  qualification: string;
  hpcsaNumber: string;
  drivingLicense: string;
  pdpExpiry: string;
  email: string;
  contact: string;
  status: 'available' | 'dispatched' | 'off-duty';
  nextOfKin: {
    name: string;
    email: string;
    contact: string;
    relationship: string;
  };
  medicalAid: {
    name: string;
    plan: string;
    number: string;
    dependentCode: string;
  };
  permissions: string[];
}

export interface Vehicle {
  id: string;
  type: string;
  registrationNo: string;
  callSign: string;
  make: string;
  model: string;
  year: string;
  status: 'available' | 'dispatched' | 'maintenance';
  location?: {
    lat: number;
    lng: number;
  };
}

export interface PatientReport {
  id: string;
  patientId: string;
  dispatchId: string;
  staffId: string;
  timestamp: number;
  paymentInfo: {
    responsible: string;
    method: string;
  };
  careLevel: string;
  medicalAid: {
    name: string;
    plan: string;
    number: string;
  };
  clinicalInfo: {
    symptoms: string[];
    vitals: {
      bp: string;
      pulse: string;
      temp: string;
      spo2: string;
    };
    treatment: string[];
  };
  disposition: string;
  handover: {
    facility: string;
    staff: string;
    time: string;
  };
}