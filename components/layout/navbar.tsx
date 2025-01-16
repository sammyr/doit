"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              JustDoIt
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Preise
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900">
              Über uns
            </Link>
            <Link href="/login">
              <Button variant="ghost">Anmelden</Button>
            </Link>
            <Link href="/register">
              <Button>Kostenlos starten</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b">
            <Link
              href="#features"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Preise
            </Link>
            <Link
              href="#about"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Über uns
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Anmelden
            </Link>
            <Link
              href="/register"
              className="block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="w-full">Kostenlos starten</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
