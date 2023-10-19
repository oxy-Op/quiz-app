import { useCallback, useEffect } from "react";
import qs from "query-string";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import shuffle from "@/lib/shuffle";

interface QuestionsProps {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const Questions = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [questionId, setQuestionId] = useState(0);
  const [loading, setLoading] = useState(true);
  const difficulty = localStorage.getItem("difficulty") || "easy";
  const [answer, setAnswer] = useState([]);

  if (!difficulty) {
    navigate("/");
  }

  useEffect(() => {
    const params = {
      amount: 2,
      difficulty,
      category: 31,
    };
    fetch(`https://opentdb.com/api.php?${qs.stringify(params)}`)
      .then((data) => {
        if (data.ok) {
          return data.json();
        }
      })
      .then((res) => {
        setData(res.results);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentQuestion: QuestionsProps = data[questionId];
  console.log(currentQuestion);

  const answers = shuffle([
    ...currentQuestion.incorrect_answers,
    currentQuestion.correct_answer,
  ]);

  const onNextClick = () => {
    setQuestionId((prev) => prev + 1);
  };

  const handleRadioChange = (e: any) => {
    const selectedValue = e.target.value;
    setAnswer(selectedValue);
    console.log(answer);
  };

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <Card className="p-6">
        <Badge
          className="w-[32px] flex items-center justify-center ms-auto"
          variant={"destructive"}
        >
          {questionId + 1}
        </Badge>
        <CardHeader>
          <CardTitle>
            <div
              dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:space-x-2 space-y-3 md:space-y-0">
          <RadioGroup>
            {answers.map((answer, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 bg-emerald-100 dark:bg-cyan-900/60 rounded-md"
              >
                <RadioGroupItem
                  onClick={handleRadioChange}
                  value={answer}
                  id={index.toString()}
                />
                <Label className="w-full" htmlFor={index.toString()}>
                  <div dangerouslySetInnerHTML={{ __html: answer }} />
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="text-xs flex flex-col space-y-2">
          <p>Your data will be saved on your local browser</p>
          <div className="w-full flex items-center justify-center">
            <Button
              className="flex ms-auto"
              variant={"secondary"}
              onClick={onNextClick}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Questions;
