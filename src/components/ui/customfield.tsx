import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

interface Props {
  name: string;
  type?: string;
  title: string;
}

export default function CustomField({
  name,
  title,
  type = "text",
}: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{title}</FormLabel>
          <Input {...field} type={type} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
