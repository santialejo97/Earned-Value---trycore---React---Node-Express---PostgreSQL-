import { useAuthStore } from "@/auth/store/auth.store"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ProjectGrid } from "@/project/components/ProjectGrid"
import { useDeleteProject, useProjectList } from "@/project/hooks/useProject"
import { Link } from "react-router"

export const ProjectsPage = () => {
    const { user } = useAuthStore()
    const { data, isLoading, isError } = useProjectList(user?.id_user)
    const { mutation } = useDeleteProject()

    if (isLoading) {
        return <Spinner></Spinner>
    }

    const handleDeleteProject = (id: string) => {
        mutation.mutateAsync(id)
    }

    return (
        <div>
            <div className="flex justify-between items-center gap-4 ">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Proyectos</h1>
                    <p className="mt-2 text-muted-foreground">
                        Administra y consulta tus proyectos desde aquí.
                    </p>
                </div>
                <Link to="/project/new">
                    <Button variant="secondary" size="sm">Nuevo Proyecto</Button>
                </Link>
            </div>
            {isError ? (<div className="text-center text-sm text-muted-foreground mt-5">No existen proyectos aún, crea uno nuevo</div>) :
                (
                    <>
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight mt-7 ">Tus proyectos</h2>
                            <ProjectGrid projects={data.projects.filter((project) => project.id_user === user?.id_user)} onDelete={handleDeleteProject} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight mt-5 ">Proyectos de otros usuarios</h2>
                            <ProjectGrid projects={data.projects.filter((project) => project.id_user !== user?.id_user)} onDelete={handleDeleteProject} />
                        </div>
                    </>
                )}
        </div>
    )
}
