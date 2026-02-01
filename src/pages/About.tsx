import { Card } from '../components/ui/Card';
import { Info, Lock, Database, Globe } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Über diese Plattform
        </h1>
        <p className="text-lg text-gray-600">
          Direkte Demokratie durch transparente Abstimmungen
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Was ist diese Plattform?
            </h2>
            <p className="text-gray-700 mb-3">
              Diese Web-Anwendung ermöglicht es Bürgern, direkt über Gesetzesänderungen und
              Gesetzentwürfe abzustimmen. Die Plattform verbindet sich mit der offiziellen
              DIP-API des Deutschen Bundestags, um aktuelle Gesetzentwürfe zu beziehen.
            </p>
            <p className="text-gray-700">
              Zusätzlich können Bürger eigene Vorschläge einreichen und zur Diskussion stellen.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Globe className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              DIP Bundestag Integration
            </h2>
            <p className="text-gray-700 mb-3">
              Gesetzentwürfe werden automatisch aus der offiziellen
              Dokumentations- und Informationssystem für Parlamentsmaterialien (DIP) API
              des Deutschen Bundestags bezogen.
            </p>
            <p className="text-gray-700">
              Diese Oracle-basierte Integration stellt sicher, dass alle Abstimmungen
              auf offiziellen, verifizierten Daten basieren.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Database className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              MVP Status
            </h2>
            <p className="text-gray-700 mb-3">
              Dies ist eine MVP-Demonstration (Minimum Viable Product). Aktuell werden
              alle Daten lokal im Browser gespeichert (localStorage).
            </p>
            <p className="text-gray-700">
              In einer Produktionsversion würde die Plattform auf Blockchain-Technologie
              basieren, um Transparenz, Unveränderlichkeit und dezentrale Governance
              zu gewährleisten.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-warning/5 border-warning">
        <div className="flex items-start gap-4">
          <Lock className="w-6 h-6 text-gray-800 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Wichtige Hinweise
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gray-800 font-bold">•</span>
                <span>
                  Identitäten werden im MVP nicht verifiziert. In der Produktionsversion
                  würde eine sichere Identity-Lösung integriert werden.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-800 font-bold">•</span>
                <span>
                  Abstimmungsergebnisse sind in dieser Demo nicht bindend und dienen
                  nur zur Veranschaulichung.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-800 font-bold">•</span>
                <span>
                  Bürgerentwürfe würden in der Produktionsversion durch einen
                  Moderations- und Governance-Prozess geprüft werden.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Technologie
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Frontend</h3>
            <ul className="space-y-1 text-gray-600">
              <li>React + TypeScript</li>
              <li>TailwindCSS</li>
              <li>Framer Motion</li>
              <li>React Query</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Datenquellen</h3>
            <ul className="space-y-1 text-gray-600">
              <li>DIP Bundestag API</li>
              <li>LocalStorage (MVP)</li>
              <li>Mock Backend</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
