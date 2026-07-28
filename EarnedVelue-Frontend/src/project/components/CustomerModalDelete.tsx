import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"


interface CustomerModalProps {
    open: boolean
    id: string
    title?: string
    onClose: () => void
    onDelete: (id: string) => void
}

export const CustomerModal = ({ open, onClose, onDelete, id, title = "Confirmar eliminación" }: CustomerModalProps) => {
    const handleDelete = () => {
        onDelete(id)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline">Cancelar</Button>} />
                    <Button variant="destructive" onClick={handleDelete}>Confirmar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
