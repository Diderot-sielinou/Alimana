import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Footer from '@/components/pagefooter';
import TestimonialSection from '@/components/testimonials';
import { Package, ShoppingBag, Users, Barcode } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header/Navbar */}
      <header className="w-full bg-slate-900 shadow-sm py-4 md:px-24 flex justify-between items-center z-10">
        <Link
          href="/"
          className="flex items-center space-x-2 text-2xl font-bold text-amber-700 hover:text-amber-900 transition-colors"
        >
          <ShoppingBag className="w-8 h-8" />
          <span className="text-white">ALIMANA</span>
        </Link>

        {/* Navigation */}
        <nav className="space-x-4">
          <Link href="/signin" passHref>
            <Button
              variant="ghost"
              className="text-white border-2 border-slate-200 hover:bg-indigo-50 hover:text-black"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button className="bg-amber-600 hover:bg-amber-700 text-black shadow-md">SignUp</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main
        className="min-h-[70vh] flex-grow flex items-center justify-center py-12 px-4 sm:px-6 md:px-12 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/clients.webp')",
        }}
      >
        <div className="max-w-4xl text-center">
          <h1 className="text-3xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Streamline Your Store Operations with <span className="text-amber-700">Ease</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto">
            ALIMANA is your all-in-one solution for product, sales, and user management, designed to
            empower your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" passHref>
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg shadow-lg w-52"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="#features" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-amber-600 text-amber-600 dark:bg-white dark:hover:text-slate-900 hover:bg-indigo-50 px-8 py-3 text-lg w-52"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center mt-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 pb-6">
            Powerful Features, Simplified
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature Card 1 */}
            <div className="p-4 sm:p-6 rounded-lg border border-slate-300 bg-white hover:shadow-lg transition-shadow duration-300 h-full">
              <Package className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Management</h3>
              <p className="text-gray-600">
                Track quantity, generate barcodes, and organize your inventory effortlessly.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="p-4 sm:p-6 rounded-lg border border-slate-300 bg-white hover:shadow-lg transition-shadow duration-300 h-full">
              <ShoppingBag className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Efficient Sales</h3>
              <p className="text-gray-600">
                Quickly add items to cart, calculate change, and streamline checkout.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="p-4 sm:p-6 rounded-lg border border-slate-300 bg-white hover:shadow-lg transition-shadow duration-300 h-full">
              <Users className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">User & Role Control</h3>
              <p className="text-gray-600">
                Invite staff, set roles, permissions, and track activities.
              </p>
            </div>
            {/* Feature Card 4 */}
            <div className="p-4 sm:p-6 rounded-lg border border-slate-300 bg-white hover:shadow-lg transition-shadow duration-300 h-full">
              <Barcode className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Reporting</h3>
              <p className="text-gray-600">
                Gain insights with detailed sales and inventory reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="whyus" className="py-16 px-4 sm:px-6 sm:py-64 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary dark:text-black">
            Why Choose ALIMANA?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground dark:text-slate-600">
            Empowering store owners with tools to manage, grow, and succeed—without the stress.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '99.9%',
                subtitle: 'Uptime Guarantee',
                description:
                  'Your business is always open. We ensure consistent performance, day and night.',
              },
              {
                title: '10,000+',
                subtitle: 'Happy Customers',
                description:
                  'Trusted by thousands of store owners worldwide to streamline operations and boost sales.',
              },
              {
                title: '24/7',
                subtitle: 'Customer Support',
                description:
                  'Get help whenever you need it—from real humans who care about your success.',
              },
              {
                title: 'Fast Setup',
                subtitle: 'Get Started in Minutes',
                description:
                  'No tech skills? No problem. Launch your store fast with our intuitive onboarding.',
              },
              {
                title: 'Secure & Compliant',
                subtitle: 'Enterprise-Grade Protection',
                description:
                  'We safeguard your data with the latest encryption and compliance standards.',
              },
              {
                title: 'All-in-One',
                subtitle: 'Complete Management Suite',
                description:
                  'From inventory to sales to analytics, manage everything in one clean dashboard.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 border rounded-lg bg-white shadow-sm h-full text-left"
              >
                <p className="text-4xl font-bold text-foreground dark:text-black">{item.title}</p>
                <p className="mt-2 text-muted-foreground dark:text-slate-600">{item.subtitle}</p>
                <p className="mt-1 text-sm text-muted-foreground dark:text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <section id="getstarted" className="py-16 px-4 sm:px-6 lg:px-8 rounded-2xl text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl dark:text-black">
            Ready to transform your store management?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground dark:text-slate-600">
            Join thousands of store owners who have streamlined their operations with ALIMANA.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 dark:text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
