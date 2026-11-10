"use client"
import { Button } from '../ui/button';
import { Trash, UploadSimple } from 'phosphor-react';
import { Card, CardContent } from '../ui/card';
import { VinylRecordIcon } from '@phosphor-icons/react';
import { humanFileSize } from '@/lib/units';

interface Props {
  selectedAudio: File | null;
  onSelect: (selectedAudio: File | null) => void;
}

function AudioUpload({ selectedAudio, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {selectedAudio ?
        <div className="group size-36 md:size-48 relative">
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={() => onSelect(null)}
            aria-label="Remove audio"
            className="absolute top-2 left-2 z-10 hidden md:group-hover:inline-flex cursor-pointer bg-foreground/65 hover:bg-foreground/85"
          >
            <Trash weight="fill" />
          </Button>
          <Card className="size-full relative">
            <CardContent className="w-full h-full px-2 md:px-4">
              <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-xs md:text-sm">
                <VinylRecordIcon className="size-6 md:size-8 z-0" />
                <div className="w-full text-center truncate">
                  { selectedAudio.name }
                </div>
                <div className="w-full text-center">
                  { humanFileSize(selectedAudio.size) }
                </div>
              </div>
            </CardContent>
          </Card>
        </div> :
        <div className="size-36 md:size-48 relative">
          <input
            onChange={e => onSelect(e.target?.files?.item(0) ?? null)}
            className="size-full absolute opacity-0 z-10 cursor-pointer"
            accept="audio/mpeg, audio/wav"
            type="file"
            name={`audio-input`}
            id={`audio-input`}
          />
          <Card className="size-full relative">
            <CardContent className="w-full h-full px-2 md:px-4">
              <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-xs md:text-sm opacity-50">
                <UploadSimple className="size-6 md:size-8 z-0" />
                <div className="md:hidden w-full text-center">
                  Press to select the audio
                </div>
                <div className="hidden md:block w-full text-center">
                  Press or drag to select the audio
                </div>
                <div className="w-full text-center">
                  (.mp3 or .wav)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
      {selectedAudio && (
        <Button
          type="button"
          variant="outline"
          onClick={() => onSelect(null)}
          className="md:hidden w-fit cursor-pointer text-destructive"
        >
          <Trash weight="fill" />
          Remove audio
        </Button>
      )}
    </div>
  );
}

export default AudioUpload