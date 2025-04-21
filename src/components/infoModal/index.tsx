import React from "react"
import styles from "./SimpleModal.module.scss"

interface SimpleModalProps {
  isOpen: boolean
  onClose: () => void
}

const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Информация</h3>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <p>Модальное окно с информацией о задаче в разработке</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.okButton} onClick={onClose}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimpleModal
