"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Award,
  Briefcase,
  Code,
  Sparkles,
  Building,
  LineChart,
  CheckCircle,
  Clock,
  Zap,
  MapPin,
} from "lucide-react";
import Image from "next/image";

interface StatItemProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
  decimalPlaces?: number;
  color?: string;
}

const StatItem = ({
  value,
  label,
  icon,
  delay = 0,
  decimalPlaces = 0,
  color = "from-primary to-primary/70",
}: StatItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { resolvedTheme } = useTheme();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className={cn(
        "group border-border/30 bg-card relative overflow-hidden rounded-xl border p-6",
        resolvedTheme === "dark"
          ? "shadow-xl shadow-black/5"
          : "shadow-lg shadow-black/[0.03]"
      )}
    >
      <div
        className={cn(
          "absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-30 group-hover:blur-3xl",
          color
        )}
      />

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
            color
          )}
        >
          {icon}
        </div>

        <div className="flex flex-col">
          <h3 className="flex items-baseline text-3xl font-bold tracking-tight">
            <NumberTicker
              value={value}
              decimalPlaces={decimalPlaces}
              className="tabular-nums"
            />
            <span className="ml-1 text-sm font-medium opacity-70">+</span>
          </h3>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function AboutUs() {
  const aboutRef = useRef(null);
  const statsRef = useRef(null);
  const timelineRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });

  const stats = [
    {
      value: 105,
      label: "Happy Clients",
      icon: <Users className="h-5 w-5" />,
      delay: 0,
      color: "from-rose-500 to-orange-500",
      decimalPlaces: 0,
    },
    {
      value: 5,
      label: "Years Experience",
      icon: <Clock className="h-5 w-5" />,
      delay: 0.1,
      color: "from-blue-500 to-cyan-500",
      decimalPlaces: 0,
    },
    {
      value: 75,
      label: "Tables Sold",
      icon: <CheckCircle className="h-5 w-5" />,
      delay: 0.2,
      color: "from-green-500 to-emerald-500",
      decimalPlaces: 0,
    },
    {
      value: 19,
      label: "Operating Districts",
      icon: <MapPin className="h-5 w-5" />,
      delay: 0.3,
      color: "from-purple-500 to-violet-500",
      decimalPlaces: 0,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden py-16 md:pt-[130px]">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
        {/* Header Section with Badge */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4 flex justify-center"
          >
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 rounded-full px-4 py-1 text-sm font-medium"
            >
              <Sparkles className="text-primary mr-1 h-3.5 w-3.5" />
              About Us
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
          >
            About Our Company
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-muted-foreground mt-4 text-xl"
          >
            Delivering excellence for over 5 years
          </motion.p>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="mb-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatItem
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                delay={stat.delay || index * 0.1}
                decimalPlaces={stat.decimalPlaces}
                color={stat.color}
              />
            ))}
          </div>
        </div>

        {/* About Content Section */}
        <div ref={aboutRef} className="relative mx-auto mb-20">
          <div className="grid gap-16 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="relative space-y-6"
            >
              <div className="from-primary/80 to-primary/60 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg">
                <Image src="/thumb.png" alt="Logo" width={50} height={50} />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                Moyi Billiards
              </h2>

              <p className="text-muted-foreground text-base leading-relaxed">
                Welcome to the Great Moyi Billiards, your premium destination
                for exceptional pool tables. We blend artistry with precision to
                create tables that become the centerpiece of your space,
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="relative space-y-6"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/80 to-blue-500/60 text-white shadow-lg">
                <LineChart className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">Our Legacy</h2>

              <p className="text-muted-foreground text-base leading-relaxed">
                Since 2020, we&apos;ve revolutionized the billiards industry through
                innovation and craftsmanship. Each table tells a story of
                precision, passion, and perfection.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="mt-16 flex items-start gap-4"
          >
            <div className="from-primary/20 to-primary/5 text-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
              <Building className="h-5 w-5" />
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">
              We are a passionate team of experts dedicated to delivering
              exceptional solutions that help businesses thrive in the digital
              landscape. Our commitment to innovation and quality has made us a
              trusted partner for organizations worldwide.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
