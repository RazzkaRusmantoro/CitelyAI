const Navbar = async () => {
  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white border border-gray-200">
        
        {/* Citely Logo */}
        <div className="text-3xl font-semibold text-black ml-10">Citely</div>

        {/* Buttons on the right */}
        <div className="flex gap-4">
            {/* Log in Button */}
            <button className="text-black font-bold px-5">Log in</button>

            {/* Get Started Button */}
            <button className="group relative px-7 py-3 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-black font-bold tracking-wider text-sm hover:from-yellow-500 hover:via-amber-600 hover:to-yellow-700 transform hover:rotate-1 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] active:scale-90 overflow-hidden before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-amber-400/50 before:transition-all before:duration-300 hover:before:border-amber-300 hover:before:scale-105">
            <span className="flex items-center gap-2 relative z-10 text-white">
                Get Started
                <svg
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2"
                >
                <path
                    d="M5 12h14m-7-7l7 7-7 7"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                ></path>
                </svg>
            </span>
            <div
                className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300 bg-gradient-to-tl from-amber-200/40 via-transparent to-transparent"
            ></div>
            <div
                className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[200%] transition-transform duration-700 ease-out"
            ></div>
            </button>
        </div>

    </nav>
  );
};

export default Navbar;
