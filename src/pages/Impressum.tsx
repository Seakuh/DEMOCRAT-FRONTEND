import { Card } from '../components/ui/Card';
import { Building2, Mail, Phone, User } from 'lucide-react';

export function Impressum() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Impressum</h1>
        <p className="text-lg text-gray-600">
          Angaben gemäß § 5 TMG
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Building2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Anbieter
            </h2>
            <address className="not-italic text-gray-700 space-y-1">
              <p className="font-medium">Direkte Demokratie MVP</p>
              <p>Musterstraße 123</p>
              <p>12345 Musterstadt</p>
              <p>Deutschland</p>
            </address>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <User className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Verantwortlich für den Inhalt
            </h2>
            <p className="text-gray-700">
              Max Mustermann
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (gemäß § 55 Abs. 2 RStV)
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Kontakt
            </h2>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href="mailto:info@example.com" className="hover:text-primary transition-colors">
                  info@example.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href="tel:+49123456789" className="hover:text-primary transition-colors">
                  +49 123 456 789
                </a>
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Haftungsausschluss
        </h2>
        <div className="space-y-4 text-gray-700 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Haftung für Inhalte</h3>
            <p>
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Haftung für Links</h3>
            <p>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Urheberrecht</h3>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem deutschen Urheberrecht.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-warning/5 border-warning">
        <p className="text-sm text-gray-700">
          <strong className="text-gray-900">Hinweis:</strong> Dies ist eine MVP-Demonstration.
          Die angegebenen Kontaktdaten sind Platzhalter und müssen für einen produktiven Einsatz
          durch reale Angaben ersetzt werden.
        </p>
      </Card>
    </div>
  );
}
