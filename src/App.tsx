import { ThemeProvider } from "@/components/theme-provider";
import InitialProfile from "./components/pages/signin";
import { isProfile } from "./lib/isUser";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SetupQuestions } from "./components/pages/configure-quiz";
import { Quiz } from "./components/pages/quiz";
import { Results } from "./components/pages/results";
import Layout from "./components/pages/layout";
import { Home } from "./components/pages/home";
import { ModalProvider } from "./components/providers/modal-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ModalProvider />
      <BrowserRouter basename="/projects/quiz-app">
        <Routes>
          {!isProfile() && <Route index element={<InitialProfile />} />}
          {isProfile() && (
            <Route path={`${process.env.PUBLIC_URL}/`} element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path={`${process.env.PUBLIC_URL}/configure-quiz`}
                element={<SetupQuestions />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/question`}
                element={<Quiz />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/results`}
                element={<Results />}
              />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
