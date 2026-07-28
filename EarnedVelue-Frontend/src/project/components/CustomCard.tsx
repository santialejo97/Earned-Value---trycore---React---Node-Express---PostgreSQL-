import { useAuthStore } from "@/auth/store/auth.store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn, formatDate } from "@/lib/utils"
import { StatusProject, StatusProjectColors, type StatusProjectKey } from "@/type/constants.type"
import { useState, type MouseEvent } from "react"
import { Link, useNavigate } from 'react-router'
import { CustomerModal } from "./CustomerModalDelete"
import { CustomerModelActivity } from "./CustomerModelActivity"
import { Calendar } from "lucide-react"
import type { Activity } from "@/type/activities.type"


interface CustomCardProp {
    type: 'project' | 'activity',
    name: string,
    description: string,
    userId: string
    status: string
    id: string
    dateCreated: string | Date | number
    dateBegin?: string | Date | number
    dateEnd?: string | Date | number
    onDelete: (id: string) => void,
    activity?: Activity
}

export const CustomCard = ({ type, name, description, status, dateCreated, dateBegin, dateEnd, userId, id, onDelete, activity }: CustomCardProp) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const statusKey = status as StatusProjectKey
    const statusLabel = StatusProject[statusKey] ?? status
    const { user } = useAuthStore()
    const isOwner = userId === user?.id_user?.toString()
    const navigate = useNavigate()

    const handleOpenView = () => {
        setIsEdit(false)
        setIsActivityModalOpen(true)
    }

    const handleOpenEdit = (event: MouseEvent) => {
        event.stopPropagation()
        setIsEdit(true)
        setIsActivityModalOpen(true)
    }

    const handleCloseActivityModal = () => {
        setIsActivityModalOpen(false)
        setIsEdit(false)
    }

    const cardContent = (
        <>
            <CardHeader className="min-w-0 mr-2 my-2">
                <CardTitle className="flex min-w-0 items-center gap-2">
                    <Badge className="shrink-0" variant="outline">{type === "project" ? "Proyecto" : "Actividad"}</Badge>
                    <Tooltip>
                        <TooltipTrigger render={<span className="min-w-0 flex-1 truncate" />}>
                            {name}
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-sm">
                            {name}
                        </TooltipContent>
                    </Tooltip>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
                <p>{description}</p>
                <div className="mt-auto pt-2">
                    {
                        type === "activity" && (
                            <div className="flex items-center justify-around">
                                <p className="flex flex-col items-center">
                                    <span className="font-semibold flex items-center gap-2">
                                        <Calendar className="w-4 h-4 mr-2" /> Fecha de inicio
                                    </span>
                                    {formatDate(dateBegin)}
                                </p>
                                <p className="flex flex-col items-center">
                                    <span className="font-semibold flex items-center gap-2">
                                        <Calendar className="w-4 h-4 mr-2" /> Fecha de fin
                                    </span>
                                    {formatDate(dateEnd)}
                                </p>
                            </div>
                        )
                    }
                    <p className="text-sm text-muted-foreground mt-2">Fecha de creación: {formatDate(dateCreated)}</p>
                </div>
            </CardContent>
        </>
    )

    return (
        <>
            <Card className="h-full">
                {type === "project" ? (
                    <Link to={`/project/${id}`} className="flex flex-1 flex-col">
                        {cardContent}
                    </Link>
                ) : (
                    <div
                        role="button"
                        tabIndex={0}
                        className="flex flex-1 flex-col cursor-pointer"
                        onClick={handleOpenView}
                        onKeyDown={(e) => e.key === 'Enter' && handleOpenView()}
                    >
                        {cardContent}
                    </div>
                )}
                <CardFooter className="mt-auto">
                    <div className="flex justify-between items-center gap-3 w-full">
                        <div>
                            <Badge className={cn(StatusProjectColors[statusKey])}>{statusLabel}</Badge>
                        </div>
                        <div>
                            <Button className={'mr-2'} variant="secondary" disabled={type === 'project' ? !isOwner : false} onClick={(event) => {
                                if (type === "activity") {
                                    handleOpenEdit(event)
                                    return
                                }
                                navigate(`/project/edit/${id}`)
                            }}>Editar</Button>
                            <Button variant="destructive" disabled={type === 'project' ? !isOwner : false} onClick={() => setIsDeleteModalOpen(true)}>Eliminar</Button>
                        </div>
                    </div>

                </CardFooter>
            </Card>

            <CustomerModal
                open={isDeleteModalOpen}
                id={id}
                title={type === "project" ? "Eliminar proyecto" : "Eliminar actividad"}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={onDelete}
            />

            {type === "activity" && activity && (
                <CustomerModelActivity
                    open={isActivityModalOpen}
                    onClose={handleCloseActivityModal}
                    activity={activity}
                    isEdit={isEdit}
                />
            )}
        </>
    )
}
