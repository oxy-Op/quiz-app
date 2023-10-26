import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { keys, read } from "@/lib/db-provider";
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
  const [result, setResult] = useState<ResultObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    keys().then((result) => {
      if (result) {
        result.map((item) => {
          read(item).then((result) => {
            console.log(result);
            setResult((prev) => [...prev, result]);
          });
        });
      }
    });

    setIsLoading(false);
  }, []);

  return (
    <div className="mx-3 my-3">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center">
          {result.map((item: Record<string, any>, index: number) => (
            <Card
              onClick={() => {
                navigate("/results?quizId=" + item);
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
