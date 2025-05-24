'use client';

import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface PhotoUploaderProps {
  photoUrl: string;
  onPhotoChange: (url: string) => void;
}

export function PhotoUploader({ photoUrl, onPhotoChange }: PhotoUploaderProps) {
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(photoUrl);

  useEffect(() => {
    setCurrentPhotoUrl(photoUrl);
  }, [photoUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onPhotoChange(base64String);
        setCurrentPhotoUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="photo-upload">Profile Photo</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24 rounded-lg">
          <AvatarImage src={currentPhotoUrl || undefined} alt="User photo" data-ai-hint="profile picture" />
          <AvatarFallback className="rounded-lg">
            <User className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} className="max-w-xs" />
      </div>
      {currentPhotoUrl && (
        <Button variant="outline" size="sm" onClick={() => { onPhotoChange(''); setCurrentPhotoUrl(''); }}>
          Remove Photo
        </Button>
      )}
    </div>
  );
}
