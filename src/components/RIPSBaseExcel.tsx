import { Sheet } from "lucide-react";

const RIPSBaseExcel = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">      
      <div className="mb-4">
        <Sheet className="w-20 h-20 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Descargar Base RIPS</h2>
      <a
        href="/assets/BaseRIPS.xlsx"
        download
        className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-700 transition-colors duration-300"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M12 4v8" />
        </svg>
        Descargar Excel
      </a>
    </div>
  );
};

export default RIPSBaseExcel;
