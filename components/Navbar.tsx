'use client'
import * as React from "react"
import { Button } from "../components/ui/button"

interface NavItem {
  label: string
  href: string
  onClick?: string
  children?: NavItem[]
}

interface NavbarProps {
  brand?: string
  items?: NavItem[] | string
  className?: string
}

export function Navbar({ brand = "My Brand", items = [], className }: NavbarProps) {
  // Parse items if it's a string (JSON)
  const navItems = typeof items === 'string' ? JSON.parse(items) : items

  return (
    <nav className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">{brand}</span>
          </div>
          <div className="flex items-center space-x-4">
            {navItems.map((item: NavItem, index: number) => (
              <Button key={index} variant="ghost" {...({ asChild: true } as any)}>
                <a href={item.href}>{item.label}</a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}