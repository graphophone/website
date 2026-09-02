import Link from "next/link"
import HeaderLinks from "./header-links"
import HeaderActions from "./actions/header-actions"

function Header() {
    return (
        <div className="w-full flex flex-row items-center h-14 shadow-sm bg-[#FFF3E0] md:px-[10vw] px-2 justify-between">
            <Link href="/" className="cursor-pointer">
                <b className="hover:opacity-50 select-none transition-all">Graphophone</b>
            </Link>

            <HeaderLinks />

            <HeaderActions />
        </div>
    )
}

export default Header