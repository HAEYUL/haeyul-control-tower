import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const STATUSES = ['아이디어', '진행중', '완료']

function RoadmapScreen() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('매장운영')

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)
    const { data } = await supabase
      .from('roadmap_items')
      .select('*')
      .order('created_at', { ascending: true })
    setItems(data ?? [])
    setLoading(false)
  }

  async function handleStatusChange(id, status) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
    await supabase.from('roadmap_items').update({ status }).eq('id', id)
  }

  async function handleDelete(id) {
    if (!confirm('이 항목을 삭제할까요?')) return
    setItems((prev) => prev.filter((item) => item.id !== id))
    await supabase.from('roadmap_items').delete().eq('id', id)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim()) return

    const { data } = await supabase
      .from('roadmap_items')
      .insert({ title: title.trim(), description: description.trim(), category, status: '아이디어' })
      .select()
      .single()

    if (data) setItems((prev) => [...prev, data])
    setTitle('')
    setDescription('')
    setCategory('매장운영')
    setShowForm(false)
  }

  return (
    <div className="page">
      <h1 className="page-title">프로젝트 로드맵</h1>
      <p className="page-subtitle">자동화 아이디어를 상태별로 관리합니다.</p>

      {showForm ? (
        <form className="add-form" onSubmit={handleAdd}>
          <input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="한 줄 설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="매장운영">매장운영</option>
            <option value="마케팅SNS">마케팅SNS</option>
          </select>
          <div className="add-form-actions">
            <button type="submit">추가</button>
            <button type="button" onClick={() => setShowForm(false)}>
              취소
            </button>
          </div>
        </form>
      ) : (
        <button className="add-button" onClick={() => setShowForm(true)}>
          + 아이디어 추가
        </button>
      )}

      {loading ? (
        <p className="kanban-empty">불러오는 중...</p>
      ) : (
        <div className="kanban">
          {STATUSES.map((status) => {
            const statusItems = items.filter((item) => item.status === status)
            return (
              <div className="kanban-column" key={status}>
                <h2 className="kanban-column-title">
                  {status} ({statusItems.length})
                </h2>
                {statusItems.length === 0 && <p className="kanban-empty">항목 없음</p>}
                {statusItems.map((item) => (
                  <div className="roadmap-card" key={item.id}>
                    <div className="roadmap-card-title">{item.title}</div>
                    {item.description && (
                      <div className="roadmap-card-desc">{item.description}</div>
                    )}
                    <div className="roadmap-card-actions">
                      <select
                        className="roadmap-card-status"
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="roadmap-card-delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RoadmapScreen
