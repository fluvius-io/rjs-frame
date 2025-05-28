import React from 'react';

interface SlotProps {
  slot?: string;
  children?: React.ReactNode;
}

interface SlotRenderProps {
  name?: string;
  children?: React.ReactNode;
}

type SlotRenderer = (props: SlotRenderProps) => React.ReactElement;
type HasSlotItem = (slot: string) => boolean;

type SlotMap = {
  [key: string]: React.ReactElement[];
};

const useComponentSlots = (componentChildren: React.ReactNode): [SlotRenderer, HasSlotItem] => {
  const slots = React.Children.toArray(componentChildren).reduce<SlotMap>(
    (collector, child) => {
      if (React.isValidElement(child)) {
        const slotName = (child.props as SlotProps).slot || 'general';
        if (!collector.hasOwnProperty(slotName)) {
          collector[slotName] = [];
        }
        collector[slotName].push(child);
      }
      return collector;
    },
    { general: [] }
  );

  const renderSlot: SlotRenderer = ({ name, children: defaultChildren }) => {
    const children = !name
      ? slots.general
      : (slots.hasOwnProperty(name) ? slots[name] : defaultChildren);
    return React.createElement(React.Fragment, null, children);
  };

  const hasSlotItem: HasSlotItem = (slot) => 
    slots.hasOwnProperty(slot) && slots[slot].length > 0;

  return [renderSlot, hasSlotItem];
};

export default useComponentSlots; 