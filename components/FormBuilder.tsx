'use client'
import * as React from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

interface FormField {
  id: string
  label: string
  type: string
  placeholder?: string
  required?: boolean
}

interface FormSchema {
  title?: string
  description?: string
  fields: FormField[]
  submitText?: string
  submitAction?: string
  showNewsletter?: boolean
}

interface FormBuilderProps {
  schema?: FormSchema
  className?: string
}

export function FormBuilder({
  schema = {
    title: "Contact Form",
    description: "Please fill out the form below",
    fields: [
      { id: "name", label: "Name", type: "text", placeholder: "Enter your name", required: true },
      { id: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
      { id: "message", label: "Message", type: "textarea", placeholder: "Enter your message", required: false }
    ],
    submitText: "Submit",
    showNewsletter: true
  },
  className
}: FormBuilderProps) {
  const [formData, setFormData] = React.useState<Record<string, string>>({})
  const [newsletter, setNewsletter] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Form submitted:', { ...formData, newsletter })
    setIsSubmitting(false)

    // Reset form
    setFormData({})
    setNewsletter(false)
  }

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  return (
    <Card className={`w-full max-w-md mx-auto shadow-lg ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {schema.title}
        </CardTitle>
        {schema.description && (
          <CardDescription className="text-center text-muted-foreground">
            {schema.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {schema.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full"
                />
              )}
            </div>
          ))}

          {schema.showNewsletter && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={newsletter}
                onCheckedChange={(checked) => setNewsletter(checked as boolean)}
              />
              <Label
                htmlFor="newsletter"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Subscribe to newsletter
              </Label>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : (schema.submitText || 'Submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}