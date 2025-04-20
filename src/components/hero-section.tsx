import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "./ui/badge"

export function HeroSection() {
  return (
    <section className=" w-full  py-12 md:py-24 lg:py-32 xl:py-48 relative">

      <div className="container mx-auto px-4 md:px-6 relative space-y-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className = "relative mb-10 ">
              <Badge className="absolute top-1 left-1 z-20 font-bold p-2 mb-3">
                  Your Mental Health Matters
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                Your Journey to Better Mental Health Starts Here
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                MindWell provides tools and resources to help you monitor, understand, and improve your mental
                well-being in a safe, supportive environment.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="px-8 border-primary text-primary hover:bg-primary/10">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-gray-200 dark:bg-gray-700"
                  ></div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Join <span className="font-medium text-foreground">2,000+</span> users already improving their mental
                health
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px] lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-3xl animate-pulse"></div>
              <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-xl">
                <div className="text-center p-8">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Take the first step</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Join thousands who have improved their mental well-being with our supportive community and tools.
                  </p>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                      Sign Up Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

