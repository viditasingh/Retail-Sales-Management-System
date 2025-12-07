import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import TransactionsPage from "./pages/TransactionsPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<TransactionsPage />} />
  )
);
