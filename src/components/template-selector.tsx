'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onTemplateChange: Dispatch<SetStateAction<string>>;
}

// For now, only one template is effectively supported by ResumePreview.
// This component is a placeholder for future expansion.
const availableTemplates = [
  { id: 'classic', name: 'Classic Professional' },
  // { id: 'modern', name: 'Modern Minimalist' }, // Example for future
];

export function TemplateSelector({ selectedTemplateId, onTemplateChange }: TemplateSelectorProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="template-select">Choose a Template</Label>
          <Select value={selectedTemplateId} onValueChange={onTemplateChange}>
            <SelectTrigger id="template-select">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {availableTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            More templates coming soon! Currently, all options render the 'Classic Professional' style.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
