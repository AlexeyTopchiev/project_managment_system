import { Link, useLocation } from "react-router-dom"
import CreateIssueButton from "../../features/issues/CreateIssueButton/"
import styles from "./header.module.scss"

const Header = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerNav}>
          <Link to="/" className={styles.logo}>
            Project Manager
          </Link>

          <nav className={styles.nav}>
            <Link
              to="/issues"
              className={`${styles.navLink} ${
                isActive("/issues") || isActive("/") ? styles.active : ""
              }`}
            >
              Все задачи
            </Link>
            <Link
              to="/boards"
              className={`${styles.navLink} ${
                isActive("/boards") ? styles.active : ""
              }`}
            >
              Доски
            </Link>
          </nav>
        </div>
        <CreateIssueButton />
      </div>
    </header>
  )
}

export default Header
