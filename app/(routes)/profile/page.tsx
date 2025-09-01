"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, HelpCircle, LogOut, Pencil, ArrowLeft, LayoutDashboard, Mail, CreditCard, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackgroundBeams } from "@/components/ui/background-beams";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function ProfileLayout() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
  });
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);
  const [subscription, setSubscription] = useState('Free');
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const response = await fetch('/api/check-subscription');
      const data = await response.json();
      
      if (response.ok) {
        setSubscription(data.subscription);
      } else {
        console.error('Failed to fetch subscription:', data.error);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || "");
        setOriginalEmail(user.email || "");
        
        // Fetch additional user data from profiles table
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
          
        if (!error && profileData) {
          setProfile({
            full_name: profileData.full_name || "",
          });
        } else {
          // If no profile exists, use auth user data
          setProfile({
            full_name: user.user_metadata.full_name || "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, full_name: e.target.value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If email is being edited, handle email change separately
    if (isEditingEmail && email !== originalEmail) {
      await handleEmailUpdate();
    }
    
    // If name is being edited, handle name change
    if (isEditing) {
      await handleNameUpdate();
    }
  };

  const handleNameUpdate = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/full-name-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: profile.full_name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      await fetchUserData();
      
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update profile' 
      });
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const handleEmailUpdate = async () => {
    setSavingEmail(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update email');
      }

      setMessage({ 
        type: 'success', 
        text: 'Email update initiated. Please check your current and new email for confirmation.' 
      });
      
      // Reset email editing state but keep the new email value displayed
      setIsEditingEmail(false);
      setOriginalEmail(email);
      
    } catch (error) {
      console.error("Error updating email:", error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update email' 
      });
      // Revert email to original value on error
      setEmail(originalEmail);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getSubscriptionPrice = () => {
    switch (subscription) {
      case 'Basic': return '$9';
      case 'Pro': return '$24';
      default: return '$0';
    }
  };

  const getSubscriptionFeatures = () => {
    const baseFeatures = [
      { name: 'Basic citation styles', included: true },
      { name: 'Standard support', included: true },
    ];

    switch (subscription) {
      case 'Free':
        return [
        ];
      case 'Basic':
        return [
        ];
      case 'Pro':
        return [
        ];
      default:
        return baseFeatures;
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex justify-center items-center">
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <FadeInOnScroll>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Account Settings
              </h1>
              <p className="text-xl text-gray-600">
                Manage your Citera profile and preferences
              </p>
            </div>
            <Link href="/dashboard/home">
              <Button variant="outline" className="flex items-center gap-2 hover:cursor-pointer">
                <LayoutDashboard className="w-4 h-4" />
                Go Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : message.type === 'error'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <User className="w-6 h-6 mr-3 text-amber-600" />
                  Profile Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={handleNameChange}
                        placeholder="Your Name"
                        disabled={!isEditing}
                        required
                        minLength={2}
                        maxLength={100}
                      />
                      {!isEditing ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className = "hover:cursor-pointer"
                          onClick={() => setIsEditing(true)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className = "hover:cursor-pointer"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            fetchUserData(); // Reset to original values
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="your.email@example.com"
                        disabled={!isEditingEmail}
                        className="flex-1"
                      />
                      {!isEditingEmail ? (
                        <Button
                          type="button"
                          variant="outline"
                          className = "hover:cursor-pointer"
                          size="icon"
                          onClick={() => setIsEditingEmail(true)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className = "hover:cursor-pointer"
                          onClick={() => {
                            setIsEditingEmail(false);
                            setEmail(originalEmail); // Reset to original email
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subscription Section */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-amber-600" />
                  Subscription
                </h2>
                
                {subscriptionLoading ? (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
                    <p>Loading subscription information...</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
                          <p className="text-gray-600 mt-1">{subscription} Tier</p>
                          <div className="mt-3 flex items-center">
                            <div className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                              subscription === 'Pro' 
                                ? 'bg-purple-100 text-purple-800' 
                                : subscription === 'Basic'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {subscription === 'Pro' ? 'Premium Access' : 
                               subscription === 'Basic' ? 'Enhanced Access' : 'Free Access'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {getSubscriptionPrice()}
                            <span className="text-sm font-normal text-gray-600">/month</span>
                          </p>
                        </div>
                      </div>

                      {/* Cancel Button for non-Free tiers */}
                      {subscription !== 'Free' && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:cursor-pointer"
                            onClick={() => {
                              // Placeholder for cancel functionality
                              setMessage({ 
                                type: 'info', 
                                text: 'Cancellation feature coming soon. Please contact support to manage your subscription.' 
                              });
                            }}
                          >
                            Cancel Subscription
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {subscription !== 'Pro' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-amber-900 mb-2">
                          {subscription === 'Free' ? 'Upgrade for more power' : 'Upgrade to Pro'}
                        </h3>
                        <p className="text-amber-800 mb-4">
                          {subscription === 'Free' 
                            ? 'Unlock more citations, advanced features, and better support with our paid plans.'
                            : 'Get unlimited citations and priority support with our Pro plan.'}
                        </p>
                        <Link href="/pricing">
                          <Button className="bg-amber-600 hover:bg-amber-700 text-white hover:cursor-pointer">
                            View Pricing Plans
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Support Section */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <HelpCircle className="w-6 h-6 mr-3 text-amber-600" />
                  Support
                </h2>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Need help with your account? Contact our support team for assistance.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-gray-200 text-amber-600 hover:text-amber-600 hover:cursor-pointer"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3 " />
                  Log Out
                </Button>
                
                <div className="flex gap-4">
                  {(isEditing || isEditingEmail) && (
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                      disabled={saving || savingEmail || 
                        (isEditing && !profile.full_name.trim()) ||
                        (isEditingEmail && email === originalEmail)}
                    >
                      {(saving || savingEmail) ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
}