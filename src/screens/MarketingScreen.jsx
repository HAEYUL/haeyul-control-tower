import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const BADGE_CLASS = {
  완료: 'badge-linked',
  진행중: 'badge-progress',
  아이디어: 'badge-planned',
}

const STATUS_ORDER = { 완료: 0, 진행중: 1, 아이디어: 2 }

const TOOL_LINKS = [
  { keyword: '답글', to: '/marketing/review-reply' },
  { keyword: '콘텐츠', to: '/marketing/content-brief' },
  { keyword: 'AI 보정', to: '/marketing/content-brief' },
  { keyword: '체험단', to: '/marketing/experience-group' },
  { keyword: '인플루언서', to: '/marketing/experience-group' },
]

function findToolLink(title) {
  return TOOL_LINKS.find((link) => title.includes(link.keyword))?.to
}

function MarketingScreen() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('roadmap_items')
      .select('*')
      .eq('category', '마케팅SNS')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        const sorted = [...(data ?? [])].sort(
          (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
        )
        setItems(sorted)
        setLoading(false)
      })
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">마케팅·SNS</h1>
      <p className="page-subtitle">콘텐츠 제작부터 리뷰 관리까지 마케팅 자동화 아이디어 목록입니다.</p>

      {loading ? (
        <p className="kanban-empty">불러오는 중...</p>
      ) : (
        <ul className="list">
          {items.map((item) => {
            const badge = (
              <span className={`badge ${BADGE_CLASS[item.status]}`}>{item.status}</span>
            )
            const linkTo = findToolLink(item.title)

            return (
              <li className="list-item" key={item.id}>
                {linkTo ? (
                  <Link className="list-item-link" to={linkTo}>
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <span>{item.title}</span>
                )}
                {badge}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default MarketingScreen
