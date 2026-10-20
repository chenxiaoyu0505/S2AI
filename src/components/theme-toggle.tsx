import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

// 订阅函数恒空：本组件不订阅外部 store，只用 useSyncExternalStore 做「是否已挂载」探测，
// 避免首帧（未挂载、主题未知）与本地不一致的图标闪烁，且不受 set-state-in-effect 约束
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

// 深浅色切换：默认跟随系统，点击后记住选择（next-themes 写 localStorage）
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const isDark = theme === 'dark'
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 md:h-8 md:w-8 flex-none"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={mounted ? (isDark ? '切换到浅色' : '切换到深色') : '切换深浅色主题'}
      aria-label="切换深浅色主题"
    >
      {mounted ? (
        isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
      ) : (
        <span className="h-4 w-4" />
      )}
    </Button>
  )
}
