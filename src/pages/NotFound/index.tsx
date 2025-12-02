import { Result, Button } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATH } from '@/constants'
import './index.scss'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found-page">
      <Result
        status="warning"
        title="页面走丢了"
        description="您访问的页面不存在或已被移动"
      />
      <div className="not-found-actions">
        <Button color="primary" fill="solid" onClick={() => navigate(ROUTE_PATH.HOME)}>
          返回首页
        </Button>
      </div>
    </div>
  )
}


