import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Students from "./pages/Students";
import NewStudent from "./pages/NewStudent";
import EditStudent from "./pages/EditStudent";
import NewWorkout from "./pages/NewWorkout";
import EditWorkout from "./pages/EditWorkout";
import WorkoutPlan from "./pages/WorkoutPlan";
import WorkoutHistory from "./pages/WorkoutHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Students />} />
          <Route path="/students/new" element={<NewStudent />} />
          <Route path="/students/edit/:id" element={<EditStudent />} />
          <Route path="/students/:studentId/workout/new" element={<NewWorkout />} />
          <Route path="/students/:studentId/workouts" element={<WorkoutHistory />} />
          <Route path="/workout/:workoutId" element={<WorkoutPlan />} />
          <Route path="/workout/:workoutId/edit" element={<EditWorkout />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
