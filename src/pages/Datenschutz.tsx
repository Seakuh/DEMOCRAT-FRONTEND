import { Card } from '../components/ui/Card';
import { Shield, Database, Cookie, Eye, UserCheck, Lock } from 'lucide-react';

export function Datenschutz() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Datenschutzerklärung</h1>
        <p className="text-lg text-gray-600">
          Informationen zum Umgang mit Ihren personenbezogenen Daten
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Datenschutz auf einen Blick
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Diese
                Datenschutzerklärung informiert Sie darüber, welche Daten wir erheben, wie wir
                sie verwenden und welche Rechte Sie haben.
              </p>
              <p>
                Diese Website verarbeitet personenbezogene Daten ausschließlich auf Grundlage
                der gesetzlichen Bestimmungen (DSGVO, TMG).
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <UserCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Verantwortlicher
            </h2>
            <div className="text-gray-700 space-y-2">
              <p>Verantwortlich für die Datenverarbeitung auf dieser Website:</p>
              <address className="not-italic bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Direkte Demokratie MVP</p>
                <p>Musterstraße 123</p>
                <p>12345 Musterstadt</p>
                <p className="mt-2">E-Mail: datenschutz@example.com</p>
              </address>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Database className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Datenerfassung auf dieser Website
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Lokale Datenspeicherung (localStorage)</h3>
                <p>
                  Diese MVP-Demonstration speichert Daten ausschließlich lokal in Ihrem Browser
                  (localStorage). Es werden keine Daten an externe Server übertragen. Gespeichert werden:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Ihre Abstimmungen zu Gesetzentwürfen</li>
                  <li>Ihre Kommentare und Diskussionsbeiträge</li>
                  <li>Von Ihnen erstellte Bürgerentwürfe</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Server-Log-Dateien</h3>
                <p>
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in
                  Server-Log-Dateien, die Ihr Browser automatisch übermittelt (IP-Adresse,
                  Browsertyp, Betriebssystem, Referrer URL, Uhrzeit der Serveranfrage).
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Cookies
            </h2>
            <p className="text-gray-700">
              Diese Website verwendet keine Tracking-Cookies. Es werden lediglich technisch
              notwendige Speicherungen im localStorage Ihres Browsers vorgenommen, um die
              Funktionalität der Anwendung zu gewährleisten.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Eye className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Ihre Rechte
            </h2>
            <div className="text-gray-700">
              <p className="mb-3">Sie haben jederzeit das Recht auf:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Auskunft</strong> über Ihre gespeicherten personenbezogenen Daten</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Berichtigung</strong> unrichtiger personenbezogener Daten</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Löschung</strong> Ihrer gespeicherten personenbezogenen Daten</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Einschränkung</strong> der Verarbeitung Ihrer Daten</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Datenübertragbarkeit</strong> Ihrer Daten</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Widerspruch</strong> gegen die Verarbeitung</span>
                </li>
              </ul>
              <p className="mt-4 text-sm bg-gray-50 p-3 rounded-lg">
                Da alle Daten lokal in Ihrem Browser gespeichert werden, können Sie diese
                jederzeit durch Löschen der Browser-Daten (localStorage) selbst entfernen.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Datensicherheit
            </h2>
            <p className="text-gray-700">
              Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung.
              Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des
              Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in
              Ihrer Browserzeile.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-warning/5 border-warning">
        <p className="text-sm text-gray-700">
          <strong className="text-gray-900">Hinweis:</strong> Dies ist eine MVP-Demonstration.
          Für einen produktiven Einsatz muss diese Datenschutzerklärung an die tatsächlichen
          Gegebenheiten angepasst und durch einen Rechtsexperten geprüft werden.
        </p>
      </Card>

      <div className="text-sm text-gray-500 text-right">
        Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
}
