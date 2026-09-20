"use client";

import ProtectedRoute from '@/components/protectedRouter'
import SettingsSidebar from '@/components/settings/settingsSidebar'
import { SidebarEntry } from '@/types/settings/sidebarEntry'
import { User } from 'phosphor-react'
import React from 'react'

const sidebarEntries: SidebarEntry[] = [
  {
    label: "Profile",
    path: "profile",
    icon: <User weight="fill" />,
  },
]

function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="w-full grid grid-cols-12 gap-4.5 min-h-full">
        <div className="col-span-3">
          <SettingsSidebar entries={sidebarEntries} />
        </div>
        <div className="col-span-9 min-h-full">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default SettingsLayout