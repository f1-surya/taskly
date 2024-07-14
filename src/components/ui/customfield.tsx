import { Input } from "./input";
import { Label } from "./label";

interface Props {
  name: string;
  type?: string;
  title: string;
}

export default function CustomField({ name, title, type = "text" }: Props) {
  return (
    <div>
      <Label htmlFor={name}>{title}</Label>
      <Input type={type} id={name} name={name} required className="w-[250px]" />
    </div>
  );
}
