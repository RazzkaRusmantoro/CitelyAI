"use client";

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { RiTwitterXFill } from "react-icons/ri";
import { motion } from "framer-motion";
import FadeInOnScroll from "@/components/FadeInOnScroll";

export function Footer() {
  return (
    <FadeInOnScroll>
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">Citely</h3>
              <p className="text-gray-600">
                The smartest way to manage citations and references with
                AI-powered tools.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <RiTwitterXFill className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/home"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Partners
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Academic Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Citely. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Cookies
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-amber-600 text-sm transition-colors"
              >
                Your Account
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </FadeInOnScroll>
  );
}
