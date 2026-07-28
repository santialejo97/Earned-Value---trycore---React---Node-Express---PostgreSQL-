import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn, formatDate, toDate } from "@/lib/utils"
import type { Activity } from "@/type/activities.type"
import { StatusProject } from "@/type/constants.type"
import {
    toActivityFormValues,
    toActivityPayload,
    type ActivityFormValues,
} from "@/project/utils/activity.utils"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import {
    Controller,
    FormProvider,
    useForm,
    useFormContext,
    useFormState,
    type ControllerRenderProps,
} from "react-hook-form"

const numberInputClassName = "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

const parseNumberInput = (value: string): number | "" => {
    if (value === "") return ""
    const parsed = Number(value)
    return Number.isNaN(parsed) ? "" : parsed
}

type NumericActivityField =
    | "budgetCompletion"
    | "percentagePlanned"
    | "percentageCompleted"
    | "actualCost"

const NumberInput = ({
    field,
    id,
    hasError,
    disabled,
}: {
    field: ControllerRenderProps<ActivityFormValues, NumericActivityField>
    id: string
    hasError?: boolean
    disabled?: boolean
}) => (
    <Input
        type="number"
        id={id}
        name={field.name}
        ref={field.ref}
        onBlur={field.onBlur}
        disabled={disabled}
        value={field.value === "" ? "" : Number(field.value ?? 0)}
        onChange={(event) => field.onChange(parseNumberInput(event.target.value))}
        className={cn(numberInputClassName, { "border-red-500": hasError })}
    />
)

interface ActivityFormProps {
    activity: Activity
    onStatusChange?: (status: string) => void
    onNameChange?: (name: string) => void
    onClose: () => void
    onSubmit: (activity: Activity) => void
    isEdit?: boolean
}

interface ActivityFormFieldsProps {
    activity: Activity
    onStatusChange?: (status: string) => void
    onNameChange?: (name: string) => void
    onClose: () => void
    onSubmit: (activity: Activity) => void
    isEdit: boolean
}

const ActivityFormFields = ({
    activity,
    onStatusChange,
    onNameChange,
    onClose,
    onSubmit,
    isEdit,
}: ActivityFormFieldsProps) => {
    const { created_at: dateCreated } = activity
    const isReadOnly = !isEdit

    const { handleSubmit, control } = useFormContext<ActivityFormValues>()
    const { errors } = useFormState({ control })

    const saveActivity = handleSubmit((formData) => {
        onSubmit(toActivityPayload(formData, activity))
    })

    return (
        <form
            noValidate
            onSubmit={(event) => {
                event.preventDefault()
            }}
        >
            <div className="space-y-4">
                <div>
                    <Label className="block text-sm font-medium mb-2">Nombre</Label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: "El nombre es requerido",
                            validate: (value) =>
                                value.trim().length > 0 || "El nombre es requerido",
                        }}
                        render={({ field }) => (
                            <Input
                                type="text"
                                id="name"
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                value={field.value ?? ""}
                                disabled={isReadOnly}
                                onChange={(event) => {
                                    const value = event.target.value
                                    field.onChange(value)
                                    onNameChange?.(value)
                                }}
                                placeholder="Nombre de la actividad"
                                className={cn("w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", {
                                    "border-red-500": errors.name
                                })}
                            />
                        )}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message?.toString() ?? "El nombre es requerido"}
                        </p>
                    )}
                </div>
                <div className="mb-6">
                    <Label className="block text-sm font-medium  mb-2">Estado</Label>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: "El estado es requerido" }}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                disabled={isReadOnly}
                                onValueChange={(value) => {
                                    field.onChange(value)
                                    onStatusChange?.(value)
                                }}
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
                                {errors.status.message?.toString() ?? "El estado es requerido"}
                            </p>
                        )
                    }
                </div>
                <div className="mb-6">
                    <Label className="block text-sm font-medium  mb-2">Descripción</Label>
                    <Controller
                        name="description"
                        control={control}
                        rules={{
                            required: "La descripción es requerida",
                            validate: (value) =>
                                value.trim().length > 0 || "La descripción es requerida",
                        }}
                        render={({ field }) => (
                            <Textarea
                                id="description"
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                value={field.value ?? ""}
                                disabled={isReadOnly}
                                onChange={(event) => field.onChange(event.target.value)}
                                placeholder="Descripción de la actividad"
                                className={
                                    cn("w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200", {
                                        "border-red-500": errors.description
                                    })
                                }
                            />
                        )}
                    />
                    {
                        errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description.message?.toString() ?? "La descripción es requerida"}
                            </p>
                        )
                    }
                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <Label className="block text-sm font-medium  mb-2">Porcentaje planeado %</Label>
                        <Controller
                            name="percentagePlanned"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (value === "") return "El porcentaje planeado es requerido"
                                    if (Number(value) < 0) return "El porcentaje planeado debe ser mayor o igual a 0"
                                    return true
                                },
                            }}
                            render={({ field }) => (
                                <NumberInput
                                    field={field}
                                    id="percentagePlanned"
                                    hasError={!!errors.percentagePlanned}
                                    disabled={isReadOnly}
                                />
                            )}
                        />
                        {errors.percentagePlanned && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.percentagePlanned.message?.toString() ?? "El porcentaje planeado es requerido"}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label className="block text-sm font-medium  mb-2">Presupuesto total planificado</Label>
                        <Controller
                            name="budgetCompletion"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (value === "") return "El presupuesto total planificado es requerido"
                                    if (Number(value) < 0) return "El presupuesto total planificado debe ser mayor o igual a 0"
                                    return true
                                },
                            }}
                            render={({ field }) => (
                                <NumberInput
                                    field={field}
                                    id="budgetCompletion"
                                    hasError={!!errors.budgetCompletion}
                                    disabled={isReadOnly}
                                />
                            )}
                        />
                        {errors.budgetCompletion && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.budgetCompletion.message?.toString() ?? "El presupuesto total planificado es requerido"}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="block text-sm font-medium  mb-2">Porcentaje completado %</Label>
                        <Controller
                            name="percentageCompleted"
                            control={control}
                            rules={{
                                validate: (value) =>
                                    value === "" ||
                                    Number(value) >= 0 ||
                                    "El porcentaje completado debe ser mayor o igual a 0",
                            }}
                            render={({ field }) => (
                                <NumberInput
                                    field={field}
                                    id="percentageCompleted"
                                    hasError={!!errors.percentageCompleted}
                                    disabled={isReadOnly}
                                />
                            )}
                        />
                        {errors.percentageCompleted && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.percentageCompleted.message?.toString()}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label className="block text-sm font-medium  mb-2">Costo actual</Label>
                        <Controller
                            name="actualCost"
                            control={control}
                            rules={{
                                validate: (value) =>
                                    value === "" ||
                                    Number(value) >= 0 ||
                                    "El costo actual debe ser mayor o igual a 0",
                            }}
                            render={({ field }) => (
                                <NumberInput
                                    field={field}
                                    id="actualCost"
                                    hasError={!!errors.actualCost}
                                    disabled={isReadOnly}
                                />
                            )}
                        />
                        {errors.actualCost && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.actualCost.message?.toString()}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="block text-sm font-medium  mb-2">Fecha de inicio</Label>
                        <Controller
                            name="startDate"
                            control={control}
                            rules={{ required: "La fecha de inicio es requerida" }}
                            render={({ field }) => {
                                const selectedDate = toDate(field.value)

                                return (
                                    <Popover>
                                        <PopoverTrigger
                                            type="button"
                                            disabled={isReadOnly}
                                            render={
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={isReadOnly}
                                                    data-empty={!selectedDate}
                                                    className={cn(
                                                        "w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground",
                                                        { "border-red-500": errors.startDate }
                                                    )}
                                                >
                                                    {selectedDate ? format(selectedDate, "PPP") : <span>Fecha de inicio</span>}
                                                    <ChevronDownIcon data-icon="inline-end" />
                                                </Button>
                                            }
                                        />
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={field.onChange}
                                                defaultMonth={selectedDate}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )
                            }}
                        />
                        {errors.startDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.startDate.message?.toString() ?? "La fecha de inicio es requerida"}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label className="block text-sm font-medium  mb-2">Fecha de fin</Label>
                        <Controller
                            name="endDate"
                            control={control}
                            rules={{
                                required: "La fecha de fin es requerida",
                                validate: (endDate, formValues) => {
                                    const startDate = toDate(formValues.startDate)
                                    const parsedEndDate = toDate(endDate)

                                    if (!startDate || !parsedEndDate) return true

                                    return (
                                        parsedEndDate >= startDate ||
                                        "La fecha de fin debe ser posterior o igual a la de inicio"
                                    )
                                },
                            }}
                            render={({ field }) => {
                                const selectedDate = toDate(field.value)

                                return (
                                    <Popover>
                                        <PopoverTrigger
                                            type="button"
                                            disabled={isReadOnly}
                                            render={
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={isReadOnly}
                                                    data-empty={!selectedDate}
                                                    className={cn(
                                                        "w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground",
                                                        { "border-red-500": errors.endDate }
                                                    )}
                                                >
                                                    {selectedDate ? format(selectedDate, "PPP") : <span>Fecha de fin</span>}
                                                    <ChevronDownIcon data-icon="inline-end" />
                                                </Button>
                                            }
                                        />
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={field.onChange}
                                                defaultMonth={selectedDate}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )
                            }}
                        />
                        {errors.endDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.endDate.message?.toString() ?? "La fecha de fin es requerida"}
                            </p>
                        )}
                    </div>

                </div>
            </div>
            <div className="space-y-4 mt-3 flex justify-between items-center gap-2">
                <p className="text-sm text-muted-foreground">
                    Fecha de creación: {formatDate(toDate(dateCreated) ?? new Date())}
                </p>
                <div className="flex justify-end items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => onClose()}>
                        {isEdit ? "Cancelar" : "Cerrar"}
                    </Button>
                    {isEdit && (
                        <Button type="button" variant="default" onClick={saveActivity}>
                            Guardar
                        </Button>
                    )}
                </div>
            </div>
        </form>
    )
}

export const ActivityForm = ({ activity, onStatusChange, onNameChange, onClose, onSubmit, isEdit = false }: ActivityFormProps) => {
    const form = useForm<ActivityFormValues>({
        defaultValues: toActivityFormValues(activity),
        mode: "onSubmit",
        reValidateMode: "onChange",
        shouldFocusError: true,
    })

    return (
        <FormProvider {...form}>
            <ActivityFormFields
                activity={activity}
                onStatusChange={onStatusChange}
                onNameChange={onNameChange}
                onClose={onClose}
                onSubmit={onSubmit}
                isEdit={isEdit}
            />
        </FormProvider>
    )
}
