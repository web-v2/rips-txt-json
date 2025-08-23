import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import RipsGeneratorAll from "./components/RipsGeneratorAll";
import Configuraciones from "./pages/Configuraciones";
import RipsJsonToTXT from "./components/RipsJsonToTXT";
import RipsConsolidator from "./components/RipsConsolidator";
import TablasDeReferencias from "./pages/TablasDeReferencias";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/txt-to-json" element={<RipsGeneratorAll />} />
          <Route path="/json-to-csv" element={<RipsJsonToTXT />} />
          <Route path="/agrupador-json" element={<RipsConsolidator />} />          
          <Route path="/config" element={<Configuraciones />} />
          <Route path="/TablesReferences" element={<TablasDeReferencias />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
