import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getMemo, deleteMemo } from '../api/memos'
import styles from './MemoDetailPage.module.css'

// 6단계: 메모 상세 페이지
// - useParams로 URL의 :id 추출
// - useNavigate로 삭제 후 목록 페이지 이동
export default function MemoDetailPage() {
  // 6단계: useParams — URL의 :id 파라미터 추출
  const { id } = useParams()

  // 6단계: useNavigate — 코드로 페이지 이동
  const navigate = useNavigate()

  const [memo,    setMemo]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [deleting, setDeleting] = useState(false)

  // useParams로 추출한 id로 단일 메모 API 호출
  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getMemo(id)
        setMemo(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    setDeleting(true)
    try {
      await deleteMemo(id)
      // 6단계: useNavigate — 삭제 후 목록 페이지로 이동
      navigate('/', { replace: true })
    } catch (e) {
      alert(e.message)
      setDeleting(false)
    }
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  const categoryColor = { 학습: '#3b82f6', 개인: '#8b5cf6', 아이디어: '#f59e0b' }

  if (loading) return <div className={styles.status}>불러오는 중...</div>
  if (error)   return (
    <div className={styles.errorBox}>
      <p>{error}</p>
      <Link to="/" className={styles.backLink}>← 목록으로</Link>
    </div>
  )

  return (
    <div className={`${styles.container} page-enter`}>
      {/* 뒤로 가기 */}
      <Link to="/" className={styles.backLink}>← 목록으로</Link>

      <article className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.meta}>
            <span
              className={styles.badge}
              style={{
                background: `${categoryColor[memo.category]}18`,
                color: categoryColor[memo.category],
              }}
            >
              {memo.category}
            </span>
            <time className={styles.date}>{formatDate(memo.updatedAt)}</time>
          </div>
          <h1 className={styles.title}>{memo.title}</h1>
        </div>

        <div className={styles.divider} />

        <pre className={styles.content}>{memo.content}</pre>

        <div className={styles.timestamps}>
          <span>작성: {formatDate(memo.createdAt)}</span>
          {memo.createdAt !== memo.updatedAt && (
            <span>수정: {formatDate(memo.updatedAt)}</span>
          )}
        </div>
      </article>

      {/* 액션 버튼 */}
      <div className={styles.actions}>
        {/* 5단계: Link로 수정 페이지 이동 */}
        <Link to={`/memos/${id}/edit`} className={styles.editBtn}>
          ✏️ 수정
        </Link>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? '삭제 중...' : '🗑 삭제'}
        </button>
      </div>
    </div>
  )
}
