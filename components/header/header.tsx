import Link from "next/link"
import HeaderActions from "./actions/header-actions"

function Header() {
    return (
        <div className="w-full hidden md:flex flex-row items-center
            h-14 shadow-sm bg-muted-foreground px-[10vw]
            justify-between">
            <Link href="/" className="cursor-pointer">
                <b className="hover:opacity-50 select-none transition-all">Graphophone</b>
            </Link>

            <HeaderActions />
        </div>
    )
}

export default Header
