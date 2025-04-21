import { Outlet } from "react-router-dom"
import Header from "../header"
import styles from "./layout.module.scss"

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.pageContainer}>
          <Outlet />
        </div>
      </main>

      {/* <footer className={styles.footer}>
        <p>Project Management System © {new Date().getFullYear()}</p>
      </footer> */}
    </div>
  )
}

export default Layout
