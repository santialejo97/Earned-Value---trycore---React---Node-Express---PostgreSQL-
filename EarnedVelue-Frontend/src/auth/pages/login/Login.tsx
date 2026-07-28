
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/auth/store/auth.store"
import { toast } from "sonner"

export const Login = () => {

    const navigate = useNavigate()
    const [isPosting, setIsPosting] = useState(false)
    const { login } = useAuthStore()


    const handleLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        setIsPosting(true)

        const formData = new FormData(event.target as HTMLFormElement)

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const isValid = await login(email, password)

        if (isValid) {
            navigate('/')
            return
        }

        toast.error('Correo o/y contraseña no validos')
        setIsPosting(false)
    }



    return (
        <div className={'flex flex-col gap-6'}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Ingresa correo electronico y contraseña para inicias sesion en tu cuenta.
                    </CardDescription>
                    <CardAction>
                        <Button variant="link">
                            <Link to={'/auth/register'} className="underline underline-offset-4">Sign Up</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>

                                </div>
                                <Input id="password" type="password" name="password" required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isPosting}>
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>

            </Card>
        </div>
    )
}




