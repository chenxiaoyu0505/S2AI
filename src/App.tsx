import { Navigate, Route, Routes } from 'react-router'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* GitHub Pages 无服务端路由，未知路径一律回首页 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
