import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Activity } from "@/type/activities.type"
import { activitiesListAction } from "../actions/activitiesList.action"
import { getActivityByIdAction } from "../actions/getActivityById.action"
import { createOrUpdateActivityAction } from "../actions/createOrUpdateActivity.action"
import { deleteActivityAction } from "../actions/deleteActivity.action"


export const useActivityList = (id_project: string) => {
    const query = useQuery({
        queryKey: ['activities', 'list', id_project],
        queryFn: () => activitiesListAction(id_project),
        staleTime: 1000 * 60 * 5,
        retry: false,
    })

    return query
}

interface UseActivityOptions {
    enabled?: boolean
}

export const useActivity = (
    id_activity: string,
    id_project: string,
    options?: UseActivityOptions,
) => {
    const queryClient = useQueryClient();
    const isEnabled = (options?.enabled ?? true) && !!id_activity && id_activity !== 'new';

    const query = useQuery({
        queryKey: ['activities', 'id', id_activity],
        queryFn: () => getActivityByIdAction(id_activity),
        retry: false,
        staleTime: 1000 * 60 * 5,
        enabled: isEnabled,
    })

    const mutation = useMutation({
        mutationFn: (activity: Activity) => createOrUpdateActivityAction(activity, id_project),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities', 'id', id_activity] })
            queryClient.invalidateQueries({ queryKey: ['activities', 'list', id_project] })
        }
    })

    return {
        ...query,
        mutation
    }
}

export const useDeleteActivity = (id_project: string) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: deleteActivityAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities', 'list', id_project] })
        }
    })

    return { mutation }
}



