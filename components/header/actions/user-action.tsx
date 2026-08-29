import Image from 'next/image';
import Link from 'next/link';

function UserAction() {
    const avatarUrl = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmiro.medium.com%2Fv2%2Fresize%3Afit%3A1358%2Fformat%3Awebp%2F1*0HOkgxvxDmp0aIESmImD0g.jpeg&f=1&nofb=1&ipt=ef6ef040a77e83e03a4020e9b4575a52bf3ce82744fb57de784d8322bb29b999";

    return (
        <Link href={`/me`}>
            <div className="hover:brightness-85 transition-all rounded-[6px] overflow-clip">
                { avatarUrl ?
                    <Image src={avatarUrl} alt="user avatar" width={32} height={32} /> :
                    <Image src="/images/empty_avatar.jpg" alt="empty avatar" width={32} height={32} />
                }
            </div>
        </Link>
    )
}

export default UserAction