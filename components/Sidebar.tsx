"use client";
import React, { useState, useEffect, useRef } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconMenu2,
  IconSparkles,
  IconFilePencil,
  IconBook2,
  IconFileText,
  IconListCheck,
  IconSunglassesFilled,
  IconX,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { User } from "@/app/auth/getUser";
import { usePathname } from "next/navigation";
import { MessageSquareQuote } from "lucide-react";
import { createClient } from '@/utils/supabase/client';

interface Props {
  user: User;
}

interface SubscriptionData {
  credits: number;
  total_credits: number;
}

export function AppSidebar({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isHoveringPopup, setIsHoveringPopup] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch subscription data when popup is shown
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (showProfilePopup && user?.id) {
        setLoading(true);
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('Subscriptions')
            .select('credits, total_credits')
            .eq('user_id', user.id)
            .single();

          if (!error && data) {
            setSubscriptionData(data);
          } else {
            console.error('Error fetching subscription data:', error);
            // Set default values if no subscription found
            setSubscriptionData({ credits: 0, total_credits: 0 });
          }
        } catch (error) {
          console.error('Error fetching subscription data:', error);
          setSubscriptionData({ credits: 0, total_credits: 0 });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubscriptionData();
  }, [showProfilePopup, user?.id]);

  // Close popup when sidebar collapses
  useEffect(() => {
    if (!open && showProfilePopup) {
      setShowProfilePopup(false);
      setIsHoveringPopup(false);
    }
  }, [open, showProfilePopup]);

  const fullName =
    user?.user_metadata?.full_name ||
    `${user?.user_metadata?.f_name ?? ""} ${
      user?.user_metadata?.l_name ?? ""
    }`.trim() ||
    "Guest";

  const categories = [
    {
      name: "MAIN",
      links: [
        {
          label: "Dashboard",
          href: "/dashboard/home",
          icon: IconBrandTabler,
        },
      ],
    },
    {
      name: "CITATION TOOLS",
      links: [
        {
          label: "AI Citation Basic",
          href: "/dashboard/ai-citation",
          icon: IconFilePencil,
        },
        {
          label: "AI Citation Pro",
          href: "/dashboard/ai-citation-pro",
          icon: IconFilePencil,
        },
        {
          label: "Academic Citer",
          href: "/dashboard/custom-link-citation",
          icon: MessageSquareQuote,
        },
        {
          label: "Bibliography Manager",
          href: "/dashboard/bibliography-manager",
          icon: IconListCheck,
        },
      ],
    },
    {
      name: "RESEARCH TOOLS",
      links: [
        {
          label: "Academic Source Finder",
          href: "/dashboard/academic-source-finder",
          icon: IconBook2,
        },
        {
          label: "Paper Summarizer",
          href: "/dashboard/paper-summarizer",
          icon: IconFileText,
        },
        {
          label: "Source Credibility",
          href: "/dashboard/source-credibility-checker",
          icon: IconSunglassesFilled,
        },
      ],
    },
    {
      name: "ACCOUNT",
      links: [
        {
          label: "Settings",
          href: "/profile",
          icon: IconUserBolt,
        },
        {
          label: "Logout",
          href: "/logout",
          icon: IconArrowLeft,
        },
      ],
    },
  ];

  const handleProfileClick = () => {
    setShowProfilePopup(!showProfilePopup);
    // Force sidebar to stay open when popup is shown
    if (!showProfilePopup) {
      setOpen(true);
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOverProfile = profileRef.current?.contains(event.target as Node);
      const isOverPopup = popupRef.current?.contains(event.target as Node);
      
      if (!isOverProfile && !isOverPopup) {
        setShowProfilePopup(false);
        setIsHoveringPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSidebarMouseLeave = () => {
    // Only collapse sidebar if not hovering over popup
    if (!isHoveringPopup && !isMobile) {
      setOpen(false);
    }
  };

  const handlePopupMouseEnter = () => {
    setIsHoveringPopup(true);
    // Keep sidebar open when hovering over popup
    setOpen(true);
  };

  const handlePopupMouseLeave = () => {
    setIsHoveringPopup(false);
    // Close sidebar when leaving popup (unless on mobile)
    if (!isMobile) {
      setOpen(false);
    }
  };

  // Calculate popup position based on sidebar state
  const getPopupPosition = () => {
    if (!sidebarRef.current) return { left: 0 };
    
    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    return {
      left: open ? sidebarRect.width : 64, // 64px is the width of the collapsed sidebar
    };
  };

  // Calculate progress percentage for the circle
  const calculateProgress = () => {
    if (!subscriptionData || subscriptionData.total_credits === 0) return 0;
    return (subscriptionData.credits / subscriptionData.total_credits) * 100;
  };

  // Get stroke dashoffset for the circle progress
  const getStrokeDashoffset = () => {
    const progress = calculateProgress();
    const circumference = 2 * Math.PI * 15; // 15 is the radius
    return circumference - (progress / 100) * circumference;
  };

  return (
    <>
      {isMobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-50 p-2 m-2 rounded-md md:hidden bg-white dark:bg-gray-800 shadow-md"
        >
          <IconMenu2
            size={24}
            className="text-neutral-800 dark:text-neutral-200"
          />
        </button>
      )}

      <div
        ref={sidebarRef}
        className={cn(
          "fixed left-0 top-0 h-full z-50 bg-white dark:bg-gray-900",
          "transition-all duration-300 ease-in-out overflow-x-hidden",
          isMobile
            ? open
              ? "w-full shadow-xl"
              : "-translate-x-full"
            : "shadow-xl"
        )}
        onMouseEnter={!isMobile ? () => setOpen(true) : undefined}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between scrollbar-none overflow-x-hidden h-full">
            <div className="flex flex-1 flex-col scrollbar-none overflow-y-auto overflow-x-hidden px-2">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-0 flex flex-col">
                {categories.map((category, catIdx) => (
                  <div key={catIdx} className="flex flex-col">
                    {/* Divider */}
                    <div className="border-b border-neutral-200 dark:border-neutral-700 mx-2 h-[1px] my-2" />

                    {/* Category name */}
                    <div className="h-6 px-4 flex items-center overflow-hidden">
                      <motion.span
                        className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400 tracking-wider whitespace-nowrap"
                        animate={{
                          opacity: open ? 1 : 0,
                        }}
                        transition={{ duration: 0.15, delay: open ? 0.25 : 0 }}
                      >
                        {category.name}
                      </motion.span>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      {category.links.map((link, idx) => (
                        <div key={idx} className="h-10 flex items-center">
                          <SidebarLink
                            link={{
                              ...link,
                              icon: (
                                <link.icon
                                  className={cn(
                                    "h-5 w-5 shrink-0",
                                    pathname === link.href
                                      ? "text-orange-500"
                                      : "text-neutral-700 dark:text-neutral-200"
                                  )}
                                />
                              ),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Upgrade Button - Added above the user profile */}
            <div className="px-2 py-2">
              <motion.div
                animate={{
                  opacity: open ? 1 : 0,
                  // height: open ? "auto" : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <button
                  onClick={() => window.location.href = "/pricing"}
                  className={cn(
                    "w-full py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
                    "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
                    "text-white shadow-sm hover:shadow-md hover:cursor-pointer",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  <IconSparkles className="h-4 w-4" />
                  Upgrade
                </button>
              </motion.div>
            </div>
            
            {/* User Profile Section */}
            <div ref={profileRef} className="relative">
              <div 
                className="p-2 h-12 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                onClick={handleProfileClick}
              >
                <div className="flex items-center justify-start gap-2 group/sidebar py-2">
                  <div className="h-6 w-6 rounded-full bg-neutral-300 dark:bg-neutral-600 flex items-center justify-center">
                    <IconUserBolt className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                  </div>
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: open ? 1 : 0,
                      width: open ? "auto" : 0,
                      marginLeft: open ? 8 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "inline-block text-neutral-700 dark:text-neutral-200 text-sm",
                      "overflow-hidden text-ellipsis whitespace-nowrap",
                      !open && "w-0",
                    )}
                    title={fullName} // Show full name on hover
                  >
                    {open ? (
                      fullName.length > 18 ? `${fullName.substring(0, 18)}...` : fullName
                    ) : (
                      ""
                    )}
                  </motion.span>
                </div>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Profile Popup - Positioned outside the sidebar */}
        <AnimatePresence>
          {showProfilePopup && (
            <motion.div
              ref={popupRef}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-4 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-[60]"
              style={getPopupPosition()}
              onMouseEnter={handlePopupMouseEnter}
              onMouseLeave={handlePopupMouseLeave}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Credits Section */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Credits</h3>
                  {loading ? (
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {subscriptionData?.credits || 0} / {subscriptionData?.total_credits || 0}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Circular progress bar */}
                  <div className="relative w-8 h-8">
                    {loading ? (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    ) : (
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          className="stroke-gray-200 dark:stroke-gray-700"
                          strokeWidth="2"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          className="stroke-amber-500"
                          strokeWidth="2"
                          strokeDasharray={2 * Math.PI * 15}
                          strokeDashoffset={getStrokeDashoffset()}
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Remaining</span>
                      {loading ? (
                        <div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-gray-900 dark:text-white font-medium">
                          {subscriptionData?.credits || 0}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500 dark:text-gray-400">Total</span>
                      {loading ? (
                        <div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-gray-900 dark:text-white font-medium">
                          {subscriptionData?.total_credits || 0}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => {
                    window.location.href = "/logout";
                    setShowProfilePopup(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

const Logo = () => (
  <a
    href="/"
    className="z-20 flex items-center space-x-2 py-3 text-sm font-normal text-black dark:text-white h-12"
  >
    <IconSparkles className="h-5 w-5 text-yellow-500" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre"
    >
      Citely
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a
    href="/"
    className="z-20 flex items-center space-x-2 py-3 text-sm font-normal text-black dark:text-white h-12"
  >
    <IconSparkles className="h-5 w-5 text-yellow-500" />
  </a>
);