import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getMemos, CATEGORIES } from '../api/memos'
import styles from './MemoListPage.module.css'

const PAGE_SIZE = 4

// 4단계: 메모 목록 페이지
// 선택 구현: useSearchParams로 검색/필터/페이지 상태를 URL에 반영
export default function MemoListPage() {
  // 선택 구현: useSearchParams — 검색어·카테고리·페이지를 URL 쿼리스트링으로 관리
  const [searchParams, setSearchParams] = useSearchParams()
  const search   = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''
  const page     = parseInt(searchParams.get('page') ?? '1', 10)

  const [memos,   setMemos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // 데이터 로딩
  const fetchMemos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMemos({ search, category })
      setMemos(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, category])

  useEffect(() => { fetchMemos() }, [fetchMemos])

  // 검색 핸들러 — URL 쿼리스트링 업데이트
  const handleSearch = (e) => {
    const next = new URLSearchParams(searchParams)
    next.set('q', e.target.value)
    next.set('page', '1')
    setSearchParams(next)
  }

  const handleCategory = (cat) => {
    const next = new URLSearchParams(searchParams)
    if (cat === category) {
      next.delete('category')
    } else {
      next.set('category', cat)
    }
    next.set('page', '1')
    setSearchParams(next)
  }

  const handlePage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 클라이언트 페이지네이션 (json-server 페이지네이션 대신 간단 구현)
  const totalPages = Math.max(1, Math.ceil(memos.length / PAGE_SIZE))
  const pagedMemos = memos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    })

  const categoryColor = { 학습: '#3b82f6', 개인: '#8b5cf6', 아이디어: '#f59e0b' }

  return (
    <div className={`${styles.container} page-enter`}>
      {/* 헤더 영역 */}
      <div className={styles.topBar}>
        <h1 className={styles.title}>
          내 메모
          <span className={styles.count}>{memos.length}</span>
        </h1>
        <Link to="/memos/new" className={styles.newBtn}>
          + 새 메모
        </Link>
      </div>

      {/* 검색 & 필터 */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="메모 검색..."
            value={search}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => {
              const next = new URLSearchParams(searchParams)
              next.delete('q')
              next.set('page', '1')
              setSearchParams(next)
            }}>✕</button>
          )}
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${!category ? styles.filterActive : ''}`}
            onClick={() => handleCategory('')}
          >전체</button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${category === cat ? styles.filterActive : ''}`}
              style={category === cat ? { background: categoryColor[cat], color: '#fff', borderColor: categoryColor[cat] } : {}}
              onClick={() => handleCategory(cat)}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* 상태 표시 */}
      {loading && <div className={styles.statusMsg}>불러오는 중...</div>}
      {error   && <div className={`${styles.statusMsg} ${styles.errorMsg}`}>{error}</div>}

      {/* 메모 목록 */}
      {!loading && !error && (
        <>
          {pagedMemos.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p>{search || category ? '검색 결과가 없습니다.' : '아직 메모가 없습니다.'}</p>
              {!search && !category && (
                <Link to="/memos/new" className={styles.emptyLink}>첫 메모 작성하기 →</Link>
              )}
            </div>
          ) : (
            <ul className={styles.list}>
              {pagedMemos.map((memo, i) => (
                <li
                  key={memo.id}
                  className={styles.card}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* 5단계: Link로 상세 페이지 이동 */}
                  <Link to={`/memos/${memo.id}`} className={styles.cardLink}>
                    <div className={styles.cardTop}>
                      <span
                        className={styles.badge}
                        style={{ background: `${categoryColor[memo.category]}18`, color: categoryColor[memo.category] }}
                      >
                        {memo.category}
                      </span>
                      <span className={styles.date}>{formatDate(memo.updatedAt)}</span>
                    </div>
                    <h2 className={styles.cardTitle}>{memo.title}</h2>
                    <p className={styles.cardPreview}>
                      {memo.content.replace(/\n/g, ' ').slice(0, 100)}
                      {memo.content.length > 100 && '…'}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => handlePage(page - 1)}
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                  onClick={() => handlePage(p)}
                >{p}</button>
              ))}
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => handlePage(page + 1)}
              >›</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
