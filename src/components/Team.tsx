"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

interface TeamProps {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
  className?: string;
}

// Default team members data
const defaultMembers: TeamMember[] = [
  {
    name: "Robert Brown",
    role: "CEO & Co-Founder",
    imageUrl: "https://i.pravatar.cc",
  },
  {
    name: "Leslie Livingston",
    role: "CTO & Co-Founder",
    imageUrl: "https://i.pravatar.cc",
  },
  {
    name: "Joseph McFall",
    role: "Front-end Developer",
    imageUrl: "https://i.pravatar.cc",
  },
  {
    name: "Helene Engels",
    role: "Front-end Developer",
    imageUrl: "https://i.pravatar.cc",
  },
  {
    name: "Thom Belly",
    role: "UI/UX Designer",
    imageUrl: "https://i.pravatar.cc",
  },
  {
    name: "Bonnie Green",
    role: "Product Manager",
    imageUrl: "https://i.pravatar.cc",
  },
  {
    name: "Roberta Casas",
    role: "Content Strategist",
    imageUrl: "https://i.pravatar.cc",
  },
  {
    name: "Jesse Leos",
    role: "Back-end Developer",
    imageUrl: "https://i.pravatar.cc",
  },
];

export default function Team({
  title = "Our people make us great",
  subtitle = "You'll interact with talented professionals, will be challenged to solve difficult problems and think in new and creative ways.",
  members = defaultMembers,
  className,
}: TeamProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden py-16 md:py-14",
        className
      )}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          <h2 className="from-foreground/80 via-foreground to-foreground/80 dark:from-foreground/70 dark:via-foreground dark:to-foreground/70 mb-4 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground md:text-lg">{subtitle}</p>
        </motion.div>

        {/* Team members grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          {members.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamMemberCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * (index % 4) }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-xl"
    >
      {/* Image container */}
      <div className="bg-muted relative aspect-square overflow-hidden rounded-xl">
        <div className="from-background/80 absolute inset-0 z-10 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Image
          src={member.imageUrl}
          alt={member.name}
          width={300}
          height={300}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Name and role */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold">{member.name}</h3>
        <p className="text-primary text-sm">{member.role}</p>
      </div>
    </motion.div>
  );
}
