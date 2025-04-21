import { Routes, Route } from "react-router-dom"
import IssuesPage from "../pages/IssuesPage/IssuesPage"
import BoardsPage from "../pages/BoardsPage/BoardsPage"
import BoardPage from "../pages/BoardPage/BoardPage"
import NotFoundPage from "../pages/NotFoundPage"
import Layout from "../components/layout"

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<IssuesPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
