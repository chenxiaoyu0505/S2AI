import { Navigate, Route, Routes } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import Home from './pages/Home'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* GitHub Pages 无服务端路由，未知路径一律回首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* 毕业/退回等「复制 Agent 指令」动作的反馈 */}
      <Toaster position="top-center" richColors />
    </>
  )
}
