export default function Footer() {
  return (
    <footer className="bg-card border-t border-border px-6 py-4 mt-auto">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Jerico Techlaunch Dev Inc. All rights reserved.</p>
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
