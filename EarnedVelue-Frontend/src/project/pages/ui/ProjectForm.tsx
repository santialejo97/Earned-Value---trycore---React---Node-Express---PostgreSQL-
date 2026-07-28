import { useAuthStore } from "@/auth/store/auth.store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { StatusProject } from "@/type/constants.type"
import type { Project } from "@/type/projects.type"
import { List, Plus, SaveAll, X } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router"

interface ProjectFormProps {
    onSubmit: (data: Project) => void
    project: Project,
    title: string
    isPending: boolean,
    isEdit: boolean
}

export const ProjectForm = ({ onSubmit, project, title, isPending, isEdit }: ProjectFormProps) => {

    const { user } = useAuthStore()
    let isOwner = false
    if (isEdit) {
        isOwner = user?.id_user === project?.id_user
    }
    const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm<Project>({
        defaultValues: project
    })

    if (project.id === 'new') {
        isOwner = true
    }

    useEffect(() => {
        reset(project)
    }, [project, reset])

    const name = watch('name')

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-8">
                    <div className="flex justify-between items-center">

                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <div className="flex gap-2">
                            <Button variant="outline"><Plus className="w-4 h-4" /> Crear actividad</Button>
                            <Button variant="outline"><List className="w-4 h-4" /> Listar actividades</Button>
                        </div>
                    </div>
                    {
                        name !== '' && (
                            <p className="mt-2 text-muted-foreground">
                                {name}
                            </p>
                        )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <div className="mb-6">
                            <Label className="block text-sm font-medium  mb-2">Nombre</Label>
                            <Input type="text" id="name" disabled={!isOwner} {...register("name", {
                                required: true
                            })}
                                placeholder="Nombre del proyecto"
                                className={
                                    cn("w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", {
                                        "border-red-500": errors.name
                                    })
                                }
                            />
                            {
                                errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        El nombre es requerido
                                    </p>
                                )
                            }
                        </div>

                        <div className="mb-6">
                            <Label className="block text-sm font-medium  mb-2">Estado</Label>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        disabled={!isOwner}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className={
                                            cn("w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", {
                                                "border-red-500": errors.status
                                            })
                                        }>
                                            <SelectValue placeholder="Selecciona un estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                Object.keys(StatusProject).map((status) => (
                                                    <SelectItem key={status} value={status}>{StatusProject[status as keyof typeof StatusProject]}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {
                                errors.status && (
                                    <p className="text-red-500 text-sm mt-1">
                                        El estado es requerido
                                    </p>
                                )
                            }
                        </div>
                        <div className="mb-6">
                            <Label className="block text-sm font-medium  mb-2">Descripción</Label>
                            <Textarea disabled={!isOwner} id="description" {...register("description", {
                                required: true
                            })}
                                placeholder="Descripción del proyecto"
                                className={
                                    cn("w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", {
                                        "border-red-500": errors.description
                                    })
                                }
                            />
                            {
                                errors.description && (
                                    <p className="text-red-500 text-sm mt-1">
                                        La descripción es requerida
                                    </p>
                                )
                            }
                        </div>
                        <div className="flex justify-end mb-10 gap-4">
                            <Button variant="outline" type="button">
                                <Link to="/projects" className="flex items-center gap-2">
                                    <X className="w-4 h-4" />
                                    Cancelar
                                </Link>
                            </Button>

                            <Button disabled={isPending || !isOwner} type="submit" >
                                <SaveAll className="w-4 h-4" />
                                Guardar cambios
                            </Button>
                        </div>
                    </div>
                    <div className="col-span-1">

                        {/* //TODO Agregar la informacion del valor ganado por el proyecto */}

                    </div>
                </div>
                <div>

                </div>
            </form >
        </>
    )
}
