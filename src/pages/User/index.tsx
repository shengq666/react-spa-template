import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Avatar, Button, List, Toast, Badge } from 'antd-mobile'
import { PageSkeleton } from '@/components/Skeleton'
import { ROUTE_PATH } from '@/constants'
import { format, storage, validate, common } from '@/utils'
import { STORAGE_KEYS } from '@/constants'
import './index.scss'

interface UserInfo {
  id: number
  username: string
  email: string
  avatar: string
  createTime: string
  lastLoginTime: string
  stats: {
    posts: number
    followers: number
    following: number
  }
}

export default function User() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      // 模拟 API 调用
      await common.sleep(1200)

      // 从存储中获取或创建模拟数据
      let user: UserInfo | null = storage.get<UserInfo>(STORAGE_KEYS.USER_INFO)
      if (!user) {
        user = {
          id: 1,
          username: 'Demo User',
          email: 'demo@example.com',
          avatar: 'https://via.placeholder.com/80',
          createTime: new Date(Date.now() - 30 * 86400000).toISOString(),
          lastLoginTime: new Date().toISOString(),
          stats: {
            posts: 42,
            followers: 1280,
            following: 365,
          },
        }
        storage.set(STORAGE_KEYS.USER_INFO, user)
      }
      setUserInfo(user)
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '加载用户信息失败',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  // 验证邮箱
  const handleValidateEmail = () => {
    if (!userInfo) return
    const isValid = validate.email(userInfo.email)
    Toast.show({
      icon: isValid ? 'success' : 'fail',
      content: `邮箱 ${isValid ? '有效' : '无效'}`,
    })
  }

  // 格式化时间
  const handleFormatTime = () => {
    if (!userInfo) return
    const createTime = format.datetime(userInfo.createTime, 'YYYY年MM月DD日 HH:mm')
    Toast.show({
      content: `注册时间: ${createTime}`,
    })
  }

  // 模拟更新数据
  const handleUpdateStats = () => {
    if (!userInfo) return
    const updated = {
      ...userInfo,
      stats: {
        ...userInfo.stats,
        posts: userInfo.stats.posts + 1,
      },
    }
    setUserInfo(updated)
    storage.set(STORAGE_KEYS.USER_INFO, updated)
    Toast.show({
      icon: 'success',
      content: '数据已更新',
    })
  }

  // 返回首页
  const handleGoHome = () => {
    navigate(ROUTE_PATH.HOME)
  }

  if (loading) {
    return <PageSkeleton rows={6} />
  }

  if (!userInfo) {
    return (
      <div className="user-page">
        <Card>
          <div className="empty-state">暂无用户信息</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="user-page">
      <Card className="user-header">
        <div className="user-avatar-section">
          <Badge content={userInfo.stats.posts}>
            <Avatar src={userInfo.avatar} style={{ '--size': '80px' }} />
          </Badge>
        </div>
        <div className="user-info-section">
          <h2 className="user-name">{userInfo.username}</h2>
          <p className="user-email">{userInfo.email}</p>
          <div className="user-time">
            <span>注册: {format.fromNow(userInfo.createTime)}</span>
          </div>
        </div>
      </Card>

      <Card className="user-stats">
        <div className="stats-item">
          <div className="stats-value">{format.number(userInfo.stats.posts)}</div>
          <div className="stats-label">文章</div>
        </div>
        <div className="stats-item">
          <div className="stats-value">{format.number(userInfo.stats.followers)}</div>
          <div className="stats-label">粉丝</div>
        </div>
        <div className="stats-item">
          <div className="stats-value">{format.number(userInfo.stats.following)}</div>
          <div className="stats-label">关注</div>
        </div>
      </Card>

      <div className="user-actions">
        <Button color="primary" block onClick={handleValidateEmail}>
          验证邮箱格式
        </Button>
        <Button color="success" block onClick={handleFormatTime}>
          显示注册时间
        </Button>
        <Button color="warning" block onClick={handleUpdateStats}>
          更新数据（演示防抖）
        </Button>
        <Button color="danger" block onClick={handleGoHome}>
          返回首页
        </Button>
      </div>

      <Card className="user-details">
        <List header="详细信息">
          <List.Item extra={format.datetime(userInfo.createTime)}>注册时间</List.Item>
          <List.Item extra={format.fromNow(userInfo.lastLoginTime)}>最后登录</List.Item>
          <List.Item extra={format.number(userInfo.stats.posts)}>发布文章</List.Item>
          <List.Item extra={format.money(1288.88)}>账户余额</List.Item>
        </List>
      </Card>
    </div>
  )
}
