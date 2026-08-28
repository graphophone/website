import HeaderActions from "./actions"

function Header() {
    return (
        <div className="w-full flex flex-row items-center h-14 shadow-sm bg-[#FFF3E0] md:px-[10vw] px-2 justify-between">
            <span><b>Graphophone</b></span>

            <HeaderActions />
        </div>
    )
}

export default Header