import { useAuthStore } from "@/auth/store/auth.store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { StatusProject, StatusProjectColors, type StatusProjectKey } from "@/type/constants.type"
import { useState } from "react"
import { Link, useNavigate } from 'react-router';
import { CustomerModal } from "./CustomerModal"


interface CustomCardProp {
    type: 'project' | 'activity',
    name: string,
    description: string,
    userId: string
    status: string
    id: string
    dateCreated: string | Date
    dateBegin?: string
    dateEnd?: string
    onDelete: (id: string) => void
}

export const CustomCard = ({ type, name, description, status, dateCreated, dateBegin, dateEnd, userId, id, onDelete }: CustomCardProp) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const statusKey = status as StatusProjectKey
    const statusLabel = StatusProject[statusKey] ?? status
    const { user } = useAuthStore()
    const isOwner = userId === user?.id_user?.toString()
    const navigate = useNavigate()

    const handleEdit = (id: string) => {
        navigate(`/project/edit/${id}`)
    }

    const formatDate = (date: string | Date) => {
        const parsed = typeof date === 'string' ? new Date(date) : date

        if (Number.isNaN(parsed.getTime())) {
            return 'Fecha inválida'
        }

        return parsed.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }
    return (
        <>
            <Card className="h-full">
                <Link to={`/project/${id}`} className="flex flex-1 flex-col">
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
                            <p className="text-sm text-muted-foreground">Fecha de creación: {formatDate(dateCreated)}</p>
                            {
                                type === "activity" && (
                                    <div>
                                        <p>Fecha de inicio: {formatDate(dateBegin)}</p>
                                        <p>Fecha de fin: {formatDate(dateEnd)}</p>
                                    </div>
                                )
                            }
                        </div>
                    </CardContent>
                </Link>
                <CardFooter className="mt-auto">
                    <div className="flex justify-between items-center gap-3 w-full">
                        <div>
                            <Badge className={cn(StatusProjectColors[statusKey])}>{statusLabel}</Badge>
                        </div>
                        <div>
                            <Button className={'mr-2'} variant="secondary" disabled={!isOwner} onClick={() => handleEdit(id)}>Editar</Button>
                            <Button variant="destructive" disabled={!isOwner} onClick={() => setIsDeleteModalOpen(true)}>Eliminar</Button>
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
        </>
    )
}

