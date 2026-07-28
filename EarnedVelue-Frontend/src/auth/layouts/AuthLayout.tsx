import { Outlet } from "react-router"


const AuthLayout = () => {
    return (

        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <img src={'/logo.png'} alt="logo" className={"max-w-30 max-h-30 mx-4"} />
            <div className="w-full max-w-sm">
                <Outlet />
            </div>
        </div>

    )
}

export default AuthLayout



