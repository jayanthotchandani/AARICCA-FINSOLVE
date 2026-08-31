import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import LoanProductPage from "./pages/LoanProductPage.jsx";
import DebtConsolidation from "./pages/DebtConsolidation.jsx";
import CheckScore from "./pages/CheckScore.jsx";
import ImproveScore from "./pages/ImproveScore.jsx";
import ApplyForm from "./pages/ApplyForm.jsx";
import Calculators from "./pages/Calculators.jsx";
import LoanProcess from "./pages/LoanProcess.jsx";
import WhyAaricca from "./pages/WhyAaricca.jsx";
import Faqs from "./pages/Faqs.jsx";
import LeadQueue from "./pages/LeadQueue.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/admin/queue" element={<LeadQueue />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/loans/:loanId" element={<LoanProductPage />} />
        <Route path="/debt-consolidation" element={<DebtConsolidation />} />
        <Route path="/credit-score/check" element={<CheckScore />} />
        <Route path="/credit-score/improve" element={<ImproveScore />} />
        <Route path="/apply" element={<ApplyForm />} />
        <Route path="/calculators" element={<Calculators />} />
        <Route path="/loan-process" element={<LoanProcess />} />
        <Route path="/why-aaricca" element={<WhyAaricca />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
