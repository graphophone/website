"use client"
import { useState } from 'react'
import { Button } from '../ui/button';
import { Trash, UploadSimple } from 'phosphor-react';
import dAudio from 'next/image';
import { Card, CardContent } from '../ui/card';
import { VinylRecordIcon } from '@phosphor-icons/react';
import { humanFileSize } from '@/lib/units';

interface Props {
  selectedAudio: File | null;
  onSelect: (selectedAudio: File | null) => void;
}

function AudioUpload({ selectedAudio, onSelect }: Props) {
  const [isFileHovered, setIsFileHovered] = useState(false);

  return selectedAudio ?
    <div
      className="w-48! h-48! relative"
      onMouseEnter={() => setIsFileHovered(true)}
      onMouseLeave={() => setIsFileHovered(false)}
    >
      {isFileHovered ?
        <Button
          size="icon"
          variant="destructive"
          onClick={() => onSelect(null)}
          className="absolute top-2 left-2 z-10 cursor-pointer bg-foreground/65 hover:bg-foreground/85"
        >
          <Trash weight="fill" />
        </Button> : <></>
      }
      <Card className="w-48! h-48! relative">
        <CardContent className="w-full h-full">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <VinylRecordIcon className="size-8 z-0" />
            <div className="w-full text-center whitespace-nowrap line-clamp-1 text-ellipsis">
              { selectedAudio.name }
            </div>
            <div className="w-full text-center">
              { humanFileSize(selectedAudio.size) }
            </div>
          </div>
        </CardContent>
      </Card>
    </div> :
    <div className="h-48! w-48! relative">
      <input
        onChange={e => onSelect(e.target?.files?.item(0) ?? null)}
        className="w-48! h-48! absolute opacity-0 z-10 cursor-pointer"
        accept="audio/mpeg, audio/wav"
        type="file"
        name={`audio-input`}
        id={`audio-input`}
      />
      <Card className="w-48! h-48! relative">
        <CardContent className="w-full h-full">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <UploadSimple className="size-8 opacity-50 z-0" />
            <div className="w-full text-center opacity-50">
              Press or drag to select the audio
            </div>
            <div className="w-full text-center opacity-50">
              (.mp3 or .wav)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
}

export default AudioUpload