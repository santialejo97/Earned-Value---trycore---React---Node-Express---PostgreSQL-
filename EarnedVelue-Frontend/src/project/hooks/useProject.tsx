import { useQuery } from "@tanstack/react-query"
import { projectListAction } from "../actions/projectList.action"


export const useProjectList = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: projectListAction,
        staleTime: 1000 * 60 * 5,
    })
}
