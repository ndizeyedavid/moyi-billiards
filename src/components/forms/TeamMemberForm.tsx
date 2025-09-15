"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { X, Upload, Save, Eye, User, Shield } from "lucide-react";
import { createTeamMember, updateTeamMember } from "@/lib/actions/team-members";
import { TeamMemberInput } from "@/lib/validations";
import { toast } from "sonner";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamMember extends TeamMemberInput {
  id?: string;
  startDate: Date;
  emergencyContact?: Record<string, any>;
  address?: string;
}

interface TeamMemberFormProps {
  member?: TeamMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: TeamMember) => void;
}

const departments = ["Leadership", "Sales", "Manufacturing", "Marketing", "Operations", "Support", "Finance", "HR"];
const roles = [
  "CEO & Founder", "Sales Manager", "Production Manager", "Marketing Specialist", 
  "Installation Technician", "Customer Service Rep", "Accountant", "HR Manager"
];
const statuses = ["Active", "On Leave", "Inactive"];
const locations = ["Kigali, Rwanda", "Butare, Rwanda", "Gisenyi, Rwanda", "Remote"];
const permissionOptions = [
  "Admin", "All Access", "Sales", "Customer Management", "Production", 
  "Quality Control", "Marketing", "Content Management", "Installation", 
  "Maintenance", "Customer Support", "Finance", "HR"
];

export default function TeamMemberForm({ member, isOpen, onClose, onSave }: TeamMemberFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<TeamMember>({
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    email: member?.email || "",
    phone: member?.phone || "",
    role: member?.role || "",
    department: member?.department || "",
    startDate: member?.startDate || new Date(),
    status: member?.status || "Active",
    avatar: member?.avatar || "",
    permissions: member?.permissions || {},
    skills: member?.skills || [],
    salary: member?.salary || 0,
    emergencyContact: member?.emergencyContact || {},
    address: member?.address || "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof TeamMember, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAvatarUpload = (url: string) => {
    handleInputChange("avatar", url);
  };

  const handleAvatarRemove = () => {
    handleInputChange("avatar", "");
  };

  const togglePermission = (permission: string) => {
    const currentPermissions = formData.permissions as Record<string, boolean> || {};
    handleInputChange("permissions", {
      ...currentPermissions,
      [permission]: !currentPermissions[permission]
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills!.includes(skillInput.trim())) {
      handleInputChange("skills", [...(formData.skills || []), skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleInputChange("skills", formData.skills!.filter(skill => skill !== skillToRemove));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        if (member?.id) {
          await updateTeamMember(member.id, formData);
          toast.success("Team member updated successfully!");
        } else {
          await createTeamMember(formData);
          toast.success("Team member created successfully!");
        }
        onSave({ ...formData, id: member?.id });
        onClose();
      } catch (error) {
        toast.error("Failed to save team member. Please try again.");
        console.error("Error saving team member:", error);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {member ? "Edit Team Member" : "Add New Team Member"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          placeholder="Enter first name"
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          placeholder="Enter last name"
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter email address"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+250 788 123 456"
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address || ""}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Enter address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                        <Input
                          id="emergencyContactName"
                          value={(formData.emergencyContact as any)?.name || ""}
                          onChange={(e) => handleInputChange("emergencyContact", { ...formData.emergencyContact, name: e.target.value })}
                          placeholder="Emergency contact name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                        <Input
                          id="emergencyContactPhone"
                          value={(formData.emergencyContact as any)?.phone || ""}
                          onChange={(e) => handleInputChange("emergencyContact", { ...formData.emergencyContact, phone: e.target.value })}
                          placeholder="+250 788 123 456"
                        />
                      </div>
                    </div>

                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Job Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Job Title *</Label>
                        <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                          <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department *</Label>
                        <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                          <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem key={department} value={department}>
                                {department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ""}
                          onChange={(e) => handleInputChange("startDate", new Date(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salary">Salary (Optional)</Label>
                        <Input
                          id="salary"
                          type="number"
                          value={formData.salary || ""}
                          onChange={(e) => handleInputChange("salary", Number(e.target.value))}
                          placeholder="Monthly salary in RWF"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Permissions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Skills</Label>
                      <div className="flex gap-2">
                        <Input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add skill"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill} size="sm">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills?.map((skill) => (
                          <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                            {skill} ×
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {permissionOptions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Switch
                              id={permission}
                              checked={(formData.permissions as any)?.[permission] || false}
                              onCheckedChange={() => togglePermission(permission)}
                            />
                            <Label htmlFor={permission} className="text-sm">
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Avatar and Summary - 1/3 width */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      value={formData.avatar || ""}
                      onChange={handleAvatarUpload}
                      onRemove={handleAvatarRemove}
                      folder="team"
                      placeholder="Upload profile picture"
                      aspectRatio="square"
                      width={120}
                      height={120}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium">{`${formData.firstName} ${formData.lastName}` || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Role:</span>
                      <span className="text-sm font-medium">{formData.role || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Department:</span>
                      <span className="text-sm font-medium">{formData.department || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Permissions:</span>
                      <span className="text-sm font-medium">{Object.keys(formData.permissions || {}).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={formData.status === "Active" ? "default" : "secondary"}>
                        {formData.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-2">
                <Badge variant={formData.status === "Active" ? "default" : "secondary"}>
                  {formData.status}
                </Badge>
                {(formData.permissions as any)?.Admin && (
                  <Badge variant="outline" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="button" variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {member ? "Update Member" : "Add Member"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
