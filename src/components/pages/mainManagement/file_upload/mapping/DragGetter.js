import { memo } from 'react'
import { useDrag } from 'react-dnd'

const style = {
    cursor: 'move',
    float: 'left',
    border: '1px gray',
    borderRadius: '3px',
    marginRight: '0rem',
    marginBottom: '1rem',
    textAlign: "center",
    padding: '0.3rem 1.5rem',
    backgroundColor: '#d2e2f9',
}

export const DragGetter = memo(function DragGetter({ label, name, type, isDropped }) {
    const [{ opacity }, drag] = useDrag(
        () => ({
            type,
            item: { name },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
            }),
        }),
        [name, type],
    )
    const dragRef = isDropped ? null : drag;

    return (
        <div ref={dragRef} style={{ ...style, cursor: isDropped ? 'no-drop' : 'move', opacity }} data-testid="box">
            {isDropped ? <s>{label}</s> : label}
        </div>
    )
})