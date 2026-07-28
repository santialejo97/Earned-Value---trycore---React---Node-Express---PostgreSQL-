import type { Activity } from "@/type/activities.type"
import { CustomCard } from "./CustomCard"
import { useSearchParams } from "react-router"
import { useDeleteActivity } from "../hooks/useActivity"


interface ActivityGridProp {
    activities: Activity[]
}

export const ActivityGrid = ({ activities, }: ActivityGridProp) => {
    const [searchParams] = useSearchParams()
    const id_project = searchParams.get('id_project')
    const { mutation } = useDeleteActivity(id_project)

    const handleDelete = (id: string) => {
        mutation.mutate(id)
    }

    const type = "activity"
    return (
        <>
            <section>
                <div className="py-12 px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activities.map((activity: Activity) => (
                            <CustomCard
                                key={activity.id_activity} type={type} name={activity.name} userId={activity.id_user?.toString()}
                                description={activity.description} status={activity.status} dateBegin={activity.startDate} dateEnd={activity.endDate}
                                dateCreated={activity.created_at} id={activity.id_activity} onDelete={handleDelete} activity={activity} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
