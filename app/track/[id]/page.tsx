import TrackData from '@/components/track/trackData';
import React from 'react'

async function TrackPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;

  return (
    <TrackData trackId={id} />
  )
}

export default TrackPage