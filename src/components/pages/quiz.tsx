import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import shuffle from "@/lib/shuffle";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { read, update } from "@/lib/db-provider";

interface QuestionProps {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export const Quiz = () => {
  const [questionId, setQuestionId] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [reached, setReached] = useState(false);
  const [data, setData] = useState<QuestionProps[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizId = queryParams.get("quizId") as string;
  const difficulty = queryParams.get("difficulty") as string;
  const name = queryParams.get("quizName") as string;
  const amount = queryParams.get("amount") as string;

  useEffect(() => {
    if (!quizId || !difficulty || !name || !amount) {
      navigate("/configure-quiz");
    }

    read(quizId).then((result) => {
      if (result) {
        console.log(`Quiz with ID ${quizId} is created.`);

        if (
          result.name === name &&
          result.difficulty === difficulty &&
          result.amount === amount
        ) {
          if (result.isSubmitted) {
            navigate("/results?quizId=" + quizId);
            return;
          }
        } else {
          navigate("/configure-quiz");
          return;
        }
      } else {
        navigate("/configure-quiz");
        return;
      }
    });
  }, []);

  useEffect(() => {
    fetch(
      `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=31`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      const currentQuestion = data[questionId];
      setQuestion(currentQuestion.question);

      const dataOptions = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ];

      setCorrectAnswer((prev) => [...prev, currentQuestion.correct_answer]);

      const newData = shuffle(dataOptions);
      setOptions(newData);
    }
  }, [questionId, loading]);

  const formSchema = z.object({
    answer: z.string({
      required_error: "Answer is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (questionId >= data.length - 1) {
      setAnswers((prev) => [...prev, values.answer]);
      setReached(true);
      form.reset();
    } else {
      setQuestionId((prev) => prev + 1);
      setAnswers((prev) => [...prev, values.answer]);
      form.reset();
    }
  }

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.reset();
    const result_data = {
      answers: answers,
      correct_answers: correctAnswer,
      questions: data.map((item) => item.question),
    };
    update(quizId, {
      ...result_data,
      isSubmitted: true,
      hasResult: false,
    });
    navigate("/results?quizId=" + quizId);
  };

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:w-auto w-full p-2 sm:p-0">
      {loading ? (
        <Loader2 className="mx-auto w-4 h-4 animate-spin">Loading...</Loader2>
      ) : (
        <Card className="sm:p-6 p-2">
          <Badge
            className="w-[32px] flex items-center justify-center ms-auto"
            variant={"destructive"}
          >
            {questionId + 1}
          </Badge>
          <CardHeader>
            <CardTitle className="md:text-[22px] text-[16px]">
              <div dangerouslySetInnerHTML={{ __html: question }} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className="flex flex-col"
                        >
                          {options.map((option, index) => (
                            <FormItem
                              key={index}
                              className=" flex items-center bg-emerald-100 dark:bg-cyan-900/60 rounded-md h-full space-y-0 space-x-2"
                            >
                              <FormControl className="ms-3">
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="flex items-center w-full p-3">
                                <p
                                  dangerouslySetInnerHTML={{ __html: option }}
                                />
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!reached && (
                  <Button
                    disabled={form.formState.isSubmitting}
                    className="flex ms-auto"
                    type="submit"
                  >
                    Next
                  </Button>
                )}
                {reached && (
                  <Button
                    type="submit"
                    onClick={handleOnSubmit}
                    className="flex ms-auto"
                  >
                    Submit
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-xs">
            Data is stored on your local browser
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
