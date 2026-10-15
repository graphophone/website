"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const profileSections = [
  { label: 'All', href: '' },
  { label: 'Tracks', href: 'tracks' },
  { label: 'Comments', href: 'comments' },
];

function UserProfileSections({ userId }: { userId: number }) {
  const pathname = usePathname();
  const currentSection = pathname
    .slice(`/user/${userId}/`.length)
    .split('/').at(0)!;

  console.log({ currentSection });

  return (
    <div className="w-full flex items-center px-16 border-t">
      {profileSections.map((section, i) => (
        <Link
          href={`/user/${userId}/${section.href}`}
          className={`py-2 px-4 ${currentSection === section.href ?
            'border-primary border-b-2' : 'hover:border-primary/25 hover:border-b-2'}`}
          key={i}
        >
          {section.label}
        </Link>
      ))}
    </div>
  )
}

export default UserProfileSections