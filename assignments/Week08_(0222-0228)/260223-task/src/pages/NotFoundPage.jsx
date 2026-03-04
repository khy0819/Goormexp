import { Link, useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

// 3단계: 존재하지 않는 경로에 대한 404 페이지 처리
export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
      <p className={styles.desc}>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← 이전 페이지
        </button>
        <Link to="/" className={styles.homeBtn}>
          🏠 홈으로
        </Link>
      </div>
    </div>
  )
}
