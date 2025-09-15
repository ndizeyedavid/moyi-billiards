"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Eye,
  Trash2,
  Search,
  Filter,
  Reply,
  Archive,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContactReplyForm from "@/components/forms/ContactReplyForm";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for contact forms
const contactForms = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+250 788 123 456",
    subject: "Custom Pool Table Inquiry",
    message: "I'm interested in getting a custom pool table for my home. Could you provide more information about your custom options and pricing?",
    date: "2024-01-15",
    time: "14:30",
    status: "New",
    priority: "High",
    source: "Website",
    category: "Sales Inquiry",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah.smith@example.com",
    phone: "+250 788 987 654",
    subject: "Pool Table Maintenance Service",
    message: "My pool table needs professional maintenance. The felt is worn and some pockets need repair. When can you schedule a service visit?",
    date: "2024-01-14",
    time: "10:15",
    status: "Replied",
    priority: "Medium",
    source: "Website",
    category: "Service Request",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+250 788 456 789",
    subject: "Installation Services",
    message: "I purchased a pool table and need installation services. Do you provide installation in Kigali area?",
    date: "2024-01-13",
    time: "16:45",
    status: "In Progress",
    priority: "High",
    source: "Phone",
    category: "Installation",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "+250 788 321 987",
    subject: "Tournament Table Rental",
    message: "We're organizing a pool tournament and need to rent professional tournament tables. What are your rental rates and availability?",
    date: "2024-01-12",
    time: "09:20",
    status: "Closed",
    priority: "Medium",
    source: "Website",
    category: "Rental",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "+250 788 654 321",
    subject: "Bulk Order Inquiry",
    message: "I represent a hotel chain and we're interested in purchasing multiple pool tables for our properties. Can we discuss bulk pricing?",
    date: "2024-01-11",
    time: "11:30",
    status: "New",
    priority: "High",
    source: "Email",
    category: "Bulk Order",
  },
];

const contactStats = [
  {
    title: "Total Contacts",
    value: "147",
    change: "+12 this week",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "New Messages",
    value: "23",
    change: "+5 today",
    icon: Mail,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Response Rate",
    value: "94%",
    change: "+2% this month",
    icon: CheckCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
  {
    title: "Avg. Response Time",
    value: "2.4h",
    change: "-0.3h improvement",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
];

const categories = ["All", "Sales Inquiry", "Service Request", "Installation", "Rental", "Bulk Order"];
const statuses = ["All", "New", "In Progress", "Replied", "Closed"];
const priorities = ["All", "High", "Medium", "Low"];

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [isContactReplyFormOpen, setIsContactReplyFormOpen] = useState(false);
  const [replyingToContact, setReplyingToContact] = useState<any>(null);

  const filteredContacts = contactForms.filter((contact) => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "All" || contact.category === filterCategory;
    const matchesStatus = filterStatus === "All" || contact.status === filterStatus;
    const matchesPriority = filterPriority === "All" || contact.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const handleReplyToContact = (contact: any) => {
    setReplyingToContact(contact);
    setIsContactReplyFormOpen(true);
  };

  const handleSendReply = (replyData: any) => {
    console.log('Send reply:', replyData);
    setIsContactReplyFormOpen(false);
    setReplyingToContact(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "destructive";
      case "In Progress":
        return "default";
      case "Replied":
        return "secondary";
      case "Closed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contact Forms</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and messages
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Archive className="h-4 w-4" />
            Archive Selected
          </Button>
          <Button className="gap-2">
            <Reply className="h-4 w-4" />
            Bulk Reply
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactStats.map((stat, index) => (
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
                placeholder="Search contacts..."
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
                    Category: {filterCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setFilterCategory(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Status: {filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {statuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setFilterStatus(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Priority: {filterPriority}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {priorities.map((priority) => (
                    <DropdownMenuItem
                      key={priority}
                      onClick={() => setFilterPriority(priority)}
                    >
                      {priority}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{contact.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {contact.category}
                      </Badge>
                      <span className={`text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                        {contact.priority} Priority
                      </span>
                    </div>
                    <Badge variant={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-base">{contact.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {contact.message}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {contact.date} at {contact.time}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {contact.source}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReplyToContact(contact)}>
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Reply Form Modal */}
      <ContactReplyForm
        isOpen={isContactReplyFormOpen}
        onClose={() => {
          setIsContactReplyFormOpen(false);
          setReplyingToContact(null);
        }}
        onSend={handleSendReply}
        contact={replyingToContact}
      />
    </div>
  );
}
