import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-slate-900">Walton Plaza</h3>
            <p className="text-sm text-indigo-900 leading-relaxed">
              Bangladesh&apos;s trusted destination for quality electronics and
              home appliances.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-base font-semibold text-slate-900">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-1.5">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-indigo-900 hover:text-indigo-900 transition"
                >
                  All Products
                </Link>
              </li>
              <li>
                <span className="text-sm text-indigo-900">About Walton</span>
              </li>
              <li>
                <span className="text-sm text-indigo-900">Contact Us</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-2">
            <h4 className="text-base font-semibold text-slate-900">
              Customer Service Helpline
            </h4>
            <ul className="flex flex-col gap-1.5">
              <li className="text-sm text-indigo-900">
                Call us at 16267 (Charge Applicable)
              </li>
              <li className="text-sm text-indigo-900">
                or 08 000016267 (Toll Free)
              </li>
              <li className="text-sm text-indigo-900">
                We are available from 7:00 AM to 11:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-indigo-900 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-900">
            © {new Date().getFullYear()} Walton Hi-Tech Industries PLC. All
            rights reserved.
          </p>
          <p className="text-xs text-slate-900">
            Built with Next.js · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
