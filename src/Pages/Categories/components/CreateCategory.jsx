import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema } from "../scheme/categoryScheme";
import CustomInput from "../../../components/input/CustomInput";
import { useMutation } from "@tanstack/react-query";
import { request } from "../../../utils/axios";
import { toast } from "sonner";

const AddCategoryModal = ({ open, onClose }) => {
  const methods = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description:"",
      active: false,
    },
  });

  const mutation = useMutation({
   mutationFn:async (data) => {
      try {
         const response = await request.post("/category/", data);
         methods.reset({
           name: "",
           description: "",
           active: false,
         });
         toast.success("Category added successfully");
         onClose();
         return response.data;
      } catch (error) {
         // Handle error and show user-friendly message
         const errorMessage = 
           error.response?.data?.message || 
           error.response?.data?.detail || 
           error.response?.data?.error ||
           error.message || 
           "Failed to create category";
         
         toast.error(errorMessage);
         console.error("Category creation error:", error);
         throw error; // Re-throw to let react-query handle it
      }
   }
  })

  const handleSubmitCategory = (data) => {
   mutation.mutate({
     name: data.name,
     description: data.description || "",
     active: data.active || false
   });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi kategoriya qo‘shish</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmitCategory)}>
            <div className="space-y-4">
              <CustomInput
                control={methods.control}
                name={"name"}
                placeholder={"Enter name..."}
                isForm
              />

              <Controller
                name="description"
                control={methods.control}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Type your message here." />
                )}
              />
              <Controller
                name="active"
                control={methods.control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <span>active</span>
                  </div>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
