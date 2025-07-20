"use client";
import { createClient } from "@/utils/supabase/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type OAuthIcoButtonProps = {
  provider: "google" | "github" | "twitter";
  icon: React.ReactNode;
  tooltip: string;
};

export default function OAuthIcoButton({ icon, tooltip, provider }: OAuthIcoButtonProps) {
  const supabase = createClient();

  const handleLogin = async () => {
    const { data, error} = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      }
    });
    if (error) {
      console.error("OAuth fail", error.message)
    }
    
  }
  
  const button = (
    <button
      className="flex items-center justify-center border border-gray-300 cursor-pointer text-black bg-white p-3 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
      onClick={handleLogin}
    >
      {icon}
    </button>
  );
  

  

  
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
