'use client'
import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

interface TabItem {
  id: string
  label: string
  content: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

interface RadixTabsProps {
  defaultValue?: string
  tabs?: TabItem[]
  variant?: 'default' | 'pills' | 'underline' | 'cards'
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  className?: string
  showContent?: boolean
  [key: string]: any
}

export function RadixTabs({
  defaultValue,
  tabs = [
    {
      id: "overview",
      label: "Overview",
      content: "Get a comprehensive view of your dashboard with key metrics and insights.",
      icon: "📊"
    },
    {
      id: "analytics",
      label: "Analytics",
      content: "Dive deep into your data with advanced analytics and reporting tools.",
      icon: "📈",
      badge: "New"
    },
    {
      id: "settings",
      label: "Settings",
      content: "Configure your preferences and manage your account settings.",
      icon: "⚙️"
    }
  ],
  variant = "default",
  size = "md",
  orientation = "horizontal",
  className,
  showContent = true,
  ...props
}: RadixTabsProps) {
  const defaultTab = defaultValue || tabs[0]?.id || "overview"

  // Generate classes based on variant and size
  const getTabsListClasses = () => {
    const baseClasses = "inline-flex items-center justify-center"
    const sizeClasses = {
      sm: "h-8 text-xs",
      md: "h-10 text-sm",
      lg: "h-12 text-base"
    }

    const variantClasses = {
      default: "rounded-lg bg-muted p-1 text-muted-foreground",
      pills: "bg-transparent space-x-2",
      underline: "bg-transparent border-b border-border h-auto p-0",
      cards: "bg-transparent space-x-1 p-0"
    }

    const orientationClasses = orientation === "vertical" ? "flex-col space-y-1" : ""

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${orientationClasses}`
  }

  const getTabTriggerClasses = (tab: TabItem) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variantClasses = {
      default: "rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      pills: "rounded-full px-4 py-2 text-sm font-medium bg-muted/50 hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
      underline: "border-b-2 border-transparent px-4 py-2 text-sm font-medium hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground",
      cards: "rounded-lg border bg-card p-4 hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[120px]"
    }

    return `${baseClasses} ${variantClasses[variant]} ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  }

  const getTabContentClasses = () => {
    const baseClasses = "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

    if (variant === "cards") {
      return `${baseClasses} rounded-lg border bg-card p-6`
    }

    return `${baseClasses} p-4`
  }

  const renderTabContent = (tab: TabItem) => {
    if (variant === "cards") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {tab.badge}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{tab.content}</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
          {tab.badge && (
            <Badge variant="secondary">
              {tab.badge}
            </Badge>
          )}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{tab.content}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <Tabs
        defaultValue={defaultTab}
        orientation={orientation}
        className="w-full"
        {...props}
      >
        <TabsList className={getTabsListClasses()}>
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={getTabTriggerClasses(tab)}
              disabled={tab.disabled}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <span className="text-base">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge && variant !== "cards" && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {showContent && tabs.map(tab => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className={getTabContentClasses()}
          >
            {renderTabContent(tab)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}