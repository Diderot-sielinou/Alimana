'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ICategory } from '@/types/category.interface';

interface CategoryFormProps {
  initialData?: ICategory;
  onSubmit: (data: Partial<ICategory>) => Promise<void>;
}

const categorySchema = Yup.object({
  name: Yup.string().required('Le nom est requis'),
  description: Yup.string(),
  color: Yup.string(),
});

const colorOptions = [
  { value: '#ef4444', label: 'Rouge', bg: 'bg-red-500' },
  { value: '#f97316', label: 'Orange', bg: 'bg-orange-500' },
  { value: '#eab308', label: 'Jaune', bg: 'bg-yellow-500' },
  { value: '#22c55e', label: 'Vert', bg: 'bg-green-500' },
  { value: '#3b82f6', label: 'Bleu', bg: 'bg-blue-500' },
  { value: '#8b5cf6', label: 'Violet', bg: 'bg-purple-500' },
  { value: '#ec4899', label: 'Rose', bg: 'bg-pink-500' },
  { value: '#6b7280', label: 'Gris', bg: 'bg-gray-500' },
];

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit }) => {
  const initialValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || '#f97316',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={categorySchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la catégorie *</Label>
            <Field as={Input} id="name" name="name" placeholder="Nom de la catégorie" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Field
              as={Textarea}
              id="description"
              name="description"
              placeholder="Description de la catégorie"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div>
            <Label>Couleur</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFieldValue('color', option.value)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    values.color === option.value
                      ? 'border-orange-500 ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mx-auto ${option.bg}`} />
                  <span className="text-xs mt-1 block">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
