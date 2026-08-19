import { useState } from 'react'
import { Link } from 'react-router-dom'

const STORES = ['해율만두전골', '곤드레밥집', '정담명가 남원추어탕']
const PURPOSES = ['신메뉴·시즌메뉴', '가족모임·부모님모시기', '공간·뷰 소구(SNS)', '보양·원기회복 시즌', '자유주제']

function ContentBriefScreen() {
  const [store, setStore] = useState(STORES[0])
  const [contentType, setContentType] = useState('이미지')
  const [purpose, setPurpose] = useState(PURPOSES[0])
  const [concept, setConcept] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate(e) {
    e.preventDefault()

    setLoading(true)
    setError('')
    setResult('')
    setCopied(false)

    try {
      const res = await fetch('/api/generate-content-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store, contentType, purpose, concept: concept.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '생성에 실패했습니다')
      setResult(data.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result)
    setCopied(true)
  }

  return (
    <div className="page">
      <Link to="/marketing" className="back-link">
        ← 마케팅·SNS
      </Link>
      <h1 className="page-title">포스터·영상 기획</h1>
      <p className="page-subtitle">
        컨셉을 입력하면 이미지 생성 프롬프트나 영상 스토리보드를 만들어드립니다.
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
          <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
            <option value="이미지">이미지 (포스터)</option>
            <option value="영상">영상 (스토리보드)</option>
          </select>
          <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            {PURPOSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <textarea
          className="review-textarea"
          placeholder="구체적인 컨셉이 있다면 적어주세요 (예: 가을 버섯 신메뉴, 추석 가족모임 프로모션). 비워두면 목적에 맞게 자유롭게 구성합니다."
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          rows={4}
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '생성 중...' : '기획안 생성'}
        </button>
      </form>

      {result && (
        <div className="reply-result">
          <div className="reply-result-text">{result}</div>
          <button type="button" onClick={handleCopy}>
            {copied ? '복사됨' : '복사'}
          </button>
        </div>
      )}
    </div>
  )
}

export default ContentBriefScreen
