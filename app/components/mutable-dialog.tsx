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
import { ZodType } from 'zod';
import { toast } from 'sonner';


export interface ActionState<T> {
  success: boolean;
  message: string | null;
  data?: T;
}

interface GenericDialogProps<T extends FieldValues> {
  formSchema: ZodType<T>;
  FormComponent: React.ComponentType<{ form: UseFormReturn<T> }>;
  action?: (data: T) => Promise<ActionState<T>>;
  triggerButtonLabel?: string;
  addDialogTitle?: string;
  editDialogTitle?: string;
  dialogDescription?: string;
  submitButtonLabel?: string;
  defaultValues?: DefaultValues<T>;
}

export default function MutableDialog<T extends FieldValues>({
  formSchema,
  FormComponent,
  action,
  triggerButtonLabel = 'Open',
  addDialogTitle = 'Add Item',
  editDialogTitle = 'Edit Item',
  dialogDescription = 'Fill out the form below.',
  submitButtonLabel = 'Submit',
  defaultValues,
}: GenericDialogProps<T>) {
  const [open, setOpen] = useState(false);

  const form = useForm<T>({
    resolver: async (values) => {
      try {
        const result = formSchema.parse(values);
        return { values: result, errors: {} };
      } catch (err: any) {
        return { values: {}, errors: err.formErrors?.fieldErrors || {} };
      }
    },
    defaultValues,
  });

  // Reset form values whenever the dialog opens or defaultValues change
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form]);

  async function handleSubmit(data: T) {
    if (!action) {
      toast.error('No action defined for this dialog.');
      return;
    }
    const result = await action(data);
    if (result.success) {
      toast.success(result.message || 'Success');
    } else {
      toast.error(result.message || 'An error occurred');
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerButtonLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? editDialogTitle : addDialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormComponent form={form} />
          <DialogFooter>
            <Button type="submit">{submitButtonLabel}</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
