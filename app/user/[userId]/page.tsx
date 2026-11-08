async function UserProfilePage({ params }: { params: Promise<{ userId: number }> }) {
  await params;
  return <div className="w-full">All info</div>;
}

export default UserProfilePage