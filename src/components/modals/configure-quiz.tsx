"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  difficulty: z.string({ required_error: "Difficulty is required" }),
});

export function SetupQuestions() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      difficulty: "easy",
    },
  });

  const navigate = useNavigate();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    localStorage.setItem("difficulty", data.difficulty);
    navigate("/question");
  }

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>New Quiz</CardTitle>
                </CardHeader>
                <CardContent className="flex  flex-col space-y-3">
                  <FormItem>
                    <FormLabel>Select Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                  <Button type="submit">Create Quiz</Button>
                </CardContent>
                <CardFooter className="text-xs">
                  <p>Your data will be saved on your local browser</p>
                </CardFooter>
              </Card>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
