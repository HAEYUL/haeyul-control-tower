import { useState } from 'react'
import { Link } from 'react-router-dom'

const STORES = ['해율만두전골', '곤드레밥집', '정담명가 남원추어탕']

function ReviewReplyScreen() {
  const [store, setStore] = useState(STORES[0])
  const [channel, setChannel] = useState('네이버')
  const [type, setType] = useState('영수증리뷰')
  const [rating, setRating] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate(e) {
    e.preventDefault()
    if (!reviewText.trim()) return

    setLoading(true)
    setError('')
    setReply('')
    setCopied(false)

    try {
      const res = await fetch('/api/generate-review-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store,
          channel,
          type,
          rating: rating || null,
          reviewText: reviewText.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '답글 생성에 실패했습니다')
      setReply(data.reply)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(reply)
    setCopied(true)
  }

  return (
    <div className="page">
      <Link to="/marketing" className="back-link">
        ← 마케팅·SNS
      </Link>
      <h1 className="page-title">리뷰 답글쓰기</h1>
      <p className="page-subtitle">
        네이버·구글 영수증리뷰나 블로그 글 원문을 붙여넣으면 답글 초안을 만들어드립니다.
      </p>

      <form className="review-form" onSubmit={handleGenerate}>
        <select value={store} onChange={(e) => setStore(e.target.value)}>
          {STORES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="review-form-row">
          <select value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option value="네이버">네이버</option>
            <option value="구글">구글</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="영수증리뷰">영수증리뷰</option>
            <option value="블로그">블로그</option>
          </select>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">별점 (선택)</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}점
              </option>
            ))}
          </select>
        </div>

        <textarea
          className="review-textarea"
          placeholder="리뷰나 블로그 글 원문을 붙여넣으세요"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={6}
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '생성 중...' : '답글 초안 생성'}
        </button>
      </form>

      {reply && (
        <div className="reply-result">
          <div className="reply-result-text">{reply}</div>
          <button type="button" onClick={handleCopy}>
            {copied ? '복사됨' : '복사'}
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewReplyScreen
