import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { useState } from "react";

const InitialProfile = () => {
  const [name, setName] = useState("");
  const [valid, setValid] = useState(true);

  const onSubmit = () => {
    if (valid) {
      localStorage.setItem("name", name);
      localStorage.setItem(
        "id",
        Math.round(Math.random() * 1000000000).toString()
      );
      window.location.reload();
    } else {
      alert("invalid name");
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
    const namePattern = /^[A-Za-z0-9_]+$/;

    if (name.length > 0 && namePattern.test(name)) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>What is your name?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:space-x-2 space-y-3 md:space-y-0">
          <Input placeholder="Your name" onChange={(e) => onInputChange(e)} />
          <Button
            disabled={!name}
            onClick={() => onSubmit()}
            className="w-[72px] mx-auto"
            variant="secondary"
          >
            Submit
          </Button>
        </CardContent>
        <CardFooter className="text-xs">
          <p>Your data will be saved on your local browser</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InitialProfile;
