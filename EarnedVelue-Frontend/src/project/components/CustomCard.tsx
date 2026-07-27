
interface CustomCardProp {
    type: 'project' | 'activity',
    name: string,
    description: string,
    status: string
    dateCreated: Date
    dateBegin?: string
    dateEnd?: string
}

export const CustomCard = ({ }: CustomCardProp) => {
    return (
        <div>CustomCard</div>
    )
}

