import React, { useState } from 'react';
import type { IncidentRecord } from '../types/metro';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Octagon, 
  Search
} from 'lucide-react';

interface IncidentLogModalProps {
  incidents: IncidentRecord[];
}

export const IncidentLogModal: React.FC<IncidentLogModalProps> = ({ incidents }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
    if (searchQuery && !inc.details.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.station.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DMRC_UTO_Blackbox_Audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-black text-white tracking-wide">
              CMRS Blackbox Safety Audit & Incident Log
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 uppercase">
              CMRS Statutorily Compliant
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Commissioner of Metro Railway Safety audit telemetry, millisecond reaction latency records, and fail-safe proofs.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export JSON Audit</span>
          </button>

          <button
            onClick={handlePrintAudit}
            className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/20 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Print Audit Certificate</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search incident events, stations, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="py-3 px-4">Event ID / Time</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Station & Line</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Reaction Latency</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No matching safety records found.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => {
                  const isCritical = inc.severity === 'CRITICAL';
                  const isHigh = inc.severity === 'HIGH';

                  return (
                    <tr key={inc.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        <span className="block text-slate-200">{inc.id}</span>
                        <span className="text-[10px] text-slate-400">{inc.timestamp}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isCritical
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : isHigh
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        }`}>
                          {inc.severity}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-200 whitespace-nowrap">
                        {inc.type.replace(/_/g, ' ')}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-pink-400 font-bold block">{inc.station}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{inc.line} Line ({inc.trainId})</span>
                      </td>

                      <td className="py-3 px-4 font-sans max-w-xs text-slate-300 text-[11px]">
                        <p>{inc.details}</p>
                        {inc.operatorAction && (
                          <p className="text-[10px] text-emerald-400 mt-1 font-mono">
                            ↳ Action: {inc.operatorAction}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4 text-emerald-400 font-bold whitespace-nowrap">
                        {inc.reactionTimeMs} ms
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {inc.resolved ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolved ({inc.resolvedAt})</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400 text-[11px] animate-pulse">
                            <Octagon className="w-3.5 h-3.5" />
                            <span>ACTIVE INCIDENT</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
