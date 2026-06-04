import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import Header from './Template/Header'
import Sidebar from './Template/Sidebar'
import BackgroundMain from './Template/BackgroundMain'
import { primaryNavigationItems } from '../services/navigation.js'
import LayoutHeaderActionsContext from './layoutHeaderContext.js'
import { useAuth } from '../auth/AuthContext'

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [pageToolbarActions, setPageToolbarActions] = useState([])
  const { user } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname
  const breadcrumbItems = []
  const userName = user?.name || user?.username || 'AI Image Generator'
  const userRole = user?.job_position || user?.department || 'Creative Workspace'

  return (
    <div className={`dashboard-shell${collapsed ? ' dashboard-shell--sidebar-collapsed' : ''}`}>
      <BackgroundMain />

      <Sidebar
        activePath={currentPath}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        userName={userName}
        userRole={userRole}
        primaryItems={primaryNavigationItems}
        secondaryItems={[]}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((currentValue) => !currentValue)}
      />

      <button
        type="button"
        className={`sidebar-overlay${mobileOpen ? ' active' : ''}`}
        aria-label="Close sidebar"
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />

      <div className="dashboard-stage">
        <Header
          title="Framelens"
          subtitle=""
          breadcrumb={breadcrumbItems}
          toolbarActions={pageToolbarActions}
          showMenuButton
          onMenuToggle={() => setMobileOpen((currentValue) => !currentValue)}
        />

        <LayoutHeaderActionsContext.Provider value={setPageToolbarActions}>
          <main className="dashboard-main">
            {children}

          </main>
        </LayoutHeaderActionsContext.Provider>
      </div>
    </div>
  )
}
