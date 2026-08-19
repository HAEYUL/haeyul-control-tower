import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import StoreOpsScreen from './screens/StoreOpsScreen'
import MarketingScreen from './screens/MarketingScreen'
import RoadmapScreen from './screens/RoadmapScreen'
import SettingsScreen from './screens/SettingsScreen'
import ReviewReplyScreen from './screens/ReviewReplyScreen'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomeScreen />} />
            <Route path="/store" element={<StoreOpsScreen />} />
            <Route path="/marketing" element={<MarketingScreen />} />
            <Route path="/marketing/review-reply" element={<ReviewReplyScreen />} />
            <Route path="/roadmap" element={<RoadmapScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
