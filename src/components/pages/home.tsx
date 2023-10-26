import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { read, readData } from "@/lib/db-provider";
import { Loader2, Slash } from "lucide-react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

interface ResultObject {
  uuid: string;
  answers: string[];
  correct_answers: string[];
  questions: string[];
  correct_count: number;
  incorrect_count: number;
}

export const Home = () => {
  const [quiz, setQuiz] = useState<Record<string, any>>([]);
  const [result, setResult] = useState<ResultObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    read("quiz-created").then((result) => {
      if (result && result.quizObject) {
        const submittedQuizzes = result.quizObject.filter(
          (item: Record<string, any>) => item.isSubmitted === true
        );
        setQuiz(submittedQuizzes);

        result.quizObject.map((item: Record<string, any>) => {
          read(item.uuid).then((result) => {
            console.log(result);
            setResult((prev) => [...prev, result]);
          });
        });
      }
    });

    setIsLoading(false);
  }, []);

  if (!isLoading) {
    console.log(JSON.stringify(result, null, 2));
    console.log(JSON.stringify(quiz, null, 2));
  }

  return (
    <div className="mx-3 my-3">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center">
          {quiz.map((item: Record<string, any>, index: number) => (
            <Card
              onClick={() => {
                navigate("/results?quizId=" + item.uuid);
              }}
              key={index}
              className="ms-2 me-2 mt-2 cursor-pointer dark:border-slate-300 border-zinc-500 transition-all hover:transform hover:scale-105 hover:shadow-lg"
            >
              <CardHeader className="flex pt-2">
                <Badge className="bg-green-500 w-[16px] px-0 h-[16px] ms-auto"></Badge>
                <CardTitle>Quiz: {item.name}</CardTitle>
                <CardDescription>Difficulty: {item.difficulty}</CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>
                <p className="text-xs dark:text-zinc-400 overflow-ellipsis">
                  Quiz ID: {item.uuid}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
