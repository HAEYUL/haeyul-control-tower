import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomeScreen from './screens/HomeScreen'
import StoreOpsScreen from './screens/StoreOpsScreen'
import MarketingScreen from './screens/MarketingScreen'
import RoadmapScreen from './screens/RoadmapScreen'
import SettingsScreen from './screens/SettingsScreen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/store" element={<StoreOpsScreen />} />
          <Route path="/marketing" element={<MarketingScreen />} />
          <Route path="/roadmap" element={<RoadmapScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
