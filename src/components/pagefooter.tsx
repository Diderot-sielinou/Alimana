import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background bg-slate-900 text-slate-50 border-t py-10 px-4 sm:px-6 lg:px-8 text-foreground">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Brand Info */}
        <div>
          <h2 className="text-xl font-bold">ALIMANA</h2>
          <p className="mt-2 text-muted-foreground text-indigo-50 text-sm">
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
              <Link href="/features" className="hover:underline">
                Features
              </Link>
            </li>
            <li>
              <Link href="/testimonial" className="hover:underline">
                Testimonial
              </Link>
            </li>
            <li>
              <Link href="/whyus" className="hover:underline">
                Why choose us
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="font-semibold text-sm  text-indigo-50 text-muted-foreground uppercase tracking-wider mb-3">
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/status" className="hover:underline">
                Join us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t pt-6 text-center text-indigo-50 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ALIMANA. All rights reserved.
      </div>
    </footer>
  );
}
