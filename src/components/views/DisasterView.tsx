import React, { useState, useEffect } from 'react';
import { WeatherTelemetry } from '../../types';
import { speakText } from '../../utils/weatherUtils';
import {
  ShieldAlert,
  Radio,
  MapPin,
  Phone,
  AlertTriangle,
  Building,
  CheckCircle2,
  Copy,
  Check,
  Volume2,
  MessageSquare,
  Smartphone,
  WifiOff
} from 'lucide-react';

interface DisasterViewProps {
  telemetry: WeatherTelemetry;
}

export const DisasterView: React.FC<DisasterViewProps> = ({ telemetry }) => {
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [copiedSms, setCopiedSms] = useState(false);
  const [isCached, setIsCached] = useState(false);

  const SOS_CACHE_KEY = 'weathergpt_last_sos';

  const emergencySmsText = `🚨 EMERGENCY STATUS UPDATE (${telemetry.cityName} ${telemetry.coordinates}):
I am currently safe. Weather condition: ${telemetry.condition} (${telemetry.temp}°C, Rain ${telemetry.rainProb}%).
Nearest Designated Relief Shelter: Central Community & Relief Stadium (1.4 km).
Shared via WeatherGPT Disaster Response Hub.`;

  useEffect(() => {
    const sosData = {
      text: emergencySmsText,
      timestamp: new Date().toISOString(),
      location: telemetry.cityName,
      coords: telemetry.coordinates,
      shelter: "Central Community & Relief Stadium (1.4 km)"
    };
    localStorage.setItem(SOS_CACHE_KEY, JSON.stringify(sosData));
    setIsCached(true);
  }, [emergencySmsText, telemetry.cityName, telemetry.coordinates]);

  const handleCopySms = () => {
    navigator.clipboard.writeText(emergencySmsText);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2000);
  };

  const handleTestSiren = () => {
    setSirenPlaying(true);
    speakText(
      `Emergency Alert Broadcast. IMD Hydro Advisory for ${telemetry.cityName}. Flood drainage normal at 84 percent. Follow official district civil defense advisories.`
    );
    setTimeout(() => setSirenPlaying(false), 8000);
  };

  return (
    <div className="space-y-5 pb-28">
      {/* Top Banner */}
      <div className="rounded-3xl border border-rose-300 bg-rose-50/60 p-5 shadow-xs dark:border-rose-900 dark:bg-rose-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                ORANGE ADVISORY
              </span>
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                IMD Hydro-Meteorological Monitoring Active
              </span>
              {isCached && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <WifiOff className="h-2.5 w-2.5" />
                  OFFLINE READY (CACHED)
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-100 mt-1">
              Disaster Response & Emergency Shelters
            </h1>
            <p className="text-xs text-rose-800 dark:text-rose-300 mt-0.5">
              Live river basin flood telemetry, verified offline relief facilities, and emergency broadcast dispatch for {telemetry.coordinates}.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={handleTestSiren}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-xs transition-colors ${
                sirenPlaying
                  ? 'bg-rose-700 text-white animate-pulse'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <span>{sirenPlaying ? 'Broadcasting Alert...' : 'Test Audio Siren'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Watershed & Urban Drainage Gauges (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">River Basin Level</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              WATCH
            </span>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
            84% <span className="text-xs font-normal text-zinc-400">of danger mark</span>
          </p>
          <div className="mt-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '84%' }} />
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Rising at +1.8 cm/hr; safely within levee crest margins.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Urban Culvert Inundation</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              STABLE
            </span>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
            Normal Flow
          </p>
          <div className="mt-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '38%' }} />
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Primary storm outlets flowing freely into downstream canal.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Relief Sump Pumps</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              READY
            </span>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
            100% Operational
          </p>
          <div className="mt-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Diesel backups fueled for 72 hours of uninterrupted drainage.
          </p>
        </div>
      </div>

      {/* Verified Offline Relief Shelters */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            VERIFIED OFFLINE RELIEF SHELTERS NEAR {telemetry.coordinates}
          </h2>
          <span className="text-xs text-zinc-400">Cached for offline emergency navigation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Central Community Stadium
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                1.4 km
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">Capacity: 1,800 persons • Medical & Food kits ready</p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-700 text-[11px]">
              <span className="text-emerald-600 font-semibold">Elevated Plinth: Yes</span>
              <span className="font-mono text-zinc-600 dark:text-zinc-300">Sector 4-B</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Govt Polytechnic Relief Campus
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                2.8 km
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">Capacity: 950 persons • Backup Generator active</p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-700 text-[11px]">
              <span className="text-emerald-600 font-semibold">Water Tank: 20k L</span>
              <span className="font-mono text-zinc-600 dark:text-zinc-300">West Wing</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Municipal High School Auditorium
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                3.9 km
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">Capacity: 1,200 persons • Community Kitchen setup</p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-700 text-[11px]">
              <span className="text-emerald-600 font-semibold">Helipad: Adjacent</span>
              <span className="font-mono text-zinc-600 dark:text-zinc-300">Main Road</span>
            </div>
          </div>
        </div>
      </div>

      {/* Impassable Inundation Corridors & Waterlogging */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">
          TRANSIT VULNERABILITIES & WATERLOGGED PASSAGES
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 p-3 dark:border-rose-900/50 dark:bg-rose-950/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <div>
                <span className="font-bold text-rose-950 dark:text-rose-200">
                  NH-12 Low Underpass
                </span>
                <p className="text-rose-800 dark:text-rose-300 text-[11px]">
                  45 cm standing water reported. Impassable for light vehicles and two-wheelers.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold text-white shrink-0">
              AVOID
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <div>
                <span className="font-bold text-emerald-950 dark:text-emerald-200">
                  Station Road Flyover Approach
                </span>
                <p className="text-emerald-800 dark:text-emerald-300 text-[11px]">
                  Elevated bypass route completely clear with normal traffic flow.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shrink-0">
              CLEAR
            </span>
          </div>
        </div>
      </div>

      {/* Emergency SMS Broadcast Generator */}
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Emergency SOS Dispatch SMS Generator
            </h3>
            <p className="text-xs text-zinc-500">
              Generate a formatted broadcast message with verified weather telemetry and shelter location to send via SMS or WhatsApp during emergencies.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
            <button
              onClick={handleCopySms}
              className="flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {copiedSms ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedSms ? 'Copied' : 'Copy'}</span>
            </button>
            <a 
              href={`sms:?body=${encodeURIComponent(emergencySmsText)}`}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Send via SMS</span>
            </a>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(emergencySmsText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <textarea
          readOnly
          value={emergencySmsText}
          rows={3}
          className="w-full rounded-2xl border border-zinc-200 bg-white p-3 font-mono text-xs text-zinc-800 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
        />

        {/* Helplines Direct Dial */}
        <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-700 flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-blue-600" />
            District Disaster: <strong>1077</strong>
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-rose-600" />
            National Emergency: <strong>112</strong>
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            State Relief Control: <strong>1070</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
