export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} TechLaunch CMS. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
