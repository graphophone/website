import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import ChangePasswordForm from "./changePasswordForm"
import DeleteAccountSection from "./deleteAccountSection"

function SecuritySettings() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>
      <ChangePasswordForm />
      <DeleteAccountSection />
    </Card>
  )
}

export default SecuritySettings
