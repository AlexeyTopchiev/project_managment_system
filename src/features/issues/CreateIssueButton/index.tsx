import { useState } from "react"
// import { PlusIcon } from "@heroicons/react/outline"
// import IssueFormModal from "./IssueFormModal"
import styles from "./CreateIssueButton.module.scss"

const CreateIssueButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button className={styles.createButton} onClick={() => setIsOpen(true)}>
        {/* <PlusIcon className={styles.icon} /> */}+<span>Создать задачу</span>
      </button>

      {/* <IssueFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
    </>
  )
}

export default CreateIssueButton
