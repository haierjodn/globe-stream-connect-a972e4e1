import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Devices from "@/pages/Devices";
import IPPool from "@/pages/IPPool";
import Bandwidth from "@/pages/Bandwidth";
import Accounts from "@/pages/Accounts";
import Nurture from "@/pages/Nurture";
import Posting from "@/pages/Posting";
import Analytics from "@/pages/Analytics";
import Assets from "@/pages/Assets";
import HandheldProductImage from "@/pages/HandheldProductImage";
import AIScript from "@/pages/AIScript";
import Editing from "@/pages/Editing";
import Leads from "@/pages/Leads";
import Customs from "@/pages/Customs";
import Pool from "@/pages/Pool";
import Org from "@/pages/Org";
import Roles from "@/pages/Roles";
import TenantConfig from "@/pages/TenantConfig";
import Billing from "@/pages/Billing";
import BandwidthBilling from "@/pages/BandwidthBilling";
import Audit from "@/pages/Audit";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/ip-pool" element={<IPPool />} />
              <Route path="/bandwidth" element={<Bandwidth />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/nurture" element={<Nurture />} />
              <Route path="/posting" element={<Posting />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/assets/handheld-product" element={<HandheldProductImage />} />
              <Route path="/ai-script" element={<AIScript />} />
              <Route path="/editing" element={<Editing />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/customs" element={<Customs />} />
              <Route path="/pool" element={<Pool />} />
              <Route path="/org" element={<Org />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/tenant-config" element={<TenantConfig />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/bandwidth-billing" element={<BandwidthBilling />} />
              <Route path="/audit" element={<Audit />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
