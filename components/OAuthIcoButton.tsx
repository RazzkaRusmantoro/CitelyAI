"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type OAuthIcoButtonProps = {
  provider: string;
  icon: React.ReactNode;
  tooltip: string;
};

export default function OAuthIcoButton({ icon, tooltip, provider }: OAuthIcoButtonProps) {
  const button = (
    <button
      className="flex items-center justify-center border border-gray-300 cursor-pointer text-black bg-white p-3 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
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
