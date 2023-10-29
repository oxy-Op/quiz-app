"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";

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
import qs from "query-string";
import { insertData } from "@/lib/db-provider";
import { Input } from "../ui/input";
import generateRandomName from "@/utils/random-name";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  quizName: z.string({ required_error: "Quiz name is required" }),
  difficulty: z.string({ required_error: "Difficulty is required" }),
  amount: z.enum(["5", "10", "20"]),
});

export function SetupQuestions() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      quizName: generateRandomName(10),
      difficulty: "easy",
      amount: "10",
    },
  });

  const [activeBtn, setActiveBtn] = useState(form.getValues("amount"));
  const navigate = useNavigate();
  const uuid = uuidv4();
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const params = qs.stringify({
      quizName: data.quizName,
      difficulty: data.difficulty,
      quizId: uuid,
      amount: data.amount,
    });

    insertData(uuid, {
      name: data.quizName,
      difficulty: data.difficulty,
      amount: data.amount,
      isSubmitted: false,
      hasResult: false,
    });

    navigate("/question?" + params);
  }

  const handleBtnClick = (btn: "5" | "10" | "20") => {
    setActiveBtn(btn);
    form.setValue("amount", btn);
  };

  return (
    <>
      <div className="ms-2 mt-2">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="w-6 h-6 cursor-pointer"
        />
      </div>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full sm:w-auto p-2 sm:p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="sm:p-6">
              <CardHeader>
                <CardTitle>New Quiz</CardTitle>
              </CardHeader>
              <CardContent className="flex  flex-col space-y-3">
                <FormField
                  control={form.control}
                  name="quizName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz name</FormLabel>
                      <Input {...field} placeholder="Quiz name" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
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
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({}) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <div className="flex rounded-md px-4 justify-between bg-slate-200 dark:bg-zinc-800">
                        <Button
                          className={cn(
                            "px-8 focus:ring-1 focus:ring-inset active:bg-slate-600",
                            activeBtn === "5" && "bg-slate-600"
                          )}
                          variant={"ghost"}
                          onClick={() => handleBtnClick("5")}
                          type="button"
                        >
                          5
                        </Button>
                        <Button
                          className={cn(
                            "px-8 focus:ring-1 focus:ring-inset active:bg-slate-600",
                            activeBtn === "10" && "bg-slate-600"
                          )}
                          variant={"ghost"}
                          onClick={() => handleBtnClick("10")}
                          type="button"
                        >
                          10
                        </Button>
                        <Button
                          className={cn(
                            "px-8 focus:ring-1 focus:ring-inset active:bg-slate-600",
                            activeBtn === "20" && "bg-slate-600"
                          )}
                          variant={"ghost"}
                          onClick={() => handleBtnClick("20")}
                          type="button"
                        >
                          20
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create Quiz</Button>
              </CardContent>
              <CardFooter className="text-xs">
                <p>Your data will be saved on your local browser</p>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
}
