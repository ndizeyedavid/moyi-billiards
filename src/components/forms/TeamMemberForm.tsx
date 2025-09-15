"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Save, Eye, User, Shield } from "lucide-react";
import Image from "next/image";

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

interface TeamMember {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  location: string;
  joinDate: string;
  status: string;
  avatar: string;
  permissions: string[];
  experience: string;
  bio?: string;
  skills?: string[];
  salary?: number;
  emergencyContact?: string;
  emergencyPhone?: string;
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
  const [formData, setFormData] = useState<TeamMember>({
    name: member?.name || "",
    email: member?.email || "",
    phone: member?.phone || "",
    role: member?.role || "",
    department: member?.department || "",
    location: member?.location || "Kigali, Rwanda",
    joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
    status: member?.status || "Active",
    avatar: member?.avatar || "",
    permissions: member?.permissions || [],
    experience: member?.experience || "",
    bio: member?.bio || "",
    skills: member?.skills || [],
    salary: member?.salary || 0,
    emergencyContact: member?.emergencyContact || "",
    emergencyPhone: member?.emergencyPhone || "",
  });

  const [avatarPreview, setAvatarPreview] = useState(member?.avatar || "");
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof TeamMember, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        handleInputChange("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePermission = (permission: string) => {
    const currentPermissions = formData.permissions;
    if (currentPermissions.includes(permission)) {
      handleInputChange("permissions", currentPermissions.filter(p => p !== permission));
    } else {
      handleInputChange("permissions", [...currentPermissions, permission]);
    }
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

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.experience.trim()) newErrors.experience = "Experience is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({ ...formData, id: member?.id });
      onClose();
    }
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
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter full name"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                        <Label htmlFor="location">Location</Label>
                        <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                          placeholder="Emergency contact name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                        <Input
                          id="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                          placeholder="+250 788 123 456"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Brief bio or description"
                        rows={3}
                      />
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
                        <Label htmlFor="joinDate">Join Date</Label>
                        <Input
                          id="joinDate"
                          type="date"
                          value={formData.joinDate}
                          onChange={(e) => handleInputChange("joinDate", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience *</Label>
                        <Input
                          id="experience"
                          value={formData.experience}
                          onChange={(e) => handleInputChange("experience", e.target.value)}
                          placeholder="e.g., 5 years"
                          className={errors.experience ? "border-red-500" : ""}
                        />
                        {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
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
                              checked={formData.permissions.includes(permission)}
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
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {avatarPreview ? (
                          <div className="relative">
                            <Image
                              src={avatarPreview}
                              alt="Avatar preview"
                              width={120}
                              height={120}
                              className="mx-auto rounded-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setAvatarPreview("");
                                handleInputChange("avatar", "");
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Upload profile picture</p>
                            <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="w-full text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium">{formData.name || "Not set"}</span>
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
                      <span className="text-sm text-muted-foreground">Experience:</span>
                      <span className="text-sm font-medium">{formData.experience || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Permissions:</span>
                      <span className="text-sm font-medium">{formData.permissions.length}</span>
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
                {formData.permissions.includes("Admin") && (
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
