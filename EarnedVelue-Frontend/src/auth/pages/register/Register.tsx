import { useAuthStore } from "@/auth/store/auth.store"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"


export const Register = () => {


    const { register } = useAuthStore()
    const [, setIsPosting] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        setIsPosting(true);

        const formData = new FormData(event.target as HTMLFormElement)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const username = formData.get('fullName') as string

        const isValid = await register(email, password, username)

        if (isValid) {
            navigate('/')
            return
        }

        toast.error('Informacion no completada')
        setIsPosting(false)


    }


    return (
        <div className={'flex flex-col gap-6'}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                        Completa la informaciòn para la creacion de tu cuenta.
                    </CardDescription>
                    <CardAction>
                        <Button variant="link">
                            <Link to={'/auth/login'} className="underline underline-offset-4">Login</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister}>
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
                                <Input id="password" type="password" required name="password" />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Full name</Label>
                                </div>
                                <Input id="fullName" type="fullName" required name="fullName" placeholder="Jhon D." />
                            </div>
                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                        </div>
                    </form>
                </CardContent>

            </Card>
        </div>
    )
}

