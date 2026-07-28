
import { useProject } from "@/project/hooks/useProject"
import { ProjectForm } from "../ui/ProjectForm"
import { Navigate, useLocation, useNavigate, useParams } from "react-router"
import type { Project } from "@/type/projects.type"
import { toast } from "sonner"


export const ProjectPage = () => {
    const { id } = useParams()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const isEdit = pathname.includes('edit')
    const title = id == 'new' ? 'Nuevo Proyecto' : isEdit ? 'Editar Proyecto' : 'Ver Proyecto'

    const { isLoading, data: project, isError, mutation } = useProject(id || '')

    const handleSubmit = async (projectLike: Project) => {
        console.log(projectLike)
        await mutation.mutateAsync(projectLike, {
            onSuccess: () => {
                toast.success('Proyecto actualizado correctamente', {
                    position: 'top-right',
                    duration: 3000,
                    icon: '🎉',
                    className: 'bg-green-500 text-white',
                    style: {
                        background: 'linear-gradient(to right, #4ade80, #22c55e)',
                        borderRadius: '10px',
                        padding: '10px',
                    }
                })

                navigate(`/projects`)

            },
            onError: () => {
                toast.error('Error al actualizar el proyecto', {
                    position: 'top-right',
                    duration: 3000,
                    icon: '🚨',
                    className: 'bg-red-500 text-white',
                })
            }
        })
    }

    if (isError) {
        return <Navigate to="/projects" />
    }

    if (isLoading) {
        return <div>Cargando...</div>
    }

    return (
        <>
            <ProjectForm
                onSubmit={handleSubmit}
                project={project}
                title={title}
                isPending={mutation.isPending}
                isEdit={isEdit} />
        </>
    )
}
