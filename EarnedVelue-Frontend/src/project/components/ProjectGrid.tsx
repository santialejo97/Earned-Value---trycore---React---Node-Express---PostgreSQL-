import type { Project } from "@/type/projects.type"
import { CustomCard } from "./CustomCard"

interface ProjectGridProp {
    projects: Project[]
    onDelete: (id: string) => void
}

export const ProjectGrid = ({ projects, onDelete }: ProjectGridProp) => {
    const type = "project"
    return (
        <>
            <section>
                <div className="py-12 px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (

                            <CustomCard
                                key={project.id} type={type} name={project.name} userId={project.id_user?.toString()}
                                description={project.description} status={project.status}
                                dateCreated={project.created_at} id={project.id} onDelete={onDelete} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
