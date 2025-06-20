
// Event system types
type EventHandler = (data?: any) => void
type EventRegistry = Record<string, EventHandler>


// Global event registry
let globalEventRegistry: EventRegistry = {}

// Default event handlers
const defaultEventHandlers: EventRegistry = {
  // Button events
  onButtonClick: (data) => {
    console.log('🔘 Button clicked:', data)
    alert(`Button "${data?.text || 'Button'}" was clicked!`)
  },
  onSubmitClick: (data) => {
    console.log('✅ Submit clicked:', data)
    alert('Form submitted! You can add form validation here.')
  },
  onCancelClick: (data) => {
    console.log('❌ Cancel clicked:', data)
    alert('Action cancelled!')
  },

  // Form events
  onInputChange: (data) => {
    console.log('📝 Input changed:', data)
  },
  onFormSubmit: (data) => {
    console.log('📋 Form submitted:', data)
    alert('Form submitted with data: ' + JSON.stringify(data))
  },
  onSwitchToggle: (data) => {
    console.log('🔄 Switch toggled:', data)
  },
  onCheckboxToggle: (data) => {
    console.log('☑️ Checkbox toggled:', data)
  },

  // Card events
  onCardClick: (data) => {
    console.log('🃏 Card clicked:', data)
    alert(`Card "${data?.title || 'Card'}" was clicked!`)
  },

  // Navigation events
  onHomeClick: (data) => {
    console.log('🏠 Home navigation:', data)
    window.location.href = '/'
  },
  onAboutClick: (data) => {
    console.log('ℹ️ About navigation:', data)
    window.location.href = '/about'
  },
  onServicesClick: (data) => {
    console.log('🛠️ Services navigation:', data)
    window.location.href = '/services'
  },
  onContactClick: (data) => {
    console.log('📞 Contact navigation:', data)
    window.location.href = '/contact'
  },

  // Visibility control events
  showComponent: (data) => {
    console.log('👁️ Show component:', data)
    const targetId = data?.targetId || data?.componentId
    if (targetId) {
      const element = document.querySelector(`[data-component-id="${targetId}"]`) as HTMLElement
      if (element) {
        element.style.display = ''
        element.style.opacity = '0'
        element.style.transform = 'scale(0.8)'
        element.style.transition = 'all 0.3s ease'

        // Animate in
        setTimeout(() => {
          element.style.opacity = '1'
          element.style.transform = 'scale(1)'
        }, 10)

        console.log(`✅ Component ${targetId} is now visible`)
      } else {
        console.warn(`⚠️ Component ${targetId} not found`)
      }
    }
  },

  hideComponent: (data) => {
    console.log('🙈 Hide component:', data)
    const targetId = data?.targetId || data?.componentId
    if (targetId) {
      const element = document.querySelector(`[data-component-id="${targetId}"]`) as HTMLElement
      if (element) {
        element.style.transition = 'all 0.3s ease'
        element.style.opacity = '0'
        element.style.transform = 'scale(0.8)'

        // Hide after animation
        setTimeout(() => {
          element.style.display = 'none'
        }, 300)

        console.log(`✅ Component ${targetId} is now hidden`)
      } else {
        console.warn(`⚠️ Component ${targetId} not found`)
      }
    }
  },

  toggleComponent: (data) => {
    console.log('🔄 Toggle component:', data)
    const targetId = data?.targetId || data?.componentId
    if (targetId) {
      const element = document.querySelector(`[data-component-id="${targetId}"]`) as HTMLElement
      if (element) {
        const isHidden = element.style.display === 'none' ||
                        window.getComputedStyle(element).display === 'none'

        if (isHidden) {
          // Show component
          eventSystem.trigger('showComponent', data)
        } else {
          // Hide component
          eventSystem.trigger('hideComponent', data)
        }
      } else {
        console.warn(`⚠️ Component ${targetId} not found`)
      }
    }
  },

  // Custom events
  onCustomAction: (data) => {
    console.log('⚡ Custom action triggered:', data)
    alert('Custom action triggered! You can define any behavior here.')
  },
}

// Initialize with default handlers
globalEventRegistry = { ...defaultEventHandlers }

export const eventSystem = {
  // Register a new event handler
  register: (eventName: string, handler: EventHandler) => {
    globalEventRegistry[eventName] = handler
    console.log(`📝 Registered event handler: ${eventName}`)
  },

  // Unregister an event handler
  unregister: (eventName: string) => {
    delete globalEventRegistry[eventName]
    console.log(`🗑️ Unregistered event handler: ${eventName}`)
  },

  // Trigger an event
  trigger: (eventName: string, data?: any) => {
    const handler = globalEventRegistry[eventName]
    if (handler) {
      console.log(`🚀 Triggering event: ${eventName}`, data)
      handler(data)
    } else {
      // Handle unknown custom events with a default behavior
      console.log(`🚀 Triggering custom event: ${eventName}`, data)
      console.warn(`⚠️ No specific handler found for event: ${eventName}`)

      // Default custom event behavior - show a notification with the event data
      const message = data?.message || `Custom event "${eventName}" triggered!`
      const eventInfo = {
        eventName,
        data,
        timestamp: new Date().toISOString()
      }

      // Show a styled notification instead of a basic alert
      eventSystem.showEventNotification(eventName, data)

      // Log detailed event info for debugging
      console.log(`📊 Custom Event Details:`, eventInfo)
    }
  },

  // Get all registered events
  getRegisteredEvents: () => {
    return Object.keys(globalEventRegistry)
  },

  // Check if an event is registered
  isRegistered: (eventName: string) => {
    return eventName in globalEventRegistry
  },

  // Register multiple handlers at once
  registerMultiple: (handlers: EventRegistry) => {
    Object.entries(handlers).forEach(([eventName, handler]) => {
      globalEventRegistry[eventName] = handler
    })
    console.log(`📝 Registered ${Object.keys(handlers).length} event handlers`)
  },

  // Reset to default handlers
  resetToDefaults: () => {
    globalEventRegistry = { ...defaultEventHandlers }
    console.log('🔄 Reset to default event handlers')
  },

  // Get current registry (for debugging)
  getRegistry: () => {
    return { ...globalEventRegistry }
  },

  // Show a styled notification for custom events
  showEventNotification: (eventName: string, data?: any) => {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm'
    notification.style.animation = 'slideInRight 0.3s ease-out'

    const message = data?.message || `Event "${eventName}" triggered!`
    const timestamp = data?.timestamp || new Date().toLocaleTimeString()

    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div class="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            ⚡
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium">Custom Event</div>
          <div class="text-xs opacity-90 mt-1">${message}</div>
          <div class="text-xs opacity-75 mt-1">Event: ${eventName}</div>
          <div class="text-xs opacity-75">Time: ${timestamp}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200 text-lg leading-none">×</button>
      </div>
    `

    // Add CSS animation if not already added
    if (!document.querySelector('#event-notification-styles')) {
      const style = document.createElement('style')
      style.id = 'event-notification-styles'
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(notification)

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s ease-in'
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove()
          }
        }, 300)
      }
    }, 5000)
  },

  // Quick register method for custom events
  quickRegister: (eventName: string, message?: string, action?: () => void) => {
    eventSystem.register(eventName, (data) => {
      console.log(`🎯 Custom event "${eventName}" triggered:`, data)

      if (action) {
        action()
      } else {
        const displayMessage = message || data?.message || `Custom event "${eventName}" executed!`
        eventSystem.showEventNotification(eventName, { message: displayMessage, ...data })
      }
    })
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).eventSystem = eventSystem
}

export type { EventHandler, EventRegistry }
