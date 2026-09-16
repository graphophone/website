import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

function SignUp() {
  return (
        <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                className="placeholder:text-foreground/50"
                id="username"
                type="text"
                placeholder="my_username"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className="placeholder:text-foreground/50"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First name (optional)</Label>
                <Input
                  className="placeholder:text-foreground/50"
                  placeholder="Alina"
                  id="first_name"
                  type="first_name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="last_name">Last name (optional)</Label>
                <Input
                  className="placeholder:text-foreground/50"
                  placeholder="Smith"
                  id="last_name"
                  type="last_name"
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full cursor-pointer">
          Sign up
        </Button>
        <Link href="/auth/login" className="w-full" >
          <Button className="w-full cursor-pointer" variant="outline">
            Login
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default SignUp