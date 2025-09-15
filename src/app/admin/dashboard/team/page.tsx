"use client";

import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  UserCheck,
  Crown,
  Star,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "Wilson Moyi",
    email: "wilson@moyibilliards.com",
    phone: "+250 788 123 456",
    role: "CEO & Founder",
    department: "Leadership",
    location: "Kigali, Rwanda",
    joinDate: "2020-01-15",
    status: "Active",
    avatar: "/logo.png",
    permissions: ["Admin", "All Access"],
    lastActive: "2024-01-15 14:30",
    projects: 12,
    experience: "15+ years",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@moyibilliards.com",
    phone: "+250 788 987 654",
    role: "Sales Manager",
    department: "Sales",
    location: "Kigali, Rwanda",
    joinDate: "2021-03-20",
    status: "Active",
    avatar: "/logo.png",
    permissions: ["Sales", "Customer Management"],
    lastActive: "2024-01-15 12:15",
    projects: 8,
    experience: "8 years",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@moyibilliards.com",
    phone: "+250 788 456 789",
    role: "Production Manager",
    department: "Manufacturing",
    location: "Kigali, Rwanda",
    joinDate: "2020-08-10",
    status: "Active",
    avatar: "/logo.png",
    permissions: ["Production", "Quality Control"],
    lastActive: "2024-01-15 16:45",
    projects: 15,
    experience: "12 years",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@moyibilliards.com",
    phone: "+250 788 321 987",
    role: "Marketing Specialist",
    department: "Marketing",
    location: "Kigali, Rwanda",
    joinDate: "2022-01-05",
    status: "Active",
    avatar: "/logo.png",
    permissions: ["Marketing", "Content Management"],
    lastActive: "2024-01-15 10:20",
    projects: 6,
    experience: "5 years",
  },
  {
    id: 5,
    name: "David Uwimana",
    email: "david@moyibilliards.com",
    phone: "+250 788 654 321",
    role: "Installation Technician",
    department: "Operations",
    location: "Kigali, Rwanda",
    joinDate: "2021-06-15",
    status: "Active",
    avatar: "/logo.png",
    permissions: ["Installation", "Maintenance"],
    lastActive: "2024-01-15 08:30",
    projects: 10,
    experience: "7 years",
  },
  {
    id: 6,
    name: "Grace Mukamana",
    email: "grace@moyibilliards.com",
    phone: "+250 788 789 123",
    role: "Customer Service Rep",
    department: "Support",
    location: "Kigali, Rwanda",
    joinDate: "2022-09-01",
    status: "On Leave",
    avatar: "/logo.png",
    permissions: ["Customer Support"],
    lastActive: "2024-01-10 17:00",
    projects: 4,
    experience: "3 years",
  },
];

const teamStats = [
  {
    title: "Total Members",
    value: "12",
    change: "+2 this quarter",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "Active Members",
    value: "11",
    change: "91% active rate",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Departments",
    value: "6",
    change: "Well organized",
    icon: Shield,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
  {
    title: "Avg. Experience",
    value: "8.2 yrs",
    change: "Highly experienced",
    icon: Star,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
];

const departments = ["All", "Leadership", "Sales", "Manufacturing", "Marketing", "Operations", "Support"];
const roles = ["All", "CEO & Founder", "Sales Manager", "Production Manager", "Marketing Specialist", "Installation Technician", "Customer Service Rep"];
const statuses = ["All", "Active", "On Leave", "Inactive"];

export default function TeamMembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "All" || member.department === selectedDepartment;
    const matchesRole = selectedRole === "All" || member.role === selectedRole;
    const matchesStatus = selectedStatus === "All" || member.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "On Leave":
        return "secondary";
      case "Inactive":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.includes("CEO") || role.includes("Founder")) return Crown;
    if (role.includes("Manager")) return Shield;
    return UserCheck;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team and organizational structure
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Department: {selectedDepartment}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {departments.map((department) => (
                    <DropdownMenuItem
                      key={department}
                      onClick={() => setSelectedDepartment(department)}
                    >
                      {department}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Status: {selectedStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {statuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member, index) => {
          const RoleIcon = getRoleIcon(member.role);
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="absolute -top-1 -right-1">
                          <RoleIcon className="h-4 w-4 text-yellow-600 bg-white rounded-full p-0.5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{member.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{member.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {member.joinDate}</span>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Department</span>
                        <Badge variant="outline" className="text-xs">
                          {member.department}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Experience</span>
                        <span className="font-medium">{member.experience}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Projects</span>
                        <span className="font-medium">{member.projects}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-1">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Last active: {member.lastActive}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
