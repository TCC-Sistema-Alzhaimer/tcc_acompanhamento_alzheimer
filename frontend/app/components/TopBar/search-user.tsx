import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useNavigate } from "react-router";
import { ROUTES } from "~/routes/EnumRoutes";

const searchSchema = z.object({
  searchTerm: z.string().min(1, "Digite algo para buscar").optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function SearchUser() {
  const navigate = useNavigate();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: "",
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    navigate(ROUTES.DOCTOR.PATIENTS + `?search=${data.searchTerm}`);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-full max-w-md"
      >
        <FormField
          control={form.control}
          name="searchTerm"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Buscar pacientes..."
                  {...field}
                  variant="search"
                  className="!bg-white rounded-full placeholder:text-gray-800 h-10"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="action"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-green-500 hover:bg-green-600"
        >
          <Search className="text-white hover:text-white size-4" />
        </Button>
      </form>
    </Form>
  );
}
