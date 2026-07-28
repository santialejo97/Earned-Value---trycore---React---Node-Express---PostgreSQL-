import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker'
import { Separator } from '@/components/ui/separator'
import type { ActivityMetricsTotals } from '@/type/activities.type'
import type { ProjectEarnedValueMetrics } from '@/type/projects.type'
import { CircleDollarSign, Gem, TrendingUp } from 'lucide-react'

interface CustomerInfoEarnedProps {
    projectEarnedValueMetrics: ProjectEarnedValueMetrics
    activityMetricsTotals: ActivityMetricsTotals
}

const formatCurrency = (value: number) =>
    value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    })

const formatPercent = (value: number) =>
    value.toLocaleString('es-CO', {
        maximumFractionDigits: 2,
    })

const formatIndex = (value: number) =>
    value.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

export const CustomerInfoEarned = ({
    projectEarnedValueMetrics,
    activityMetricsTotals,
}: CustomerInfoEarnedProps) => {
    const {
        budgetAtCompletion,
        plannedValue,
        earnedValue,
        actualCost,
        costVariance,
        scheduleVariance,
        costPerformanceIndex,
        schedulePerformanceIndex,
    } = projectEarnedValueMetrics

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-lg font-medium'>
                    Valor ganado
                </CardTitle>
                <CardDescription>
                    Totales calculados a partir de las actividades del proyecto
                </CardDescription>
                <Separator />
            </CardHeader>
            <CardContent className="space-y-4">
                <Marker variant="border" className='font-mono text-sm'>
                    <MarkerIcon>
                        <Gem />
                    </MarkerIcon>
                    <MarkerContent>
                        Presupuesto total (BAC): <span className='font-bold'>{formatCurrency(budgetAtCompletion)}</span>
                    </MarkerContent>
                </Marker>
                <Marker variant="border" className='font-mono text-sm'>
                    <MarkerIcon>
                        <TrendingUp />
                    </MarkerIcon>
                    <MarkerContent>
                        Valor planificado (PV): <span className='font-bold'>{formatCurrency(plannedValue)}</span>
                    </MarkerContent>
                </Marker>
                <Marker variant="border" className='font-mono text-sm'>
                    <MarkerIcon>
                        <CircleDollarSign />
                    </MarkerIcon>
                    <MarkerContent>
                        Valor ganado (EV): <span className='font-bold'>{formatCurrency(earnedValue)}</span>
                    </MarkerContent>
                </Marker>
                <Marker variant="border" className='font-mono text-sm'>
                    <MarkerIcon>
                        <CircleDollarSign />
                    </MarkerIcon>
                    <MarkerContent>
                        Costo actual (AC): <span className='font-bold'>{formatCurrency(actualCost)}</span>
                    </MarkerContent>
                </Marker>
                <Separator />
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <p>Suma % planeado: <span className="font-semibold text-foreground">{formatPercent(activityMetricsTotals.percentagePlanned)}%</span></p>
                    <p>Suma % completado: <span className="font-semibold text-foreground">{formatPercent(activityMetricsTotals.percentageCompleted)}%</span></p>
                    <p>CV: <span className="font-semibold text-foreground">{formatCurrency(costVariance)}</span></p>
                    <p>SV: <span className="font-semibold text-foreground">{formatCurrency(scheduleVariance)}</span></p>
                    <p>CPI: <span className="font-semibold text-foreground">{formatIndex(costPerformanceIndex)}</span></p>
                    <p>SPI: <span className="font-semibold text-foreground">{formatIndex(schedulePerformanceIndex)}</span></p>
                </div>
            </CardContent>
        </Card>
    )
}
