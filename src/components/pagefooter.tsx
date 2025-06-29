import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background bg-slate-900 text-slate-50 border-t py-10 px-4 sm:px-6 lg:px-8 text-foreground">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Brand Info */}
        <div>
          <h2 className="text-xl font-bold text-slate-100">ALIMANA</h2>
          <p className="mt-2 text-muted-foreground text-gray-600 text-sm">
            The complete store management solution for modern businesses. Streamline operations,
            boost productivity, and grow your revenue.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="font-semibold text-sm text-slate-100 text-muted-foreground uppercase tracking-wider mb-3">
            Product
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/features" className="hover:underline text-gray-600">
                Features
              </Link>
            </li>
            <li>
              <Link href="/testimonial" className="hover:underline text-gray-600">
                Testimonial
              </Link>
            </li>
            <li>
              <Link href="/whyus" className="hover:underline text-gray-600">
                Why choose us
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="font-semibold text-sm  text-slate-100 text-muted-foreground uppercase tracking-wider mb-3">
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="hover:underline text-gray-600">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline text-gray-600">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/status" className="hover:underline text-gray-600">
                Join us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-500 pt-6 text-center text-slate-100 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ALIMANA. All rights reserved.
      </div>
    </footer>
  );
}
