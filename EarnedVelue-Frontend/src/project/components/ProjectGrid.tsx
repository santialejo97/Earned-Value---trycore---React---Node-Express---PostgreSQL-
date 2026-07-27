import type { Project } from "@/type/projects.type"
import { CustomCard } from "./CustomCard"

interface ProjectGridProp {
    projects: Project[]
}

export const ProjectGrid = ({ projects }: ProjectGridProp) => {
    return (
        <>

            {projects.map((project) => (

                <CustomCard
                    key={project.id} type="project" name={project.name}
                    description={project.description} status={project.status}
                    dateCreated={project.created_at} />
            ))}
        </>
    )
}
