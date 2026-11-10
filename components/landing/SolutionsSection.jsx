"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Tv, Wifi, Smartphone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const solutions = [
  {
    icon: Wifi,
    title: "Internet",
    description:
      "High-speed fiber and cable plans tailored to your household usage.",
  },
  {
    icon: Smartphone,
    title: "Mobile",
    description:
      "Flexible mobile bundles for families, remote workers, and power users.",
  },
  {
    icon: Tv,
    title: "TV",
    description:
      "Entertainment packages with sports, streaming, and premium channels.",
  },
  {
    icon: Shield,
    title: "Home Security",
    description:
      "Smart protection with connected monitoring and instant alerts.",
  },
];

export default function SolutionsSection() {
  return (
    <motion.section
      id="solutions"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="bg-muted/30 py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary/80 sm:text-4xl">
            Get the Most Out of Your Home Services
          </h2>
          <p className="mt-4 text-muted-foreground">
            With 1000+ global partners and top US providers, we ensure quick
            access to telecom, home security, mobile, and internet packages in
            one place.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution, idx) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <Card className="h-full">
                  <CardContent className="space-y-4 pt-6">
                    <motion.div
                      whileHover={{ scale: 1.12 }}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">{solution.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {solution.description}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
