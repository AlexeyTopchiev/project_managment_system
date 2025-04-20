import { Routes, Route } from "react-router-dom"
import IssuesPage from "../pages/IssuesPage"
import BoardsPage from "../pages/BoardsPage"
import BoardPage from "../pages/BoardPage"
import NotFoundPage from "../pages/NotFoundPage"

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/issues" element={<IssuesPage />} />
      <Route path="/boards" element={<BoardsPage />} />
      <Route path="/board/:boardId" element={<BoardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
