const items = [
  { title: '매입·정산', status: '연결됨', url: 'https://haeyul-cost-calculator.vercel.app/' },
  { title: '원가·레시피', status: '연결됨', url: 'https://haeyul-cost-calculator.vercel.app/' },
  { title: '해율통합여권', status: '연결됨', url: 'https://haeyul-passport.vercel.app/admin' },
  { title: '발주·재고', status: '예정' },
  { title: '인력·근태', status: '예정' },
  { title: '위생·품질', status: '예정' },
  { title: '매출 리포트', status: '예정' },
]

function StoreOpsScreen() {
  return (
    <div className="page">
      <h1 className="page-title">매장 운영</h1>
      <p className="page-subtitle">발주부터 매출 리포트까지 매장 운영 전반을 관리합니다.</p>

      <ul className="list">
        {items.map((item) => {
          const badge = (
            <span className={`badge badge-${item.status === '연결됨' ? 'linked' : 'planned'}`}>
              {item.status}
            </span>
          )

          if (item.url) {
            return (
              <li className="list-item" key={item.title}>
                <a className="list-item-link" href={item.url} target="_blank" rel="noopener noreferrer">
                  <span>{item.title}</span>
                </a>
                {badge}
              </li>
            )
          }

          return (
            <li className="list-item" key={item.title}>
              <span>{item.title}</span>
              {badge}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default StoreOpsScreen
