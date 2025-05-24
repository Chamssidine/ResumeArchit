'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';

interface ResumeFormSectionProps<TItem extends { id: string }> {
  title: string;
  items: TItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  renderItem: (item: TItem, index: number, onChange: (updatedItem: TItem) => void) => ReactNode;
  itemNoun?: string;
}

export function ResumeFormSection<TItem extends { id: string }>({
  title,
  items,
  onAddItem,
  onRemoveItem,
  renderItem,
  itemNoun = 'Item'
}: ResumeFormSectionProps<TItem>) {
  
  const handleItemChange = (index: number, updatedItem: TItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    // This component doesn't directly call setItems, the parent does via renderItem's onChange.
    // This function is passed to renderItem to allow individual fields to update the specific item.
    // The parent's setItems(newItems) will be called from the specific input's onChange.
    // This function is primarily for complex item updates, simpler ones are handled in parent.
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-md border p-4 space-y-4 relative bg-background/50">
            {renderItem(item, index, (updatedItem) => handleItemChange(index, updatedItem))}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveItem(item.id)}
              className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
              aria-label={`Remove ${itemNoun}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={onAddItem} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add {itemNoun}
        </Button>
      </CardContent>
    </Card>
  );
}
