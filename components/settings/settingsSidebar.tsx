import React from 'react'
import Link from 'next/link';
import { SidebarEntry } from '@/types/settings/sidebarEntry';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface Params {
  entries: SidebarEntry[];
}

function SettingsSidebar({ entries }: Params) {
  return (
    <Card className="w-full flex flex-col gap-2 p-2">
      {entries.map(entry => (
        <Link key={entry.label} href={`/settings/${entry.path}`}>
          <Button className="w-full cursor-pointer justify-start px-4" variant="ghost">
            {entry.icon}
            {entry.label}
          </Button>
        </Link>
      ))}
    </Card>
  )
}

export default SettingsSidebar