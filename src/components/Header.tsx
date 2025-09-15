"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Product } from "@prisma/client";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string; description?: string }[];
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "us" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

// Declare global google translate function
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Products",
    href: "/explore",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Analytics",
        href: "/analytics",
        description: "Track your metrics",
      },
      {
        name: "Dashboard",
        href: "/dashboard",
        description: "Manage your data",
      },
      { name: "Reports", href: "/reports", description: "Generate insights" },
    ],
  },
  { name: "Play Online", href: "/play" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/public/products?limit=50");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Initialize Google Translate
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (window.google?.translate) {
        setIsTranslateLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,rw,fr",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
        setIsTranslateLoaded(true);
      };
    };

    addGoogleTranslateScript();
  }, []);

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);

    if (isTranslateLoaded && window.google?.translate) {
      const translateElement =
        window.google.translate.TranslateElement.getInstance();
      if (translateElement) {
        translateElement.showBanner(false);

        // Trigger translation
        const selectElement = document.querySelector(
          ".goog-te-combo"
        ) as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = language.code;
          selectElement.dispatchEvent(new Event("change"));
        }
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    scrolled: {
      backdropFilter: "blur(20px)",
      backgroundColor:
        theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto" },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      variants={headerVariants}
      initial="initial"
      animate={isScrolled ? "scrolled" : "animate"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        backgroundColor: isScrolled
          ? theme === "dark"
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(255, 255, 255, 0.8)"
          : "transparent",
        boxShadow: isScrolled ? "0 8px 32px rgba(0, 0, 0, 0.1)" : "none",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-24">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              prefetch={false}
              href="/"
              className="flex items-center space-x-2"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                className="transition-all opacity-70 hover:opacity-85"
                width={80}
                height={80}
              />
            </Link>
          </motion.div>

          <nav className="hidden items-center space-x-8 lg:flex">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.hasDropdown && setActiveDropdown(item.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  prefetch={false}
                  href={item.href}
                  className="text-foreground flex items-center space-x-1 font-medium transition-colors duration-200 hover:text-rose-600"
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  )}
                </Link>

                {item.hasDropdown && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        className="border-border bg-background/95 absolute top-full left-0 mt-2 w-64 overflow-hidden rounded-xl border shadow-xl backdrop-blur-lg"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.2 }}
                      >
                        {products?.map((product) => (
                          <Link
                            prefetch={false}
                            key={product.id}
                            href={"/explore/" + product.id}
                            className="hover:bg-muted block px-4 py-3 transition-colors duration-200"
                          >
                            <div className="text-foreground font-medium">
                              {product.name}
                            </div>
                            {product.description && (
                              <div className="text-muted-foreground text-sm">
                                {product.category} -{" "}
                                {Number(product.price).toLocaleString()}{" "}
                                {product.currency}
                              </div>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden items-center space-x-4 lg:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-foreground font-medium transition-colors duration-200 hover:text-rose-600 flex items-center space-x-2"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-lg">{currentLanguage.flag}</span>
                  <span>{currentLanguage.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => changeLanguage(language)}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                    {currentLanguage.code === language.code && (
                      <span className="ml-auto text-rose-600">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                prefetch={false}
                href="/explore"
                className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-2.5 font-medium text-white transition-all duration-200 hover:shadow-lg"
              >
                <span>Order Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.button
            className="hover:bg-muted rounded-lg p-2 transition-colors duration-200 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="overflow-hidden lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="border-border bg-background/95 mt-4 space-y-2 rounded-xl border py-4 shadow-xl backdrop-blur-lg">
                {navItems.map((item) => (
                  <Link
                    prefetch={false}
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:bg-muted block px-4 py-3 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="space-y-2 px-4 py-2">
                  <div className="space-y-2">
                    <div className="text-foreground text-sm font-medium px-2 py-1">
                      Language
                    </div>
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          changeLanguage(language);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`text-foreground hover:bg-muted flex items-center space-x-3 w-full rounded-lg px-3 py-2 text-left transition-colors duration-200 ${
                          currentLanguage.code === language.code
                            ? "bg-rose-50 dark:bg-rose-900/20"
                            : ""
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                        {currentLanguage.code === language.code && (
                          <span className="ml-auto text-rose-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <Link
                    prefetch={false}
                    href="/explore"
                    className="block w-full rounded-lg bg-gradient-to-r from-rose-500 to-rose-700 py-2.5 text-center font-medium text-white transition-all duration-200 hover:shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </motion.header>
  );
}
