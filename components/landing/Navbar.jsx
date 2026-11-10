"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { C, HL, BD } from "./tokens";
import Icon from "./Icon";

const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  {
    label: "Providers",
    href: "/providers",
    dropdown: [
      { label: "AT&T", href: "/providers/att" },
      { label: "BRIGHTSPEED", href: "/providers/brightspeed" },
      { label: "DIRECTV", href: "/providers/directv" },
      { label: "EARTHLINK", href: "/providers/earthlink" },
      { label: "FRONTIER", href: "/providers/frontier" },
      { label: "Browse All", href: "/providers", isAction: true },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    dropdown: [
      { label: "Internet", href: "/solutions/internet" },
      { label: "TV", href: "/solutions/tv" },
      { label: "Mobile", href: "/solutions/mobile" },
      { label: "Home Security", href: "/solutions/home-security" },
      { label: "Home Phone", href: "/solutions/home-phone" },
      { label: "Browse All", href: "/solutions", isAction: true },
    ],
  },
  { label: "Blog", href: "#" },
  { label: "FAQ", href: "/faq" },
];

function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-bold tracking-tight transition-all duration-300 inline-flex items-center gap-1 pb-[4px]"
        style={{
          ...HL,
          color: C.onSurface,
          opacity: 0.8,
          borderBottom: "2px solid transparent",
          background: "none",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = C.secondary;
          e.currentTarget.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = C.onSurface;
          e.currentTarget.style.opacity = "0.8";
        }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {label}
        <Icon
          name="expand_more"
          size={18}
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-xl overflow-hidden z-50"
            style={{
              backgroundColor: C.surfaceLowest,
              boxShadow: "0 8px 30px rgba(25,28,30,0.12)",
              border: `1px solid ${C.outlineVariant}33`,
            }}
          >
            {items.map(({ label, href, isAction }) => (
              <a
                key={label}
                href={href ?? "#"}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-3 text-sm font-semibold transition-colors"
                style={{
                  color: isAction ? C.secondary : C.onSurface,
                  fontWeight: isAction ? 700 : 600,
                  borderTop: isAction
                    ? `1px solid ${C.outlineVariant}55`
                    : "none",
                  ...BD,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = C.surfaceLow)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {label}
                {isAction && (
                  <Icon
                    name="arrow_right_alt"
                    size={18}
                    style={{ color: C.secondary }}
                  />
                )}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 w-full z-50 backdrop-blur-xl"
      style={{ backgroundColor: `${C.surface}cc` }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Telnova logo"
            width={100}
            height={100}
            priority
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href, dropdown }) =>
            dropdown ? (
              <NavDropdown key={label} label={label} items={dropdown} />
            ) : (
              <a
                key={label}
                href={href ?? "#"}
                className="font-bold tracking-tight transition-all duration-300 pb-[4px]"
                style={{
                  ...HL,
                  color: C.onSurface,
                  opacity: 0.8,
                  borderBottom: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.secondary;
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.onSurface;
                  e.currentTarget.style.opacity = "0.8";
                }}
              >
                {label}
              </a>
            ),
          )}
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/signin"
            className="font-bold px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              color: C.onSurface,
              border: `1px solid ${C.outlineVariant}`,
              ...BD,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = C.surfaceLow)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Sign In
          </a>
          <button
            className="px-5 py-2.5 rounded-lg font-bold transition-transform duration-200 hover:scale-105 whitespace-nowrap"
            style={{ backgroundColor: C.primary, color: "#ffffff", ...BD }}
          >
            Call (888) 989-0150
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: C.onSurface }}
                aria-label="Open menu"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = C.surfaceLow)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Icon name="menu" size={28} />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-80 p-0 flex flex-col"
              style={{ backgroundColor: C.surfaceLowest }}
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: `1px solid ${C.outlineVariant}33` }}
              >
                <a href="/" className="flex items-center">
                  <Image
                    src="/logo.jpeg"
                    alt="Telnova logo"
                    width={52}
                    height={52}
                    priority
                  />
                </a>
                <SheetClose asChild>
                  <button
                    className="p-1 rounded-lg transition-colors"
                    style={{ color: C.onSurfaceVariant }}
                    aria-label="Close menu"
                  >
                    <Icon name="close" size={24} />
                  </button>
                </SheetClose>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {NAV_LINKS.map(({ label, href, dropdown }) => (
                  <div key={label}>
                    <SheetClose asChild>
                      <a
                        href={href ?? "#"}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-bold text-base transition-colors"
                        style={{ color: C.onSurface, ...HL }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = C.surfaceLow)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        {label}
                        {dropdown && (
                          <Icon
                            name="chevron_right"
                            size={20}
                            style={{ color: C.onSurfaceVariant }}
                          />
                        )}
                      </a>
                    </SheetClose>
                    {dropdown && (
                      <div className="ml-4 mt-1 space-y-1">
                        {dropdown.map(
                          ({ label: dl, href: dHref, isAction }) => (
                            <SheetClose key={dl} asChild>
                              <a
                                href={dHref ?? "#"}
                                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                                style={{
                                  color: isAction
                                    ? C.secondary
                                    : C.onSurfaceVariant,
                                  fontWeight: isAction ? 700 : 600,
                                  ...BD,
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    C.surfaceLow)
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "transparent")
                                }
                              >
                                {dl}
                                {isAction && (
                                  <Icon
                                    name="arrow_right_alt"
                                    size={16}
                                    style={{ color: C.secondary }}
                                  />
                                )}
                              </a>
                            </SheetClose>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div
                className="px-6 py-6 space-y-3"
                style={{ borderTop: `1px solid ${C.outlineVariant}33` }}
              >
                <SheetClose asChild>
                  <a
                    href="/signin"
                    className="w-full py-3 rounded-xl font-bold text-base text-center transition-colors block"
                    style={{
                      border: `1px solid ${C.outlineVariant}`,
                      color: C.onSurface,
                      ...BD,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = C.surfaceLow)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    Sign In
                  </a>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    className="w-full py-3 rounded-xl font-bold text-base"
                    style={{
                      backgroundColor: C.primary,
                      color: "#ffffff",
                      ...BD,
                    }}
                  >
                    Call (888) 989-0150
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
