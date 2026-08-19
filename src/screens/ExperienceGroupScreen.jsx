import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { parseExperienceGroupText } from '../lib/parseExperienceGroup'

const STORES = ['해율만두전골', '곤드레밥집', '정담명가 남원추어탕']

function ExperienceGroupScreen() {
  const [store, setStore] = useState(STORES[0])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [pasteText, setPasteText] = useState('')
  const [preview, setPreview] = useState(null)

  const [selected, setSelected] = useState(new Set())
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState('')

  const [linkEditId, setLinkEditId] = useState(null)
  const [linkDraft, setLinkDraft] = useState('')

  useEffect(() => {
    loadItems(store)
    setSelected(new Set())
    setSendResult('')
  }, [store])

  async function loadItems(forStore) {
    setLoading(true)
    const { data } = await supabase
      .from('experience_group')
      .select('*')
      .eq('store', forStore)
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  function handlePreview() {
    const rows = parseExperienceGroupText(pasteText)
    setPreview(rows)
  }

  function removePreviewRow(index) {
    setPreview((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleImport() {
    if (!preview?.length) return
    const rows = preview.map((row) => ({ ...row, store, visited: true }))
    const { data } = await supabase.from('experience_group').insert(rows).select()
    setItems((prev) => [...(data ?? []), ...prev])
    setPreview(null)
    setPasteText('')
  }

  async function toggleVisited(item) {
    const nextVisited = !item.visited
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, visited: nextVisited } : i)),
    )
    await supabase.from('experience_group').update({ visited: nextVisited }).eq('id', item.id)
  }

  function toggleSelected(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openLinkEdit(item) {
    setLinkEditId(item.id)
    setLinkDraft(item.link_url || '')
  }

  async function saveLink(item) {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, link_url: linkDraft.trim() } : i)),
    )
    await supabase.from('experience_group').update({ link_url: linkDraft.trim() }).eq('id', item.id)
    setLinkEditId(null)
  }

  async function handleSend() {
    const recipients = items.filter((i) => selected.has(i.id))
    if (recipients.length === 0 || !message.trim()) return
    if (!confirm(`${recipients.length}명에게 문자를 발송할까요?`)) return

    setSending(true)
    setSendResult('')

    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receivers: recipients.map((r) => r.phone),
          message: message.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '발송에 실패했습니다')
      setSendResult(`발송 완료 (성공 ${data.success_cnt}건 / 실패 ${data.error_cnt}건)`)
      setSelected(new Set())
      setMessage('')
    } catch (err) {
      setSendResult(`오류: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page">
      <Link to="/marketing" className="back-link">
        ← 마케팅·SNS
      </Link>
      <h1 className="page-title">체험단·인플루언서 관리</h1>
      <p className="page-subtitle">명단을 등록하고, 방문 여부를 관리하고, 문자를 보낼 수 있습니다.</p>

      <div className="store-tabs">
        {STORES.map((s) => (
          <button
            key={s}
            type="button"
            className={`store-tab${s === store ? ' active' : ''}`}
            onClick={() => setStore(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <h2 className="section-title">명단 붙여넣기</h2>
      <div className="review-form">
        <textarea
          className="review-textarea"
          placeholder="리뷰노트 등에서 표를 복사해서 붙여넣으세요 (이름, 연락처, 등급, 주소, 리뷰등록일 자동 인식)"
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          rows={5}
        />
        <button type="button" onClick={handlePreview} disabled={!pasteText.trim()}>
          미리보기
        </button>
      </div>

      {preview && (
        <div className="reply-result">
          {preview.length === 0 ? (
            <p className="kanban-empty">인식된 항목이 없습니다.</p>
          ) : (
            <ul className="list">
              {preview.map((row, i) => (
                <li className="list-item" key={i}>
                  <span className="list-item-meta">
                    {row.name || '(이름 없음)'} · {row.phone || '(연락처 없음)'} · {row.grade || '-'} ·{' '}
                    {row.address || '-'} · {row.review_date || '-'}
                  </span>
                  <button type="button" className="roadmap-card-delete" onClick={() => removePreviewRow(i)}>
                    제외
                  </button>
                </li>
              ))}
            </ul>
          )}
          {preview.length > 0 && (
            <button type="button" onClick={handleImport} style={{ marginTop: 10 }}>
              {store}에 {preview.length}명 등록
            </button>
          )}
        </div>
      )}

      <h2 className="section-title">
        {store} 명단 {!loading && `(${items.length}명)`}
      </h2>

      {loading ? (
        <p className="kanban-empty">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="kanban-empty">등록된 명단이 없습니다.</p>
      ) : (
        <ul className="list">
          {items.map((item) => (
            <li className="list-item experience-row" key={item.id}>
              <label className="experience-checkbox">
                <input
                  type="checkbox"
                  checked={selected.has(item.id)}
                  onChange={() => toggleSelected(item.id)}
                />
              </label>

              <div className="experience-info">
                <div className="experience-name">
                  {item.name} <span className="list-item-meta">{item.grade}</span>
                </div>
                <div className="list-item-meta">
                  {item.phone} · {item.address || '-'} · {item.review_date || '-'}
                </div>
                {linkEditId === item.id ? (
                  <div className="experience-link-edit">
                    <input
                      type="text"
                      value={linkDraft}
                      onChange={(e) => setLinkDraft(e.target.value)}
                      placeholder="https://..."
                    />
                    <button type="button" onClick={() => saveLink(item)}>
                      저장
                    </button>
                  </div>
                ) : item.link_url ? (
                  <a
                    className="list-item-meta"
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.link_url}
                  </a>
                ) : (
                  <button type="button" className="roadmap-card-delete" onClick={() => openLinkEdit(item)}>
                    링크 추가
                  </button>
                )}
              </div>

              <label className="experience-visited">
                <input type="checkbox" checked={item.visited} onChange={() => toggleVisited(item)} />
                방문
              </label>
            </li>
          ))}
        </ul>
      )}

      <h2 className="section-title">문자 발송 ({selected.size}명 선택됨)</h2>
      <div className="review-form">
        <textarea
          className="review-textarea"
          placeholder="보낼 메시지를 직접 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
        {sendResult && <p className="login-error">{sendResult}</p>}
        <button type="button" onClick={handleSend} disabled={sending || selected.size === 0 || !message.trim()}>
          {sending ? '발송 중...' : `${selected.size}명에게 문자 발송`}
        </button>
      </div>
    </div>
  )
}

export default ExperienceGroupScreen
