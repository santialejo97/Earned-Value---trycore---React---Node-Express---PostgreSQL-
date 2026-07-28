import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectListAction } from "../actions/projectList.action"
import { getProjectByIdAction } from '../actions/getProjectById.action';
import { createOrUpdateProjectAction } from '../actions/createOrUpdateProject.action';
import { deleteProjectAction } from '../actions/deteleProject.action';


export const useProjectList = (id_user: string) => {
    return useQuery({
        queryKey: ['projects', id_user],
        queryFn: projectListAction,
        retry: false,
        staleTime: 1000 * 60 * 5,

    })
}

export const useProject = (id: string) => {

    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['project', id],
        queryFn: () => getProjectByIdAction(id),
        retry: false,
        staleTime: 1000 * 60 * 5,
        enabled: !!id
    })


    const mutation = useMutation({
        mutationFn: createOrUpdateProjectAction,
        onSuccess: (project) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
            queryClient.invalidateQueries({ queryKey: ['project', id] })
            queryClient.setQueryData(['project', project.id], project)
        }
    })

    return {
        ...query,
        mutation
    }

}

export const useDeleteProject = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: deleteProjectAction,
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
            queryClient.invalidateQueries({ queryKey: ['project', deletedId] })
        }
    })

    return {
        mutation
    }
}
