import Link from "next/link";
import { FOOTER_QUICK_LINKS, FOOTER_SUPPORT_LINES } from "@/constants/footer";

const Footer = () => {
  return (
    <footer className="mt-14 border-t border-slate-200/70 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold [font-family:var(--font-space-grotesk)]">
              Walton Plaza
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bangladesh&apos;s trusted destination for quality electronics and
              home appliances.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-base font-semibold text-slate-100">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-1.5">
              {FOOTER_QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-slate-300">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-2">
            <h4 className="text-base font-semibold text-slate-100">
              Customer Service Helpline
            </h4>
            <ul className="flex flex-col gap-1.5">
              {FOOTER_SUPPORT_LINES.map((line) => (
                <li key={line} className="text-sm text-slate-300">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Walton Hi-Tech Industries PLC. All
            rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Built with Next.js · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
