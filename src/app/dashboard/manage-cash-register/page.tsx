'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { ICashRegister as CashRegisterType } from '@/types/cash-register.interface';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ICreateCashRegisterDto {
  name: string;
  description?: string;
}

const mockRegisters: CashRegisterType[] = [
  {
    id: 1,
    storeId: 1,
    name: 'Cash Register 1',
    active: true,
    description: 'Front Desk',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    storeId: 1,
    name: 'Cash Register 2',
    active: true,
    description: 'Main counter',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    storeId: 1,
    name: 'Cash Register 3',
    active: false,
    description: 'Backup terminal in back office',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function CashRegisterPage() {
  const { storeContext } = useAuth();
  const storeId = storeContext?.storeId;

  const [cashRegisters, setCashRegisters] = useState<CashRegisterType[]>(mockRegisters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegister, setEditingRegister] = useState<CashRegisterType | null>(null);

  const fetchCashRegisters = async () => {
    if (!storeId) {
      console.warn('No storeId available, using mock data.');
      setCashRegisters(mockRegisters);
      return;
    }

    try {
      const response = await api.get(`/store/${storeId}/cash-register`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const mappedRegisters: CashRegisterType[] = response.data.map(
          (register: CashRegisterType) => ({
            id: register.id,
            storeId: register.storeId,
            name: register.name,
            active: register.active,
            description: register.description,
            createdAt: register.createdAt,
            updatedAt: register.updatedAt,
          })
        );
        setCashRegisters(mappedRegisters);
      } else {
        setCashRegisters(mockRegisters);
      }
    } catch (error) {
      if (error) {
        toast.error('Failed to load cash registers, loading mock data');
      }

      setCashRegisters(mockRegisters);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchCashRegisters();
    }
  }, [storeId]);

  const handleCreate = async (values: ICreateCashRegisterDto) => {
    try {
      await api.post(`/store/${storeId}/cash-register`, values);
      toast.success('Cash register created');
      fetchCashRegisters();
      setIsModalOpen(false);
    } catch (error) {
      if (error) {
        toast.error('Failed to create cash register');
      }
    }
  };

  const handleUpdate = async (values: ICreateCashRegisterDto) => {
    try {
      if (!editingRegister) return;
      await api.patch(`/store/${storeId}/cash-register/${editingRegister.id}`, values);
      toast.success('Cash register updated');
      fetchCashRegisters();
      setEditingRegister(null);
      setIsModalOpen(false);
    } catch (error) {
      if (error) {
        toast.error('Failed to update cash register');
      }
    }
  };

  return (
    <div className="p-4 py-6 sm:ml-64">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Cash Registers</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingRegister(null)}
              className="bg-slate-900 hover:bg-slate-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Cash Register
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRegister ? 'Edit' : 'Create'} Cash Register</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Fill out the cash register details below.
              </p>
            </DialogHeader>
            <Formik
              initialValues={{
                name: editingRegister?.name || '',
                description: editingRegister?.description || '',
              }}
              validationSchema={Yup.object({
                name: Yup.string().required('Name is required'),
                description: Yup.string(),
              })}
              onSubmit={(values) => {
                if (editingRegister) {
                  handleUpdate(values);
                } else {
                  handleCreate(values);
                }
              }}
              enableReinitialize
            >
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Field
                    name="name"
                    as={Input}
                    id="name"
                    placeholder="e.g., Front Desk Register or Main POS Terminal"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    placeholder="Location or purpose, e.g., 'Used for morning shifts at reception'"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800" type="submit">
                  {editingRegister ? 'Update' : 'Create'}
                </Button>
              </Form>
            </Formik>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {cashRegisters.map((register) => (
          <div
            key={register.id}
            className="border p-4 rounded-md shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-medium">{register.name}</h2>
            <p className="text-sm text-muted-foreground">{register.description}</p>
            <div className="mt-4">
              <Button
                size="sm"
                onClick={() => {
                  setEditingRegister(register);
                  setIsModalOpen(true);
                }}
                className="bg-slate-900"
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
