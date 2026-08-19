import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { parseExperienceGroupText } from '../lib/parseExperienceGroup'

const STORES = ['해율만두전골', '곤드레밥집', '정담명가 남원추어탕']
const CHANNELS = ['블로그', '블로그+클립', '인스타그램', '유튜브', '릴스', '틱톡', '쇼츠', '클립']

function downloadCsv(rows, filename) {
  const headers = ['이름', '연락처', '채널', 'URL링크']
  const lines = rows.map((r) => [r.name, r.phone, r.channel || '', r.link_url || ''])
  const csv = [headers, ...lines]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n')

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function ExperienceGroupScreen() {
  const [store, setStore] = useState(STORES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [pasteText, setPasteText] = useState('')
  const [preview, setPreview] = useState(null)
  const [importError, setImportError] = useState('')

  const [selected, setSelected] = useState(new Set())

  const [linkEditId, setLinkEditId] = useState(null)
  const [linkDraft, setLinkDraft] = useState('')

  useEffect(() => {
    loadItems(store)
    setSelected(new Set())
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
    setImportError('')

    const usable = preview.filter((row) => row.name && row.phone)
    const skipped = preview.length - usable.length

    if (usable.length === 0) {
      setImportError('이름·연락처가 모두 인식된 행이 없어 등록할 수 없습니다.')
      return
    }

    const rows = usable.map((row) => ({ ...row, store, channel }))
    const { error } = await supabase.from('experience_group').insert(rows)

    if (error) {
      setImportError(`등록 실패: ${error.message}`)
      return
    }

    if (skipped > 0) {
      setImportError(`${skipped}명은 이름 또는 연락처가 인식되지 않아 제외되었습니다.`)
    }

    await loadItems(store)
    setPreview(null)
    setPasteText('')
  }

  function toggleSelected(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleDelete(item) {
    if (!confirm(`${item.name}님을 삭제할까요?`)) return
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(item.id)
      return next
    })
    await supabase.from('experience_group').delete().eq('id', item.id)
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

  function handleDownload() {
    const rows = selected.size > 0 ? items.filter((i) => selected.has(i.id)) : items
    if (rows.length === 0) return
    downloadCsv(rows, `${store}_체험단명단.csv`)
  }

  return (
    <div className="page">
      <Link to="/marketing" className="back-link">
        ← 마케팅·SNS
      </Link>
      <h1 className="page-title">체험단·인플루언서 관리</h1>
      <p className="page-subtitle">명단을 등록하고 엑셀로 내려받을 수 있습니다.</p>

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
        <select value={channel} onChange={(e) => setChannel(e.target.value)}>
          {CHANNELS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <textarea
          className="review-textarea"
          placeholder="리뷰노트 등에서 표를 복사해서 붙여넣으세요 (이름, 연락처 자동 인식)"
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
                    {row.name || '(이름 없음)'} · {row.phone || '(연락처 없음)'}
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
              {store}({channel})에 {preview.length}명 등록
            </button>
          )}
          {importError && (
            <p className="login-error" style={{ marginTop: 8 }}>
              {importError}
            </p>
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
                  {item.name} <span className="list-item-meta">{item.channel}</span>
                </div>
                <div className="list-item-meta">{item.phone}</div>
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

              <button
                type="button"
                className="roadmap-card-delete"
                onClick={() => handleDelete(item)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="section-title">명단 다운로드</h2>
      <p className="page-subtitle">
        {selected.size > 0 ? `선택한 ${selected.size}명` : `${store} 전체 ${items.length}명`}을 CSV로
        내려받아 알리고 등에서 직접 발송하세요.
      </p>
      <button type="button" onClick={handleDownload} disabled={items.length === 0}>
        엑셀(CSV) 다운로드
      </button>
    </div>
  )
}

export default ExperienceGroupScreen
