import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AddColumnProps {
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function AddColumn({ onSave, onCancel }: AddColumnProps) {
  const [name, setName] = useState("");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(name);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Card className="mb-8">
        <form onSubmit={onSubmit}>
          <CardHeader className="mb-2">
            <CardTitle className="md:text-lg text-base">
              Add new column
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Label htmlFor="column-name" className="text-sm">
                Column name
              </Label>
              <Input
                id="column-name"
                placeholder="Enter column name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
