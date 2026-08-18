const columns = [
  { status: '아이디어', items: [] },
  { status: '진행중', items: [] },
  { status: '완료', items: [] },
]

function RoadmapScreen() {
  return (
    <div className="page">
      <h1 className="page-title">프로젝트 로드맵</h1>
      <p className="page-subtitle">자동화 아이디어를 상태별로 관리합니다.</p>

      <div className="kanban">
        {columns.map((col) => (
          <div className="kanban-column" key={col.status}>
            <h2 className="kanban-column-title">{col.status}</h2>
            {col.items.length === 0 && <p className="kanban-empty">항목 없음</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoadmapScreen
