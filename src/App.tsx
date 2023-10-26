import { ThemeProvider } from "@/components/theme-provider";
import InitialProfile from "./components/pages/signin";
import { profile } from "./lib/profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SetupQuestions } from "./components/pages/configure-quiz";
import { Quiz } from "./components/pages/quiz";
import { Results } from "./components/pages/results";
import Layout from "./components/pages/layout";
import { Home } from "./components/pages/home";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      {!profile() && <InitialProfile />}
      {profile() && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/configure-quiz" element={<SetupQuestions />} />
              <Route path="/question" element={<Quiz />} />
              <Route path="/results" element={<Results />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
}
