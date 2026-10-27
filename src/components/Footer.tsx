import { Globe, Sun, Moon, ShieldCheck } from 'lucide-react';
import { CompliancePageId, Language } from '../types/index.ts';
import { COMPLIANCE_CONFIG } from '../config/constants.ts';
import { useI18n } from '../i18n/I18nContext.tsx';

interface FooterProps {
  activeCompliancePage: CompliancePageId | null;
  onSelectCompliancePage: (page: CompliancePageId) => void;
  hasBottomNav?: boolean;
}

export function Footer({
  activeCompliancePage,
  onSelectCompliancePage,
  hasBottomNav = false,
}: FooterProps) {
  const { language, setLanguage, theme, toggleTheme, c } = useI18n();

  const links: { id: CompliancePageId; label: string }[] = [
    { id: 'about', label: c.footerAbout },
    { id: 'privacy', label: c.footerPrivacy },
    { id: 'terms', label: c.footerTerms },
    { id: 'cookies', label: c.footerCookies },
    { id: 'accessibility', label: c.footerAccessibility },
    { id: 'contact', label: c.footerContact },
  ];

  return (
    <footer
      aria-label="Global Trust and Compliance Footer"
      className={`bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto ${
        hasBottomNav ? 'pb-20' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Top Row: Trust & Compliance Navigation Links + Language & Theme Toggles */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <nav
            aria-label="Trust and Compliance Pages"
            className="flex flex-wrap items-center gap-2 sm:gap-3"
          >
            {links.map((item) => {
              const isCurrent = activeCompliancePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectCompliancePage(item.id)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer Language Toggle & Theme Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex items-center">
              <label htmlFor="footer-language-select" className="sr-only">
                Footer Language Selector
              </label>
              <Globe
                className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="footer-language-select"
                aria-label="Footer Language Selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-slate-800 text-white text-xs font-semibold pl-7 pr-5 py-1.5 min-h-[36px] rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="es">Español (ES)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={c.toggleThemeLabel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                  <span>{c.themeDark}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  <span>{c.themeLight}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Row: Attribution & Copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" aria-hidden="true" />
            <p className="font-medium text-slate-200">{COMPLIANCE_CONFIG.attributionLine}</p>
          </div>
          <p className="font-mono text-slate-400">
            © {COMPLIANCE_CONFIG.copyrightYear} {COMPLIANCE_CONFIG.authorName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
