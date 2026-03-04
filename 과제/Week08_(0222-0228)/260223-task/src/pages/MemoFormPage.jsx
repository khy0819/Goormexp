import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMemo, createMemo, updateMemo, CATEGORIES } from "../api/memos";
import styles from "./MemoFormPage.module.css";

export default function MemoFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: CATEGORIES[0],
  });
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditMode) return;
    async function loadMemo() {
      setLoading(true);
      try {
        const data = await getMemo(id);
        setForm({
          title: data.title,
          content: data.content,
          category: data.category,
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadMemo();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!form.content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      if (isEditMode) {
        await updateMemo(id, form);
        navigate(`/memos/${id}`, { state: { refresh: Date.now() } });
      } else {
        await createMemo(form);
        // ✅ state.refresh로 MemoListPage에 리패치 신호 전달
        navigate("/", { state: { refresh: Date.now() } });
      }
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  const categoryColor = {
    학습: "#3b82f6",
    개인: "#8b5cf6",
    아이디어: "#f59e0b",
  };

  if (loading) return <div className={styles.status}>불러오는 중...</div>;

  return (
    <div className={`${styles.container} page-enter`}>
      <Link to={isEditMode ? `/memos/${id}` : "/"} className={styles.backLink}>
        ← {isEditMode ? "상세로" : "목록으로"}
      </Link>

      <div className={styles.card}>
        <h1 className={styles.heading}>
          {isEditMode ? "✏️ 메모 수정" : "📝 새 메모 작성"}
        </h1>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>카테고리</label>
            <div className={styles.categoryGroup}>
              {CATEGORIES.map((cat) => (
                <label key={cat} className={styles.categoryLabel}>
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={form.category === cat}
                    onChange={handleChange}
                    className={styles.radioHidden}
                  />
                  <span
                    className={`${styles.categoryChip} ${form.category === cat ? styles.categoryChipActive : ""}`}
                    style={
                      form.category === cat
                        ? {
                            background: `${categoryColor[cat]}18`,
                            color: categoryColor[cat],
                            borderColor: categoryColor[cat],
                          }
                        : {}
                    }
                  >
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              제목
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="메모 제목을 입력하세요"
              className={styles.input}
              maxLength={100}
            />
            <span className={styles.charCount}>{form.title.length}/100</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="content">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="메모 내용을 입력하세요"
              className={styles.textarea}
              rows={10}
            />
          </div>

          <div className={styles.btnGroup}>
            <Link
              to={isEditMode ? `/memos/${id}` : "/"}
              className={styles.cancelBtn}
            >
              취소
            </Link>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
            >
              {submitting
                ? isEditMode
                  ? "수정 중..."
                  : "저장 중..."
                : isEditMode
                  ? "수정 완료"
                  : "메모 저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
