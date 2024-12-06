'use client';

import React, { useState, useEffect } from 'react';
import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ZodType } from 'zod';

export interface ActionState<T> {
  success: boolean;
  message: string | null;
  data?: T;
}

interface GenericDialogProps<T extends FieldValues> {
  formSchema: ZodType<T>;
  FormComponent: React.ComponentType<{ form: UseFormReturn<T> }>;
  action?: (data: T) => Promise<ActionState<T>>;
  deleteAction?: (id: string) => Promise<boolean>; // Action to delete the user
  triggerButtonLabel?: string;
  addDialogTitle?: string;
  editDialogTitle?: string;
  dialogDescription?: string;
  submitButtonLabel?: string;
  deleteButtonLabel?: string;
  defaultValues?: DefaultValues<T>;
}

export default function MutableDialog<T extends FieldValues>({
  formSchema,
  FormComponent,
  action,
  deleteAction,
  defaultValues,
  triggerButtonLabel = defaultValues ? 'Edit' : 'Add',
  addDialogTitle = 'Add',
  editDialogTitle = 'Edit',
  dialogDescription = defaultValues
    ? "Make changes to your item here. Click save when you're done."
    : 'Fill out the form below to add a new item.',
  submitButtonLabel = defaultValues ? 'Save' : 'Add',
  deleteButtonLabel = 'Delete',
}: GenericDialogProps<T>) {
  const [open, setOpen] = useState(false);

  const form = useForm<T>({
    resolver: async (values) => {
      try {
        console.log('Form values before validation:', values);
        const result = formSchema.parse(values);
        console.log('Validation passed:', result);
        return { values: result, errors: {} };
      } catch (err: any) {
        console.log('Validation errors:', err.formErrors?.fieldErrors);
        return { values: {}, errors: err.formErrors?.fieldErrors };
      }
    },
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function handleSubmit(data: T) {
    if (!action) {
      throw new Error('No action function provided');
    }

    const actions = await action(data);

    if (actions.success) {
      toast.success(actions.message || 'Operation successful!');
    } else {
      toast.error(actions.message || 'Operation failed!');
    }
    setOpen(false);
  }

  async function handleDelete() {
    if (!deleteAction || !defaultValues?.id) return;
    if (confirm('Are you sure you want to delete this item?')) {
      const success = await deleteAction(defaultValues.id);
      if (success) {
        toast.success('Item deleted successfully!');
        setOpen(false);
      } else {
        toast.error('Failed to delete item.');
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerButtonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{defaultValues ? editDialogTitle : addDialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormComponent form={form} />
          <div className="mt-4 flex justify-between">
            {defaultValues && deleteAction && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                {deleteButtonLabel}
              </Button>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button type="submit">{submitButtonLabel}</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
