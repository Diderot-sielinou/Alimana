import { Link } from 'lucide-react';

export default function FooterSection() {
  return (
    <>
      <footer className="w-full bg-gray-800 text-white py-8 px-6 md:px-12 text-center">
        <p>&copy; {new Date().getFullYear()} StoreManagerPro. All rights reserved.</p>
        <nav className="mt-4 space-x-4">
          <Link href="/privacy" className="text-gray-400 hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-white">
            Terms of Service
          </Link>
        </nav>
      </footer>
    </>
  );
}
