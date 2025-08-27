"use client";
import Navbar from "@/components/navbar";
import { createClient } from '@/utils/supabase/client'
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "framer-motion";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import {
  HelpCircle,
  FileText,
  Users,
  ArrowRight,
  CheckCircle,
  Send,
  ChevronDown
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { useState, useRef, useEffect } from "react";

export default function Support() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    category: "",
    message: ""
  });

  const [formErrors, setFormErrors] = useState({
    category: "",
    phone: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const supportCategories = [
    "Account Issues",
    "Billing & Payments",
    "Technical Problems",
    "Feature Request",
    "Citation Help",
    "Bug Report",
    "General Inquiry",
    "Partnership Opportunities"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (name === "phone" && formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    let formattedValue = input;
    
    // Format as (XXX) XXX-XXXX
    if (input.length > 3 && input.length <= 6) {
      formattedValue = `(${input.slice(0, 3)}) ${input.slice(3)}`;
    } else if (input.length > 6) {
      formattedValue = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
    } else if (input.length > 0) {
      formattedValue = `(${input}`;
    }
    
    setFormData(prev => ({
      ...prev,
      phone: formattedValue
    }));
    
    // Clear error when user starts typing
    if (formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
    
    // Clear error when category is selected
    if (formErrors.category) {
      setFormErrors(prev => ({ ...prev, category: "" }));
    }
    
    setIsDropdownOpen(false);
  };

  const validateForm = () => {
    const errors = {
      category: "",
      phone: ""
    };
    
    let isValid = true;
    
    // Validate category
    if (!formData.category) {
      errors.category = "Please select a support category";
      isValid = false;
    }
    
    // Validate phone number format if provided
    if (formData.phone && formData.phone.replace(/\D/g, '').length !== 10) {
      errors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Insert the form data into the support table
      const { data, error: supabaseError } = await supabase
        .from('support')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            category: formData.category,
            description: formData.message,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      console.log("Data inserted successfully:", data);
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        category: "",
        message: ""
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportResources = [
    {
      title: "Help Center",
      description: "Browse our comprehensive knowledge base for answers to common questions",
      icon: <HelpCircle className="w-8 h-8 text-amber-500" />,
      link: "/help-center"
    },
    {
      title: "Guides",
      description: "Detailed guides and tutorials for all Citera features",
      icon: <FileText className="w-8 h-8 text-amber-500" />,
      link: "/documentation"
    },
    {
      title: "Community Forum",
      description: "Connect with other users and share tips and solutions",
      icon: <Users className="w-8 h-8 text-amber-500" />,
      link: "/community"
    },
  ];

  return (
    <>
      <div className="relative overflow-hidden min-h-screen flex flex-col">
        <Navbar />
        {/* Background Beams */}
        <div className="absolute inset-0 -z-10">
          <BackgroundBeams />
        </div>

        <div className="flex-1 pt-28 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            {/* Header Section */}
            <FadeInOnScroll>
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  We're Here to Help
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get support for any issues, questions, or feedback about Citera. 
                  Our team is dedicated to helping you succeed with your research.
                </p>
              </div>
            </FadeInOnScroll>

            {/* Support Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <FadeInOnScroll>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h2>
                    
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Message Sent Successfully!</h3>
                        <p className="text-gray-600">We'll get back to you as soon as possible. Typically within 24 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handlePhoneChange}
                              placeholder="(123) 456-7890"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                            />
                            {formErrors.phone && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                            )}
                          </div>
                        </div>

                        {/* Enhanced Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Support Category *
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between transition-colors ${
                              formData.category ? 'text-gray-800' : 'text-gray-500'
                            } ${
                              isDropdownOpen 
                                ? 'border-amber-500 ring-2 ring-amber-500 ring-opacity-50' 
                                : formErrors.category ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {formData.category || "Select a category"}
                            <ChevronDown 
                              className={`w-5 h-5 transition-transform ${
                                isDropdownOpen ? 'rotate-180' : ''
                              }`} 
                            />
                          </button>
                          
                          {formErrors.category && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                          )}

                          {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                              <div className="max-h-60 overflow-y-auto">
                                {supportCategories.map((category, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleCategorySelect(category)}
                                    className={`w-full px-4 py-3 text-left hover:bg-amber-50 transition-colors ${
                                      formData.category === category 
                                        ? 'bg-amber-100 text-amber-700' 
                                        : 'text-gray-700'
                                    }`}
                                  >
                                    {category}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            How can we help? *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                            placeholder="Please describe your issue or question in detail..."
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
                        >
                          {isSubmitting ? (
                            "Submitting..."
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </FadeInOnScroll>
              </div>

              {/* Support Resources */}
              <div>
                <FadeInOnScroll>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Support Resources</h3>
                    
                    {supportResources.map((resource, index) => (
                      <motion.div 
                        key={index}
                        whileHover={{ x: 5 }}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {resource.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">{resource.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                            <a href={resource.link} className="text-amber-600 text-sm font-medium flex items-center hover:text-amber-700 transition-colors">
                              Learn more <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* FAQ Preview */}
                    <div className="bg-gray-50 p-6 rounded-xl mt-8">
                      <h4 className="font-semibold text-gray-800 mb-4">Frequently Asked Questions</h4>
                      <div className="space-y-3">
                        <div>
                          <a href="/FAQ" className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center mt-3 transition-colors">
                            View all FAQs <ArrowRight className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInOnScroll>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}