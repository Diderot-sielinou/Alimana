/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useFormikContext } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from 'formik';

interface ImageUploadFieldProps {
  name: string; // ex: "imageUrl"
  label?: string;
  folder?: string; // ex: "products", "categories", etc.
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  name,
  label = 'Image',
  folder = 'uploads',
}) => {
  const { setFieldValue, values } = useFormikContext<any>();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/image?folder=products`,
        {
          method: 'POST',
          body: formData,
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        }
      );

      if (!res.ok) throw new Error('Internal server error occurred');

      const data = await res.json();
      setFieldValue(name, data.url);
    } catch (error) {
      console.error(error);
      alert('Error occurred uploading image');
    }
  };

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type="file" accept="image/*" onChange={handleChange} />
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />

      {values[name] && typeof values[name] === 'string' && (
        <div className="mt-2">
          <img
            src={values[name]}
            alt="Aperçu"
            className="max-h-32 rounded border border-gray-200"
          />
        </div>
      )}
    </div>
  );
};
