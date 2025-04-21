import Link from "next/link"
import { Brain } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <img src="/white-logo.png" alt="" className="hidden dark:block w-50" />
      <img src="/black-logo.png" alt="" className="dark:hidden w-50" />
    </Link>
  )
}

