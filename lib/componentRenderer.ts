// ComponentData type defined inline
interface ComponentData {
  type: string;
  props: Record<string, any>;
  children?: ComponentData[];
}

export function renderComponent(component: ComponentData) {
  const { type, props, children } = component

  // Component mapping
  const componentMap = {
    'ui-button': 'Button',
    'ui-card': 'Card',
    'ui-badge': 'Badge',
    'ui-avatar': 'Avatar',
    'ui-progress': 'Progress',
    'ui-table': 'Table',
    'ui-accordion': 'Accordion',
    'ui-dialog': 'Dialog',
    'ui-radio-group': 'RadioGroup',
    'ui-toast': 'Toast',
    'form-builder': 'FormBuilder'
  }

  return {
    componentName: (componentMap as any)[type] || 'div',
    props,
    children
  }
}