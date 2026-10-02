"use client"

import { FocusEvent, useEffect, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Spinner } from "./ui/spinner";

interface Params extends React.ComponentProps<"input"> {
  request: (searchToken: string) => Promise<void>;
  isLoading: boolean,
  timeout?: number,
}

function DebouncedSearch({ request, isLoading, timeout, onFocus, ...props }: Params) {
  const [_, setDebounceTimeout] =
    useState<ReturnType<typeof setTimeout> | null>(null);
  const [searchToken, setSearchToken] = useState('');

  useEffect(() => {
    setDebounceTimeout(prev => {
      if (prev !== null) {
        clearTimeout(prev);
      }
      return setTimeout(() => request(searchToken), timeout ?? 500);
    })
  }, [searchToken]);

  return (
    <InputGroup>
      <InputGroupInput
        onChange={(e) => setSearchToken(e.target.value)}
        onFocus={(e: FocusEvent<HTMLInputElement, Element>) => {
          request(searchToken);
          if (onFocus) {
            onFocus(e);
          }
        }}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        { isLoading ? <Spinner className="h-full aspect-square" /> : <></> }
      </InputGroupAddon>
    </InputGroup>
  )
}

export default DebouncedSearch