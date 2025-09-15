"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Send,
  Save,
  Paperclip,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  status: string;
  priority: string;
  category: string;
}

interface ContactReply {
  subject: string;
  message: string;
  template: string;
  cc: string;
  bcc: string;
  priority: string;
  sendCopy: boolean;
  scheduleSend: boolean;
  scheduleDate: string;
  scheduleTime: string;
}

interface ContactReplyFormProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onSend: (reply: ContactReply) => void;
}

const replyTemplates = [
  { value: "custom", label: "Custom Reply" },
  { value: "acknowledgment", label: "Acknowledgment" },
  { value: "quote_request", label: "Quote Request Response" },
  { value: "service_inquiry", label: "Service Inquiry Response" },
  { value: "installation", label: "Installation Information" },
  { value: "maintenance", label: "Maintenance Response" },
];

const templateContent = {
  acknowledgment: {
    subject: "Thank you for contacting Moyi Billiards",
    message: `Dear {{name}},

Thank you for reaching out to Moyi Billiards. We have received your inquiry regarding "{{subject}}" and appreciate your interest in our products and services.

Our team will review your message and get back to you within 24 hours with a detailed response.

If you have any urgent questions, please don't hesitate to call us at +250 788 123 456.

Best regards,
Wilson Moyi
CEO & Founder
Moyi Billiards`,
  },
  quote_request: {
    subject: "Pool Table Quote - {{subject}}",
    message: `Dear {{name}},

Thank you for your interest in our pool tables. Based on your inquiry, I would be happy to provide you with a detailed quote.

To ensure we provide you with the most accurate pricing and recommendations, could you please provide the following information:

1. Preferred table size (7ft, 8ft, or 9ft)
2. Budget range
3. Installation location
4. Any specific features or requirements

We offer competitive pricing and professional installation services throughout Rwanda. Our tables come with a comprehensive warranty and ongoing support.

I look forward to helping you find the perfect pool table for your needs.

Best regards,
Wilson Moyi
CEO & Founder
Moyi Billiards`,
  },
  service_inquiry: {
    subject: "Pool Table Service - {{subject}}",
    message: `Dear {{name}},

Thank you for contacting us about pool table service. We provide comprehensive maintenance and repair services for all types of pool tables.

Our services include:
- Felt replacement and repair
- Pocket repair and replacement
- Table releveling
- Cue tip replacement
- General maintenance and cleaning

We can schedule a service visit at your convenience. Our technician will assess your table and provide a detailed quote for any required work.

Please let me know your preferred date and time, and we'll arrange a visit.

Best regards,
Wilson Moyi
CEO & Founder
Moyi Billiards`,
  },
  installation: {
    subject: "Pool Table Installation - {{subject}}",
    message: `Dear {{name}},

Thank you for your inquiry about our installation services. We provide professional installation for all our pool tables throughout Rwanda.

Our installation service includes:
- Professional assembly and setup
- Table leveling and alignment
- Felt installation and finishing
- Accessory setup (cues, balls, rack, etc.)
- Quality testing and final inspection

Installation typically takes 2-4 hours depending on the table size and complexity. We also provide a 30-day warranty on our installation work.

To schedule your installation, please provide:
1. Your location/address
2. Preferred installation date
3. Table model (if already purchased)

We'll coordinate with you to ensure a smooth installation process.

Best regards,
Wilson Moyi
CEO & Founder
Moyi Billiards`,
  },
  maintenance: {
    subject: "Pool Table Maintenance - {{subject}}",
    message: `Dear {{name}},

Thank you for reaching out about pool table maintenance. Regular maintenance is essential for keeping your table in optimal playing condition.

We recommend the following maintenance schedule:
- Monthly: Basic cleaning and inspection
- Quarterly: Professional cleaning and adjustment
- Annually: Comprehensive service and felt inspection

Our maintenance services include:
- Professional cleaning of felt and rails
- Pocket inspection and adjustment
- Table leveling check
- Cue maintenance
- Accessory inspection

We offer maintenance packages that can save you money while ensuring your table stays in perfect condition.

Would you like to schedule a maintenance visit or learn more about our service packages?

Best regards,
Wilson Moyi
CEO & Founder
Moyi Billiards`,
  },
};

export default function ContactReplyForm({
  contact,
  isOpen,
  onClose,
  onSend,
}: ContactReplyFormProps) {
  const [formData, setFormData] = useState<ContactReply>({
    subject: `Re: mellow`,
    message: "",
    template: "custom",
    cc: "",
    bcc: "",
    priority: "Normal",
    sendCopy: true,
    scheduleSend: false,
    scheduleDate: "",
    scheduleTime: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ContactReply, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTemplateChange = (template: string) => {
    handleInputChange("template", template);

    if (
      template !== "custom" &&
      templateContent[template as keyof typeof templateContent]
    ) {
      const content = templateContent[template as keyof typeof templateContent];
      const personalizedSubject = content.subject
        .replace("{{name}}", contact.name)
        .replace("{{subject}}", contact.subject);
      const personalizedMessage = content.message
        .replace("{{name}}", contact.name)
        .replace("{{subject}}", contact.subject);

      handleInputChange("subject", personalizedSubject);
      handleInputChange("message", personalizedMessage);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (formData.scheduleSend) {
      if (!formData.scheduleDate)
        newErrors.scheduleDate = "Schedule date is required";
      if (!formData.scheduleTime)
        newErrors.scheduleTime = "Schedule time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSend(formData);
      onClose();
    }
  };

  const handleSaveDraft = () => {
    // Save as draft logic
    console.log("Saving draft:", formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Reply to Contact</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Reply Form - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reply Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="template">Reply Template</Label>
                      <Select
                        value={formData.template}
                        onValueChange={handleTemplateChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {replyTemplates.map((template) => (
                            <SelectItem
                              key={template.value}
                              value={template.value}
                            >
                              {template.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        placeholder="Enter email subject"
                        className={errors.subject ? "border-red-500" : ""}
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-500">{errors.subject}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder="Type your reply message here..."
                        rows={12}
                        className={errors.message ? "border-red-500" : ""}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">{errors.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Characters: {formData.message.length}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cc">CC (Optional)</Label>
                        <Input
                          id="cc"
                          value={formData.cc}
                          onChange={(e) =>
                            handleInputChange("cc", e.target.value)
                          }
                          placeholder="cc@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bcc">BCC (Optional)</Label>
                        <Input
                          id="bcc"
                          value={formData.bcc}
                          onChange={(e) =>
                            handleInputChange("bcc", e.target.value)
                          }
                          placeholder="bcc@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          handleInputChange("priority", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Send Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sendCopy"
                        checked={formData.sendCopy}
                        onChange={(e) =>
                          handleInputChange("sendCopy", e.target.checked)
                        }
                        className="rounded"
                      />
                      <Label htmlFor="sendCopy">Send a copy to myself</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="scheduleSend"
                        checked={formData.scheduleSend}
                        onChange={(e) =>
                          handleInputChange("scheduleSend", e.target.checked)
                        }
                        className="rounded"
                      />
                      <Label htmlFor="scheduleSend">Schedule send</Label>
                    </div>

                    {formData.scheduleSend && (
                      <div className="grid grid-cols-2 gap-4 ml-6">
                        <div className="space-y-2">
                          <Label htmlFor="scheduleDate">Date</Label>
                          <Input
                            id="scheduleDate"
                            type="date"
                            value={formData.scheduleDate}
                            onChange={(e) =>
                              handleInputChange("scheduleDate", e.target.value)
                            }
                            className={
                              errors.scheduleDate ? "border-red-500" : ""
                            }
                          />
                          {errors.scheduleDate && (
                            <p className="text-sm text-red-500">
                              {errors.scheduleDate}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scheduleTime">Time</Label>
                          <Input
                            id="scheduleTime"
                            type="time"
                            value={formData.scheduleTime}
                            onChange={(e) =>
                              handleInputChange("scheduleTime", e.target.value)
                            }
                            className={
                              errors.scheduleTime ? "border-red-500" : ""
                            }
                          />
                          {errors.scheduleTime && (
                            <p className="text-sm text-red-500">
                              {errors.scheduleTime}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info Sidebar - 1/3 width */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Original Message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{contact.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.email}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {contact.date} at {contact.time}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{contact.category}</Badge>
                        <Badge
                          variant={
                            contact.priority === "High"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {contact.priority}
                        </Badge>
                      </div>

                      <h4 className="font-medium mb-2">{contact.subject}</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {contact.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2"
                    >
                      <Paperclip className="h-4 w-4" />
                      Attach File
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Schedule Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Create Meeting
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-2">
                <Badge variant="outline">To: {contact.email}</Badge>
                {formData.priority !== "Normal" && (
                  <Badge
                    variant={
                      formData.priority === "High" ||
                      formData.priority === "Urgent"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {formData.priority} Priority
                  </Badge>
                )}
                {formData.scheduleSend && (
                  <Badge variant="outline">
                    Scheduled: {formData.scheduleDate} {formData.scheduleTime}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" />
                  {formData.scheduleSend ? "Schedule Send" : "Send Reply"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
