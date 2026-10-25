import MusicData from '@/components/music/musicData';
import React from 'react'

async function MusicPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;

  return (
    <MusicData musicId={id} />
  )
}

export default MusicPage