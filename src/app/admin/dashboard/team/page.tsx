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
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getTeamMembers, deleteTeamMember } from "@/lib/actions/team-members";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TeamMemberForm from "@/components/forms/TeamMemberForm";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  department: string;
  startDate: Date;
  status: string;
  avatar?: string | null;
  permissions: any; // JsonValue from Prisma
  skills: string[];
  salary?: number | null;
  emergencyContact?: any | null; // JsonValue from Prisma
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const departments = [
  "All",
  "Leadership",
  "Sales",
  "Manufacturing",
  "Marketing",
  "Operations",
  "Support",
];
const roles = [
  "All",
  "CEO & Founder",
  "Sales Manager",
  "Production Manager",
  "Marketing Specialist",
  "Installation Technician",
  "Customer Service Rep",
];
const statuses = ["All", "Active", "On Leave", "Inactive"];

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [isTeamMemberFormOpen, setIsTeamMemberFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTeamMembers();
      if (result.success && result.data) {
        // Transform the data to match our interface
        const transformedMembers = result.data.teamMembers.map(
          (member: any) => ({
            ...member,
            salary: member.salary ? Number(member.salary) : null,
            permissions: member.permissions || {},
            skills: member.skills || [],
            emergencyContact: member.emergencyContact || {},
          })
        );
        setTeamMembers(transformedMembers);
      } else {
        setError(result.error || "Failed to fetch team members");
        toast.error("Failed to load team members");
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to fetch team members");
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  // Calculate team statistics from real data
  const teamStats = [
    {
      title: "Total Members",
      value: teamMembers.length.toString(),
      change: `${teamMembers.length} total`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Active Members",
      value: teamMembers.filter((m) => m.status === "Active").length.toString(),
      change: `${Math.round(
        (teamMembers.filter((m) => m.status === "Active").length /
          Math.max(teamMembers.length, 1)) *
          100
      )}% active rate`,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Departments",
      value: new Set(teamMembers.map((m) => m.department)).size.toString(),
      change: "Well organized",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Total Skills",
      value: teamMembers
        .reduce((acc, m) => acc + (m.skills?.length || 0), 0)
        .toString(),
      change: "Skills tracked",
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  const filteredMembers = teamMembers.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      filterDepartment === "All" || member.department === filterDepartment;
    const matchesRole = filterRole === "All" || member.role === filterRole;
    const matchesStatus =
      selectedStatus === "All" || member.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  const handleAddMember = () => {
    setEditingMember(null);
    setIsTeamMemberFormOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsTeamMemberFormOpen(true);
  };

  const handleSaveMember = (memberData: any) => {
    // Refresh the team members list after save
    fetchTeamMembers();
    setIsTeamMemberFormOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const result = await deleteTeamMember(memberId);
      if (result.success) {
        toast.success("Team member deleted successfully");
        fetchTeamMembers();
      } else {
        toast.error(result.error || "Failed to delete team member");
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    }
  };

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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading team members...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchTeamMembers}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

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
        <Button className="gap-2" onClick={handleAddMember}>
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
                name="search"
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
                    Department: {filterDepartment}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {departments.map((department) => (
                    <DropdownMenuItem
                      key={department}
                      onClick={() => setFilterDepartment(department)}
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
          const fullName = `${member.firstName} ${member.lastName}`;
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
                          src={member.avatar || "/logo.png"}
                          alt={fullName}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="absolute -top-1 -right-1">
                          <RoleIcon className="h-4 w-4 text-yellow-600 bg-white rounded-full p-0.5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{fullName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
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
                      <span>{member.phone || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{member.address || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Joined {new Date(member.startDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Department</span>
                        <Badge variant="outline" className="text-xs">
                          {member.department}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Skills</span>
                        <span className="font-medium">
                          {member.skills?.length || 0}
                        </span>
                      </div>

                      {member.salary && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Salary</span>
                          <span className="font-medium">
                            {member.salary.toLocaleString()} RWF
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-1">
                        Permissions:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(member.permissions || {})
                          .filter(([_, value]) => value)
                          .map(([permission]) => (
                            <Badge
                              key={permission}
                              variant="secondary"
                              className="text-xs"
                            >
                              {permission}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Created:{" "}
                        {new Date(member.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Team Member Form Modal */}
      <TeamMemberForm
        isOpen={isTeamMemberFormOpen}
        onClose={() => {
          setIsTeamMemberFormOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        member={editingMember as any}
      />
    </div>
  );
}
