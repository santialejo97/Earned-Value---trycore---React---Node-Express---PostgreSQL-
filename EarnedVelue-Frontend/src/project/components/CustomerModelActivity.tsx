import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { useEffect, useMemo, useState } from "react"

import type { Activity } from "@/type/activities.type"
import { ActivityForm } from "../pages/ui/ActivityForm"
import { StatusProject, StatusProjectColors, type StatusProjectKey } from "@/type/constants.type"
import { cn } from "@/lib/utils"
import { useSearchParams } from "react-router"
import { useActivity } from "../hooks/useActivity"
import { normalizeActivity } from "../utils/activity.utils"
import { toast } from "sonner"


interface CustomerModelActivityProps {
    open: boolean
    onClose: () => void
    activity: Activity
    isEdit: boolean
}


export const CustomerModelActivity = ({
    open,
    onClose,
    activity,
    isEdit
}: CustomerModelActivityProps) => {
    const [searchParams] = useSearchParams()
    const id_project = searchParams.get('id_project') ?? activity.id_project

    const { data: activityData, isLoading, mutation } = useActivity(
        activity.id_activity,
        id_project,
        { enabled: open },
    )

    const currentActivity = activityData ?? activity
    const normalizedActivity = useMemo(
        () => normalizeActivity(currentActivity),
        [currentActivity],
    )
    const { name, status } = normalizedActivity

    const [currentStatus, setCurrentStatus] = useState(status)
    const [nameActivity, setNameActivity] = useState(name)

    useEffect(() => {
        if (!open) return
        setCurrentStatus(status)
        setNameActivity(name)
    }, [open, status, name, activity.id_activity, activityData])

    const statusKey = currentStatus as StatusProjectKey
    const statusLabel = StatusProject[statusKey] ?? currentStatus

    const handleSubmit = async (activityLike: Activity) => {
        await mutation.mutateAsync(activityLike, {
            onSuccess: () => {
                toast.success('Actividad actualizada correctamente', {
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

                onClose()
            },
            onError: (error) => {
                console.error('Error al actualizar actividad:', error)
                toast.error('Error al actualizar la actividad', {
                    position: 'top-right',
                    duration: 3000,
                    icon: '🚨',
                    className: 'bg-red-500 text-white',
                })
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="mr-5 sm:max-w-md" >
                <DialogHeader >
                    <DialogTitle className="flex items-center gap-2">
                        <Badge variant="outline">Actividad</Badge>
                        <span className="truncate">{nameActivity}</span>
                    </DialogTitle>
                    <DialogDescription className={cn("flex justify-between items-center gap-2 mt-3")}>
                        Detalle de la actividad seleccionada.
                        <Badge className={cn(StatusProjectColors[statusKey])}>{statusLabel}</Badge>
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : (
                    <ActivityForm
                        key={`${normalizedActivity.id_activity}-${normalizedActivity.updated_at?.toString()}`}
                        activity={normalizedActivity}
                        onStatusChange={setCurrentStatus}
                        onNameChange={setNameActivity}
                        onClose={onClose}
                        onSubmit={handleSubmit}
                        isEdit={isEdit}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}
