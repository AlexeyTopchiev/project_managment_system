import { useState } from "react"
import IssueFormModal from "../IssueFormModal/IssueFormModal"
import styles from "./CreateIssueButton.module.scss"

const CreateIssueButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button className={styles.createButton} onClick={() => setIsOpen(true)}>
        <span>Создать задачу</span>
      </button>

      <IssueFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default CreateIssueButton
