import { resultGet } from "@/lib/result-get";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import {
  AlignJustify,
  ArrowLeft,
  Grid2x2,
  ShieldQuestion,
  Slash,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { read, update } from "@/lib/db-provider";
import { isUUIDv4 } from "@/utils/isUuid";

interface Result {
  correct: {
    item: string;
  }[];
  correctCount: number;
  incorrect: {
    item: string;
  }[];
  incorrectCount: number;
}

interface Error {
  error_id: number;
  message: string;
  quizId: string;
}

interface DataProps {
  answers: string[];
  questions: string[];
  correct_answers: string[];
}

export const Results = () => {
  const [result, setResult] = useState<Result>({
    correct: [],
    correctCount: 0,
    incorrect: [],
    incorrectCount: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const queryParams = new URLSearchParams(location.search);
  const [isListViewToggled, setIsListViewToggled] = useState<boolean>(false);
  const [data, setData] = useState<DataProps>({
    answers: [],
    correct_answers: [],
    questions: [],
  });
  const quizId = queryParams.get("quizId") as string;
  const redirect_from_home = queryParams.get("redirected") as string;

  useEffect(() => {
    if (!quizId || quizId === null || !isUUIDv4(quizId)) {
      setError({ error_id: 404, message: "Quiz not found", quizId: "NA" });
      return;
    }

    read(quizId)
      .then((data) => {
        if (data) {
          console.log(`Quiz with ID ${quizId} is created.`);
          if (!data.isSubmitted) {
            setError({
              error_id: 404,
              message: "Quiz not submitted",
              quizId,
            });
            return;
          }

          const result = resultGet(data.answers, data.correct_answers);
          setResult(result);
          setData({
            answers: data.answers,
            correct_answers: data.correct_answers,
            questions: data.questions,
          });

          if (!data.hasResult) {
            update(quizId, {
              correct_count: result.correctCount,
              incorrect_count: result.incorrectCount,
              hasResult: true,
            });
          }
          setIsLoading(false);
        } else {
          console.log(`Quiz with ID ${quizId} not found.`);
          setError({ error_id: 404, message: "Quiz not found", quizId });
        }
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  return (
    <>
      {isLoading && error && (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] md:min-w-[420px]">
          <div className="flex flex-col items-center justify-center ">
            <h3 className="text-4xl text-red-400"> Error: {error.message}</h3>
            <code className="text-xs mt-4 bg-slate-200 dark:bg-zinc-800">
              Quiz ID: {error.quizId}
            </code>
            <div className="flex flex-row justify-between items-center">
              <a
                className="flex justify-center items-center mt-2 text-indigo-400 underline "
                href="/"
              >
                Back to Home
              </a>
              <a
                className="flex justify-center items-center mt-2 ms-2 text-indigo-400 underline "
                href="/"
              >
                Report an issue
              </a>
            </div>
          </div>
        </div>
      )}
      {!isLoading && !error && (
        <div className="flex flex-col w-full h-screen relative">
          {redirect_from_home === "true" && (
            <div className="ms-2 mt-2">
              <ArrowLeft
                onClick={() => navigate(-1)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
          )}
          <Card className="w-[70%] mx-auto mt-2 border-[#1f201f] dark:border-[#e8e8e8]">
            <CardHeader className="text-center">
              <CardTitle>Results</CardTitle>
              <CardDescription>Your anime quiz results are</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[150px]">
              <div className="flex items-center justify-center">
                <Badge className="w-[64px] h-[32px] bg-[#01be5c] hover:bg-[#01be5c]/90 flex transition delay-100 items-center justify-center rounded-none">
                  {result.correctCount}
                </Badge>
                <Slash style={{ rotate: "340deg" }}></Slash>
                <Badge className="w-[64px] h-[32px] bg-red-500 hover:bg-red-500/50 flex items-center transition delay-100 justify-center rounded-none ">
                  {result.correctCount + result.incorrectCount}
                </Badge>
              </div>
              <div className="flex flex-col items-center justify-center mt-4">
                <p>
                  You got {result.correctCount} correct total out of{" "}
                  {result.correctCount + result.incorrectCount}.
                </p>
                <p className="mt-2 text-xl">
                  Your score is{" "}
                  {Math.round(
                    (result.correctCount /
                      (result.correctCount + result.incorrectCount)) *
                      100
                  )}
                  %
                </p>
              </div>
            </CardContent>
            <CardFooter className="text-xs justify-center">
              <p className="text-center">Quiz id: {quizId}</p>
            </CardFooter>
          </Card>
          <div className="w-full flex flex-col mt-3 md:bg-slate-200 dark:md:bg-[#333336] ">
            <div className="w-[85%] mx-auto justify-center hidden md:flex p-3 sticky top-0 bg-inherit border-zinc-500 dark:border-slate-300 border-b-2 z-20">
              <div className="mx-auto">
                <h2 className="text-2xl font-bold">Your answers</h2>
              </div>
              <div>
                {!isListViewToggled ? (
                  <AlignJustify
                    onClick={() => {
                      setIsListViewToggled(!isListViewToggled);
                    }}
                    className="mt-2"
                  />
                ) : (
                  <Grid2x2
                    onClick={() => {
                      setIsListViewToggled(!isListViewToggled);
                    }}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
            <div
              className={cn(
                "w-full p-2 flex sm:flex-wrap flex-col justify-center items-center",
                !isListViewToggled ? "sm:flex-row" : "flex-col"
              )}
            >
              {data.questions.map((item, index) => (
                <Card
                  key={index}
                  className={cn(
                    "border-[#8bccaa] mt-2 me-2 h-[250px] transition-transform hover:transform hover:scale-[1.02] sm:w-auto w-full",
                    !isListViewToggled ? "sm:w-[400px] " : "sm:w-[800px]"
                  )}
                >
                  <CardHeader className="pt-0">
                    <Badge
                      className="w-[16px] flex items-center justify-center ms-auto mt-2 me-2"
                      variant={"destructive"}
                    >
                      {index + 1}
                    </Badge>
                    <CardTitle className="text-md flex flex-row">
                      <div>
                        <ShieldQuestion className="me-1" />
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: item }} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pb-1">
                    <div className="flex flex-col justify-center items-center">
                      {data?.answers[index] === data?.correct_answers[index] ? (
                        <div className="bg-blue-500 p-2">
                          <div className="flex font-bold text-blue-200">
                            <p className="me-1">You answered: </p>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: data?.answers[index],
                              }}
                            ></p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-500 p-2">
                          <div className="flex font-bold text-red-200">
                            <p className="me-1">You answered: </p>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: data?.answers[index],
                              }}
                            ></p>
                          </div>
                        </div>
                      )}
                      <div className="bg-green-500 p-2">
                        <div className="flex font-bold text-green-200">
                          <p className="me-1">Correct answer: </p>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: data?.correct_answers[index],
                            }}
                          ></p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
