import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { activitiesListAction } from "../actions/activitiesList.action"
import {
    calculateProjectEarnedValueMetrics,
    sumActivityMetrics,
} from "../utils/activity.utils"
import type { ActivityMetricsTotals } from "@/type/activities.type"
import type { ProjectEarnedValueMetrics } from "@/type/projects.type"

const emptyMetrics: ProjectEarnedValueMetrics = {
    budgetAtCompletion: 0,
    plannedValue: 0,
    earnedValue: 0,
    actualCost: 0,
    costVariance: 0,
    scheduleVariance: 0,
    costPerformanceIndex: 0,
    schedulePerformanceIndex: 0,
    estimateAtCompletion: 0,
    varianceAtCompletion: 0,
}

const emptyTotals: ActivityMetricsTotals = {
    budgetCompletion: 0,
    percentagePlanned: 0,
    percentageCompleted: 0,
    actualCost: 0,
}

export const useProjectMetric = (id_project: string) => {
    const isEnabled = !!id_project && id_project !== "new"

    const { data, isLoading, isError } = useQuery({
        queryKey: ["activities", "list", id_project],
        queryFn: () => activitiesListAction(id_project),
        retry: false,
        enabled: isEnabled,
        staleTime: 1000 * 60 * 5,
    })

    const activities = data?.activities ?? []

    const activityMetricsTotals = useMemo(
        () => (activities.length ? sumActivityMetrics(activities) : emptyTotals),
        [activities],
    )

    const projectEarnedValueMetrics = useMemo(
        () =>
            activities.length
                ? calculateProjectEarnedValueMetrics(activities)
                : emptyMetrics,
        [activities],
    )

    const isShowEarnedValue = isEnabled && !isLoading && !isError && activities.length > 0

    return {
        isShowEarnedValue,
        activityMetricsTotals,
        projectEarnedValueMetrics,
        isLoading,
        isError,
    }
}
