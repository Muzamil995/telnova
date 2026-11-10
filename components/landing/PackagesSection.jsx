"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const packages = [
  {
    title: "Smart Bundle",
    items: "Internet + Mobile",
    description: "Best for those who want to save and stream",
    speeds: "100 Mbps to 7 Gig",
    price: "$50/mo",
  },
  {
    title: "Smarter Bundle",
    items: "Internet + TV + Mobile + Home Phone",
    description:
      "Best for families who love entertainment and staying connected",
    speeds: "100 Mbps to 7 Gig",
    price: "$85/mo",
    popular: true,
  },
  {
    title: "Smartest Bundle",
    items:
      "Internet + TV + Mobile + Home Phone + Home Security + Home Warranty",
    description:
      "Best for highly connected households building a protected smart home",
    speeds: "100 Mbps to 7 Gig",
    price: "$145.98/mo",
  },
];

export default function PackagesSection() {
  return (
    <section
      id="packages"
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-primary/80 sm:text-4xl">
          Choose Your Bundle
        </h2>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {packages.map((pkg) => (
          <motion.div
            key={pkg.title}
            variants={fadeUp}
            whileHover={{ scale: 1.03, y: -8 }}
            className={pkg.popular ? "md:scale-[1.02]" : ""}
          >
            <Card
              className={`h-full border bg-card/70 backdrop-blur ${pkg.popular ? "border-primary shadow-lg" : ""}`}
            >
              <CardHeader>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <CardTitle>{pkg.title}</CardTitle>
                  {pkg.popular ? <Badge>Most Popular</Badge> : null}
                </div>
                <CardDescription className="text-foreground font-medium">
                  {pkg.items}
                </CardDescription>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-background/70 p-3">
                  <p className="text-sm text-muted-foreground">Speeds</p>
                  <p className="font-semibold">{pkg.speeds}</p>
                </div>
                <div className="rounded-lg border bg-background/70 p-3">
                  <p className="text-sm text-muted-foreground">Starting at</p>
                  <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="w-full">Get This Deal</Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
