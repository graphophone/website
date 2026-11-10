import ProtectedRoute from '@/components/protectedRouter'
import React from 'react'

function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="w-full min-h-full">
        {children}
      </div>
    </ProtectedRoute>
  )
}

export default SettingsLayout
