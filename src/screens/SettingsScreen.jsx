const stores = [
  { name: '해율만두전골', size: '300평', floor: '3층' },
  { name: '곤드레밥집', size: '170평', floor: '1층' },
  { name: '정담명가 남원추어탕', size: '180평', floor: '1층' },
]

function SettingsScreen() {
  return (
    <div className="page">
      <h1 className="page-title">설정</h1>
      <p className="page-subtitle">매장 정보와 연동 상태를 확인합니다.</p>

      <h2 className="section-title">매장 정보</h2>
      <ul className="list">
        {stores.map((store) => (
          <li className="list-item" key={store.name}>
            <span>{store.name}</span>
            <span className="list-item-meta">{store.size} · {store.floor}</span>
          </li>
        ))}
      </ul>

      <h2 className="section-title">연동 상태</h2>
      <ul className="list">
        <li className="list-item">
          <span>Supabase</span>
          <span className="badge badge-planned">미연동</span>
        </li>
      </ul>
    </div>
  )
}

export default SettingsScreen
