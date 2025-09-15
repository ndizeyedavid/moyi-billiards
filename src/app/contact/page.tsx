"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Facebook,
  Instagram,
  Twitter,
  CheckCircle,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "general",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 2000);
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hello! I&apos;m interested in your pool tables and would like to get more information. My name is ${
        formData.name || "[Your Name]"
      }.`
    );
    window.open(`https://wa.me/250790194868?text=${message}`, "_blank");
  };

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      details: ["+250 790 194 868", "Available 24/7"],
      action: () => window.open("tel:+250790194868"),
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      details: [
        "thegreatmoyibilliards760@gmail.com",
        "We&apos;ll respond within 24 hours",
      ],
      action: () => window.open("mailto:thegreatmoyibilliards760@gmail.com"),
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Location",
      details: ["Kigali, Rwanda", "Serving 19 districts"],
      action: () => window.open("https://maps.google.com/?q=Kigali,Rwanda"),
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Business Hours",
      details: ["Mon - Sat: 8:00 AM - 8:00 PM", "Sunday: 10:00 AM - 6:00 PM"],
      action: null,
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="h-5 w-5" />,
      name: "Facebook",
      url: "https://facebook.com/moyibilliards",
      color: "hover:text-blue-600",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      name: "Instagram",
      url: "https://www.instagram.com/the_great_moyi_billiards/",
      color: "hover:text-pink-600",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      name: "Twitter",
      url: "https://twitter.com/moyibilliards",
      color: "hover:text-blue-400",
    },
  ];

  return (
    <>
      <Header />

      <div className="min-h-screen bg-background pt-[120px] pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 border-rose-500/20 bg-rose-500/5"
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1 text-rose-500" />
              Contact Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to transform your space with a premium pool table? We&apos;re
              here to help you find the perfect fit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we&apos;ll get back to you as soon as
                    possible.
                  </p>
                </CardHeader>
                <CardContent>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 dark:text-green-200">
                        Message sent successfully! We&apos;ll get back to you soon.
                      </span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          placeholder="+250 XXX XXX XXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Inquiry Type
                        </label>
                        <select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="purchase">Purchase Inquiry</option>
                          <option value="custom">Custom Table Design</option>
                          <option value="maintenance">
                            Maintenance & Repair
                          </option>
                          <option value="accessories">Accessories</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="What&apos;s this about?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                        placeholder="Tell us more about your requirements..."
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleWhatsAppContact}
                        className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp Us
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Contact Details */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index}>
                      <div
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                          info.action ? "hover:bg-muted cursor-pointer" : ""
                        }`}
                        onClick={info.action || undefined}
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-rose-100 dark:bg-rose-900/20 rounded-lg flex items-center justify-center text-rose-600">
                          {info.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">
                            {info.title}
                          </h4>
                          {info.details.map((detail, idx) => (
                            <p
                              key={idx}
                              className={`text-sm ${
                                idx === 0
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                      {index < contactInfo.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Stay updated with our latest products and news
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="icon"
                        className={`transition-colors ${social.color}`}
                        onClick={() => window.open(social.url, "_blank")}
                      >
                        {social.icon}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Our Location</CardTitle>
                <p className="text-muted-foreground">
                  Visit our showroom to see our premium pool tables in person
                </p>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3987.4155584251407!2d30.042845074487666!3d-1.9885578867958926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2srw!4v1738528747518!5m2!1sen!2srw"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}
