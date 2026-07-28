import { Spinner } from "@/components/ui/spinner"
import { ActivityGrid } from "@/project/components/ActivityGrid"
import { useActivityList } from "@/project/hooks/useActivity"
import { useSearchParams } from "react-router"


export const ActivitiesPage = () => {

    const [searchParams] = useSearchParams()
    const id_project = searchParams.get('id_project')


    const { data: activities, isLoading, isError } = useActivityList(id_project || '')

    if (isLoading) return <Spinner />

    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Actividades</h1>
            <p className="mt-2 text-muted-foreground">
                Revisa y gestiona las actividades de tus proyectos.
            </p>
            {isError ? (<div className="text-center text-sm text-muted-foreground mt-5">No existen actividades aún, crea uno nuevo</div>) :
                (
                    <ActivityGrid activities={activities.activities} />
                )}
        </div>
    )
}
