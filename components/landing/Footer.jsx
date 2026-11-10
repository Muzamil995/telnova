"use client";

import Image from "next/image";
import { C, HL, BD } from "./tokens";
import Icon from "./Icon";

const FOOTER_GROUPS = [
  {
    heading: "Services",
    links: [
      { label: "Fiber Internet", href: "#" },
      { label: "Mobile Network", href: "#" },
      { label: "NovaStream TV", href: "#" },
      { label: "Home Security", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Fiber Map", href: "#" },
      { label: "Affiliate Program", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full py-20" style={{ backgroundColor: C.surfaceLow }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto px-8">
        <div className="space-y-6">
          <a href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Telnova logo" width={80} height={80} />
          </a>
          <p
            className="text-sm leading-relaxed"
            style={{ color: C.onSurface, opacity: 0.7, ...BD }}
          >
            Telnova.ai is an authorized retailer for select providers and
            service partners. Services, pricing, promotions, equipment, fees,
            and availability vary by provider and location and are subject to
            change.
          </p>
        </div>

        {FOOTER_GROUPS.map(({ heading, links }) => (
          <div key={heading} className="space-y-4">
            <p
              className="text-sm uppercase tracking-widest font-bold"
              style={{ ...BD, color: C.primary }}
            >
              {heading}
            </p>
            <nav className="flex flex-col gap-2">
              {links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm transition-colors"
                  style={{ color: C.onSurface, opacity: 0.7, ...BD }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.secondary;
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.onSurface;
                    e.currentTarget.style.opacity = "0.7";
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        ))}

        <div className="space-y-4">
          <p
            className="text-sm uppercase tracking-widest font-bold"
            style={{ ...BD, color: C.primary }}
          >
            Connect
          </p>
          <nav className="flex flex-col gap-2">
            {["Contact", "Help Center"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm transition-colors"
                style={{ color: C.onSurface, opacity: 0.7, ...BD }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.secondary;
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.onSurface;
                  e.currentTarget.style.opacity = "0.7";
                }}
              >
                {l}
              </a>
            ))}
            <div className="flex gap-4 pt-4">
              {["public", "forum", "share"].map((icon) => (
                <Icon
                  key={icon}
                  name={icon}
                  size={22}
                  className="cursor-pointer transition-colors"
                  style={{ color: C.onSurfaceVariant }}
                />
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto px-8 mt-20 pt-8"
        style={{ borderTop: `1px solid ${C.outlineVariant}1a` }}
      >
        <p
          className="text-xs text-center"
          style={{ color: C.onSurface, opacity: 0.7, ...BD }}
        >
          © 2024 TELNOVA Intelligence. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
