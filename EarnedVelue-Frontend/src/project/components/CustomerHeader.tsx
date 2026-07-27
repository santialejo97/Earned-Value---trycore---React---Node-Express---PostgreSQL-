import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { Link } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';


export const CustomerHeader = () => {
    const { authStatus, user, logout } = useAuthStore()
    return (
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between">

                {
                    user?.name && (
                        <span className="font-montserrat m-0 whitespace-nowrap">
                            Bienvenido {user.name}
                        </span>
                    )
                }

                {
                    authStatus === 'not-authenticated' ? (<Link to={'/auth/login'}>
                        <Button variant='default' size='sm' className="ml-2" >
                            Login
                        </Button>
                    </Link>) : (
                        <Link to={'/auth/login'}>
                            <Button
                                variant='outline'
                                size='sm'
                                className="ml-2"
                                onClick={logout} >
                                Cerrar sesion
                            </Button>
                        </Link>
                    )
                }
            </div>
        </header>
    )
}
