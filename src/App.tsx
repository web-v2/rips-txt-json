import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import RipsGenerator from "./components/RipsGenerator";
import RipsGeneratorMed from "./components/RipsGeneratorMed";
import Dashboard from "./pages/Dashboard";
import RipsGeneratorAll from "./components/RipsGeneratorAll";
import Configuraciones from "./pages/Configuraciones";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mod1" element={<RipsGenerator />} />
          <Route path="/mod2" element={<RipsGeneratorMed />} />
          <Route path="/mod3" element={<RipsGeneratorAll />} />
          <Route path="/config" element={<Configuraciones />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
