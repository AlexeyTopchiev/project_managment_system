import React from "react"
import styles from "./infoModal.module.scss"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Информация</h3>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <p>
            К сожалению, модальное окно редактирования задачи пока находится в
            разработке. Будет реализовано в ближайшее время. Благодарю за
            понимание, пожалуйста, проверьте другой функционал.
          </p>
        </div>
        {/* <div className={styles.modalFooter}>
          <button className={styles.okButton} onClick={onClose}>
            Понятно
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default InfoModal
