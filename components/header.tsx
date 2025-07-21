"use client"
import {FlipWords} from "@/components/ui/flip-words"

export default function Header() {
    const words = ["Write Faster.", "Cite Smarter."]
    return (
        <>
            <div className="flex justify-center items-start w-full bg-gray-100 max-w-6xl mx-auto">
                <section className="grid grid-cols-1 md:grid-cols-2 w-full h-175 max-w-6xl px-6 text-black items-start gap-8 py-30">
                    {/* Left */}
                    <div className="flex flex-col justify-center items-start text-left bg-blue-100">
                        <h2 className="text-4xl md:text-6xl font-semibold">
                            <FlipWords words={words} />
                        </h2>
                        <p className="text-lg md:text-xl max-w-md">
                            Let AI handle the references, so you don't have to.
                        </p>
                    </div>

                    {/* Right */}
                    <div className="flex justify-center items-center bg-yellow-100 min-h-[300px] rounded-xl">
                        {/* You can place an image or animation here */}
                        <span className="text-xl font-medium">Visual or Animation</span>
                    </div>
                </section>
            </div>
            <div className = "border-t border-gray-200">
                <div className="bg-green-100 flex justify-center items-center h-175 text-black border-t border-gray-200 max-w-6xl mx-auto">

                </div>
            </div>


            <div className = "border-t border-gray-200">
                <div className="bg-purple-100 flex justify-center items-center h-175 text-black border-t border-gray-200 max-w-6xl mx-auto">

                </div>
            </div>
        </>
    );
}
