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
import { Loader2, Plus, Slash } from "lucide-react";
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
            setResult((prev) => [...prev, { uuid: item, ...result }]);
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
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-center items-center sm:p-0 p-5">
            <Card className="w-full sm:w-[300px] sm:h-[200px] ms-2 me-2 mt-2 cursor-pointer dark:border-slate-300 border-zinc-500 transition-all ">
              <CardHeader>
                <CardTitle>Create Quiz</CardTitle>
              </CardHeader>
              <CardContent
                onClick={() => {
                  navigate("/configure-quiz");
                }}
                className="h-[60%]"
              >
                <div className="flex justify-center items-center border-gray-500 border border-dashed h-full">
                  <Plus />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 w-full border border-slate-400"></div>
          <div className="flex items-center flex-wrap justify-center">
            {result.length === 0 && (
              <div className="mt-4 flex items-center justify-center">
                Your created quizzes will appear here
              </div>
            )}
            {result.length > 0 &&
              result.map((item: Record<string, any>, index: number) => (
                <Card
                  onClick={() => {
                    navigate("/results?redirected=true&quizId=" + item.uuid);
                  }}
                  key={index}
                  className="sm:min-w-[300px] sm:min-h-[230px] flex-1 ms-2 me-2 mt-2 cursor-pointer dark:border-slate-300 border-zinc-500 transition-all hover:transform hover:scale-105 hover:shadow-lg"
                >
                  <CardHeader className="flex pt-2 text-center">
                    <Badge className="bg-green-500 w-[16px] px-0 h-[16px] ms-auto"></Badge>
                    <CardTitle>Quiz: {item.name}</CardTitle>
                    <CardDescription>
                      Difficulty: {item.difficulty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center">
                      <Badge className="w-[64px] h-[32px] bg-[#01be5c] hover:bg-[#01be5c]/90 flex transition delay-100 items-center justify-center rounded-none">
                        {item.correct_count}
                      </Badge>
                      <Slash style={{ rotate: "340deg" }}></Slash>
                      <Badge className="w-[64px] h-[32px] bg-red-500 hover:bg-red-500/50 flex items-center transition delay-100 justify-center rounded-none ">
                        {item.correct_count + item.incorrect_count}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <p className="text-xs dark:text-zinc-400 overflow-ellipsis">
                      Quiz ID: {item.uuid}
                    </p>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
