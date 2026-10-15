import { Card } from '@/components/ui/card';
import { isRequestError } from '@/lib/error';
import { Profile } from '@/types/user/profile';
import { notFound } from 'next/navigation';
import React from 'react'

interface Props {
  params: Promise<{ userId: number }>,
}

async function UserProfileAboutPage(props: Props) {
  const { userId } = await props.params;
  const res = await fetch(`${process.env.API_URL}/user/${userId}`);
  if (isRequestError(res)) {
    notFound();
  }
  const profile: Profile = await res.json();
  
  const sections = [
    { title: 'Full name', value: `${profile.firstName} ${profile.lastName}`.trim() },
    { title: 'Location',
      value: `${profile.country ? (profile.country + ',') : ''} ${profile.city}`.trim() },
    { title: 'Bio', value: profile.bio },
    { title: 'Created at', value: '11/09/2001' },
  ]

  return (
    <Card className="w-full flex flex-col gap-4.5 px-16">
      {sections.map((section, i) => (
        <UserProfileAboutSection
          key={i}
          title={section.title}
          value={section.value}
        />
      ))}
    </Card>
  )
}

function UserProfileAboutSection({ title, value }: { title: string, value: string | null }) {
  if (!value) {
    return <></>;
  }
  return (
    <div className="w-full flex flex-col gap-1">
      <span className="text-lg font-bold">{title}</span>
      <span className="text-sm">{value}</span>
      <div className="border-b-foreground/25 border-b max-w-32" />
    </div>
  );
}

export default UserProfileAboutPage