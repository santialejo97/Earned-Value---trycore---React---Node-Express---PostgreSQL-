import { Button } from "@/components/ui/button"
import { ProjectGrid } from "@/project/components/ProjectGrid"
import { useProjectList } from "@/project/hooks/useProject"

export const ProjectsPage = () => {

    const { data, isLoading } = useProjectList()
    return (
        <div>
            <div className="flex justify-between items-center gap-4 ">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Proyectos</h1>
                    <p className="mt-2 text-muted-foreground">
                        Administra y consulta tus proyectos desde aquí.
                    </p>
                </div>
                <Button variant="secondary" size="sm">Nuevo Proyecto</Button>
            </div>
            {isLoading ? (<div>Cargando...</div>) : <ProjectGrid projects={data.projects} />}
        </div>
    )
}
