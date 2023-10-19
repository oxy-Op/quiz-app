import { ThemeProvider } from "@/components/theme-provider";
// import { ModeToggle } from "@/components/mode-toggle";
import InitialProfile from "./components/modals/signin";
import { profile } from "./lib/profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SetupQuestions } from "./components/modals/configure-quiz";
import Questions from "./components/modals/questions";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      {!profile() && <InitialProfile />}
      {profile() && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SetupQuestions />} />
            <Route path="/question" element={<Questions />} />
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
}
