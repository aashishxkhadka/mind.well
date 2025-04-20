

import { FeatureSection } from "@/components/feature-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4">
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
      </main>
    </div>
  )
}

