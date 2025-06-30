import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Footer from '@/components/pagefooter';
import TestimonialSection from '@/components/testimonials';
import { Package, ShoppingBag, Users, Barcode } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header/Navbar */}
      <header className="w-full bg-white shadow-sm py-4 md:px-12 flex justify-between items-center z-10">
        <Link
          href="/"
          className="flex items-center space-x-2 text-2xl font-bold text-amber-700 hover:text-amber-900 transition-colors"
        >
          <ShoppingBag className="w-8 h-8" />
          <span>ALIMANA</span>
        </Link>

        {/* Navigation */}
        <nav className="space-x-4">
          <Link href="/login" passHref>
            <Button
              variant="ghost"
              className="text-amber-700 hover:bg-indigo-50 hover:text-amber-800"
            >
              {' '}
              Login{' '}
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-md">SignUp</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main
        className="h-screen flex-grow flex items-center justify-center py-16 px-6 md:px-12"
        style={{
          backgroundImage: "url('/images/shopcustomer.webp')",
          backgroundPosition: 'center',
          objectFit: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Streamline Your Store Operations with <span className="text-amber-700">Ease</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            ALIMANA is your all-in-one solution for product, sales, and user management, designed to
            empower your business.
          </p>
          <div className="space-x-4">
            <Link href="/signup" passHref>
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg shadow-lg"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="#features" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-indigo-50 px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Powerful Features, Simplified</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card 1 */}
            <div className="p-6 rounded-lg border hover:shadow-lg transition-shadow duration-300">
              <Package className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Management</h3>
              <p className="text-gray-600">
                Track quantity, generate barcodes, and organize your inventory effortlessly.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="p-6 rounded-lg border hover:shadow-lg transition-shadow duration-300">
              <ShoppingBag className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Efficient Sales</h3>
              <p className="text-gray-600">
                Quickly add items to cart, calculate change, and streamline checkout.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="p-6 rounded-lg border hover:shadow-lg transition-shadow duration-300">
              <Users className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">User & Role Control</h3>
              <p className="text-gray-600">
                Invite staff, set roles, permissions, and track activities.
              </p>
            </div>
            {/* Feature Card 4 */}
            <div className="p-6 rounded-lg border hover:shadow-lg transition-shadow duration-300">
              <Barcode className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Reporting</h3>
              <p className="text-gray-600">
                Gain insights with detailed sales and inventory reports.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* section why choose us */}

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">
            Why Choose ALIMANA?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of successful store owners who trust our platform.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold text-foreground">99.9%</p>
              <p className="mt-2 text-muted-foreground">Uptime Guarantee</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-foreground">10,000+</p>
              <p className="mt-2 text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-foreground">24/7</p>
              <p className="mt-2 text-muted-foreground">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* section testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <section id="#getstarted" className=" py-16 px-4 sm:px-6 lg:px-8 rounded-2xl text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Ready to transform your store management?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of store owners who have streamlined their operations with ALIMANA.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
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
