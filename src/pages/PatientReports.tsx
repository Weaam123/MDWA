import React from 'react';
import { FileText, Download, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { PatientReport } from '../types';
import { usePatientReportStore } from '../stores/patientReportStore';
import { PDFDocument, rgb } from '@react-pdf/renderer';

export default function PatientReports() {
  const { reports, loadReports } = usePatientReportStore();
  const [showForm, setShowForm] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleDownloadPDF = async (report: PatientReport) => {
    try {
      const blob = await generatePDF(report);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patient-report-${report.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Patient Reports</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Report
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Care Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(report.timestamp, 'dd MMM yyyy')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(report.timestamp, 'HH:mm')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{report.patientId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {report.careLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.staffId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedReport(report.id)}
                    className="text-teal-600 hover:text-teal-900 mr-3"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(report)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showForm || selectedReport) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedReport ? 'View Report' : 'New Patient Report'}
            </h2>
            <PatientReportForm
              initialData={reports.find(r => r.id === selectedReport)}
              onSuccess={() => {
                setShowForm(false);
                setSelectedReport(null);
                loadReports();
              }}
              onCancel={() => {
                setShowForm(false);
                setSelectedReport(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

async function generatePDF(report: PatientReport): Promise<Blob> {
  const doc = await PDFDocument.create();
  const page = doc.addPage();
  const { width, height } = page.getSize();

  // Add content to PDF
  page.drawText('Patient Report', {
    x: 50,
    y: height - 50,
    size: 20,
    color: rgb(0, 0, 0),
  });

  // Add patient information
  page.drawText(`Patient ID: ${report.patientId}`, {
    x: 50,
    y: height - 100,
    size: 12,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Care Level: ${report.careLevel}`, {
    x: 50,
    y: height - 120,
    size: 12,
    color: rgb(0, 0, 0),
  });

  // Add vitals
  page.drawText('Vitals:', {
    x: 50,
    y: height - 160,
    size: 14,
    color: rgb(0, 0, 0),
  });

  const vitals = report.clinicalInfo.vitals;
  page.drawText(`BP: ${vitals.bp}`, {
    x: 50,
    y: height - 180,
    size: 12,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Pulse: ${vitals.pulse}`, {
    x: 50,
    y: height - 200,
    size: 12,
    color: rgb(0, 0, 0),
  });

  return doc.save();
}