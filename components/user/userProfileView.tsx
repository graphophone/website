import { UserProfile } from '@/types/user/profile'
import UserProfileBanner from './profileBanner';

interface Params {
  profile: UserProfile;
}

function UserProfileView({ profile }: Params) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <UserProfileBanner profile={profile} />
    </div>
  )
}

export default UserProfileView