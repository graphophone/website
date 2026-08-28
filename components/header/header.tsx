import Link from "next/link"
import HeaderActions from "./actions"

function Header() {
    return (
        <div className="w-full flex flex-row items-center h-14 shadow-sm bg-[#FFF3E0] md:px-[10vw] px-2 justify-between">
            <Link href="/" className="cursor-pointer">
                <b className="select-none transition-all">Graphophone</b>
            </Link>

            <HeaderActions />
        </div>
    )
}

export default Header