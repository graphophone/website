import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import ChangePasswordForm from "./changePasswordForm"
import DeleteAccountSection from "./deleteAccountSection"

function SecuritySettings() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <ChangePasswordForm />
        <DeleteAccountSection />
      </div>
    </Card>
  )
}

export default SecuritySettings
