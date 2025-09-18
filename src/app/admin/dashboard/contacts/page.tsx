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
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getContacts,
  deleteContact,
  createContactReply,
} from "@/lib/actions/contacts";
import { toast } from "sonner";

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

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  replies?: ContactReply[];
}

interface ContactReply {
  id: string;
  contactId: string;
  subject: string;
  message: string;
  senderName?: string;
  senderEmail?: string;
  createdAt: Date;
}

const categories = [
  "All",
  "Sales Inquiry",
  "Service Request",
  "Installation",
  "Rental",
  "Bulk Order",
];
const statuses = ["All", "New", "In Progress", "Replied", "Closed"];
const priorities = ["All", "High", "Medium", "Low"];

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [isContactReplyFormOpen, setIsContactReplyFormOpen] = useState(false);
  const [replyingToContact, setReplyingToContact] = useState<Contact | null>(
    null
  );
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contacts on component mount and when filters change
  useEffect(() => {
    fetchContacts();
  }, [searchQuery, filterCategory, filterStatus, filterPriority]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getContacts({
        search: searchQuery || undefined,
        category: filterCategory !== "All" ? filterCategory : undefined,
        status: filterStatus !== "All" ? filterStatus : undefined,
        priority: filterPriority !== "All" ? filterPriority : undefined,
        limit: 50, // Get more contacts for the dashboard
      });

      if (result.success && result.data) {
        // Transform the data to match our interface
        const transformedContacts = result.data.contacts.map(
          (contact: any) => ({
            ...contact,
            replies: contact.replies || [],
          })
        );
        setContacts(transformedContacts);
      } else {
        setError(result.error || "Failed to fetch contacts");
        toast.error("Failed to load contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError("Failed to fetch contacts");
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  // Calculate contact statistics from real data
  const contactStats = [
    {
      title: "Total Contacts",
      value: contacts.length.toString(),
      change: `${contacts.length} total`,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "New Messages",
      value: contacts.filter((c) => c.status === "New").length.toString(),
      change: "Needs attention",
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Response Rate",
      value:
        contacts.length > 0
          ? `${Math.round(
              (contacts.filter((c) => c.status === "Replied").length /
                contacts.length) *
                100
            )}%`
          : "0%",
      change: "Replied contacts",
      icon: CheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "High Priority",
      value: contacts.filter((c) => c.priority === "High").length.toString(),
      change: "Urgent items",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || contact.category === filterCategory;
    const matchesStatus =
      filterStatus === "All" || contact.status === filterStatus;
    const matchesPriority =
      filterPriority === "All" || contact.priority === filterPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const handleReplyToContact = (contact: Contact) => {
    setReplyingToContact(contact);
    setIsContactReplyFormOpen(true);
  };

  const handleSendReply = async (replyData: any) => {
    try {
      const result = await createContactReply(replyData);
      if (result.success) {
        toast.success("Reply sent successfully");
        fetchContacts(); // Refresh the contacts list
      } else {
        toast.error(result.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
    setIsContactReplyFormOpen(false);
    setReplyingToContact(null);
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const result = await deleteContact(contactId);
      if (result.success) {
        toast.success("Contact deleted successfully");
        fetchContacts();
      } else {
        toast.error(result.error || "Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading contacts...</span>
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
            <Button onClick={fetchContacts}>Try Again</Button>
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
          <h1 className="text-3xl font-bold">Contact Forms</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and messages
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Archive className="h-4 w-4" />
            Archive Selected
          </Button>
          <Button className="gap-2">
            <Reply className="h-4 w-4" />
            Bulk Reply
          </Button>
        </div> */}
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
                      <span
                        className={`text-xs font-medium ${getPriorityColor(
                          contact.priority
                        )}`}
                      >
                        {contact.priority} Priority
                      </span>
                    </div>
                    {/* <Badge variant={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge> */}
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
                      {new Date(contact.createdAt).toLocaleDateString()} at{" "}
                      {new Date(contact.createdAt).toLocaleTimeString()}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {contact.source}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleReplyToContact(contact)}
                  >
                    <Reply className="h-4 w-4" />
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
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
        contact={replyingToContact as any}
      />
    </div>
  );
}
