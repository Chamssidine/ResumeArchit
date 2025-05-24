'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PersonalizationConfig } from '@/types/resume';
import { availableFonts } from '@/fonts';

interface PersonalizationOptionsProps {
  config: PersonalizationConfig;
  onConfigChange: Dispatch<SetStateAction<PersonalizationConfig>>;
}

export function PersonalizationOptions({ config, onConfigChange }: PersonalizationOptionsProps) {
  const handleColorChange = (field: keyof PersonalizationConfig, value: string) => {
    onConfigChange(prev => ({ ...prev, [field]: value }));
  };

  const handleFontChange = (value: string) => {
    onConfigChange(prev => ({ ...prev, fontFamily: value }));
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="primary-color"
              type="color"
              value={config.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={config.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="accent-color">Accent Color</Label>
           <div className="flex items-center gap-2">
            <Input
              id="accent-color"
              type="color"
              value={config.accentColor}
              onChange={(e) => handleColorChange('accentColor', e.target.value)}
              className="w-12 h-10 p-1"
            />
             <Input
              type="text"
              value={config.accentColor}
              onChange={(e) => handleColorChange('accentColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="font-family">Font Family</Label>
          <Select value={config.fontFamily} onValueChange={handleFontChange}>
            <SelectTrigger id="font-family">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {availableFonts.map(font => (
                <SelectItem key={font.id} value={font.id}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
