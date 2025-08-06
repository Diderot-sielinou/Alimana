'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useShopData } from '@/context/store-context';
import { IProduct } from '@/types/product.interface';

interface ProductFormProps {
  initialData?: IProduct;
  onSubmit: (data: Partial<IProduct>) => Promise<void>;
}

const productSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  barcode: Yup.string(),
  sku: Yup.string(),
  brand: Yup.string(),
  unit: Yup.string(),
  sellingPrice: Yup.number().min(0, 'Price must be positive').required('Selling price is required'),
  costPrice: Yup.number().min(0, 'Price must be positive').required('Cost price is required'),
  discountPercentage: Yup.number()
    .min(0, 'Discount must be positive')
    .max(100, 'Discount cannot exceed 100%')
    .default(0),
  quantityInStock: Yup.number()
    .min(0, 'Quantity must be positive')
    .required('Stock quantity is required'),
  categoryId: Yup.number().nullable(),
  imageUrl: Yup.string().url('Invalid URL'),
});

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  const { categories } = useShopData();

  const initialValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    barcode: initialData?.barcode || '',
    sku: initialData?.sku || '',
    brand: initialData?.brand || '',
    unit: initialData?.unit || '',
    sellingPrice: initialData?.sellingPrice || 0,
    costPrice: initialData?.costPrice || 0,
    discountPercentage: initialData?.discountPercentage || 0,
    quantityInStock: initialData?.quantityInStock || 0,
    categoryId: initialData?.categoryId || null,
    imageUrl: initialData?.imageUrl || '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={productSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Field as={Input} id="name" name="name" placeholder="Product name" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Field as={Input} id="sku" name="sku" placeholder="Product code" />
              <ErrorMessage name="sku" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Field
              as={Textarea}
              id="description"
              name="description"
              placeholder="Product description"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Field as={Input} id="barcode" name="barcode" placeholder="Barcode" />
              <ErrorMessage name="barcode" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Field as={Input} id="brand" name="brand" placeholder="Brand" />
              <ErrorMessage name="brand" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sellingPrice">Selling Price *</Label>
              <Field as={Input} id="sellingPrice" name="sellingPrice" type="number" step="0.01" />
              <ErrorMessage
                name="sellingPrice"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <Label htmlFor="costPrice">Cost Price *</Label>
              <Field as={Input} id="costPrice" name="costPrice" type="number" step="0.01" />
              <ErrorMessage
                name="costPrice"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <Label htmlFor="discountPercentage">Discount (%)</Label>
              <Field
                as={Input}
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                min="0"
                max="100"
              />
              <ErrorMessage
                name="discountPercentage"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantityInStock">Stock Quantity *</Label>
              <Field as={Input} id="quantityInStock" name="quantityInStock" type="number" min="0" />
              <ErrorMessage
                name="quantityInStock"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Field as={Input} id="unit" name="unit" placeholder="kg, piece, liter..." />
              <ErrorMessage name="unit" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={values.categoryId?.toString() || ''}
                onValueChange={(value) =>
                  setFieldValue('categoryId', value ? parseInt(value) : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">No category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage
                name="categoryId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>
          {/* upload product image  */}
          <div>
            <Label htmlFor="image">Image du produit</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.currentTarget.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('file', file);

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

                  if (!res.ok) {
                    throw new Error('Erreur lors de l’upload');
                  }

                  const data = await res.json();
                  console.log(data);
                  setFieldValue('imageUrl', data.url);
                } catch (error) {
                  console.error('Erreur upload image:', error);
                  alert('Erreur lors de l’envoi de l’image.');
                }
              }}
            />
            <ErrorMessage name="imageUrl" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Field as={Input} id="imageUrl" name="imageUrl" placeholder="https://..." />
            <ErrorMessage name="imageUrl" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
