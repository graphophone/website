'use client';

import { MagnifyingGlass } from "phosphor-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

function HeaderSearch() {
    return (
        <InputGroup className="w-72 bg-background">
            <InputGroupAddon>
                <MagnifyingGlass size={16} color="var(--foreground)" />
            </InputGroupAddon>
            <InputGroupInput
                type="search"
                placeholder="Search music and users"
                aria-label="Search"
                className="placeholder:text-foreground/50"
            />
        </InputGroup>
    )
}

export default HeaderSearch
