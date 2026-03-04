import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";

// 8단계: 공통 Layout 컴포넌트 — Outlet으로 자식 페이지 렌더링
export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            className={styles.logo}
            onClick={() => navigate("/")}
            aria-label="홈으로"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            메모장
          </button>

          {/* 5단계: NavLink - 현재 경로 활성 스타일 */}
          <nav className={styles.nav}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
              }
            >
              목록
            </NavLink>
            <NavLink
              to="/memos/new"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
              }
            >
              + 새 메모
            </NavLink>
          </nav>
        </div>
      </header>

      {/* 8단계: Outlet — 자식 페이지 렌더링 위치 */}
      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>© 2026 메모장 · React Router v6 과제</p>
      </footer>
    </div>
  );
}
