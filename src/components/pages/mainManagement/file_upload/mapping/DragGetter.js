import { memo } from 'react'
import { useDrag } from 'react-dnd'

const style = {
    float: 'left',
    display: 'flex',
    textAlign: 'center',
    borderRadius: '30px',
    alignItems: 'center',
    marginBottom: '1.5rem',
    justifyContent: 'center',
    padding: '0.3rem 1.5rem',
    border: '1px solid transparent',
    cursor: 'move',
    float: 'left',

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
        <div ref={dragRef} className={`capitalize rounded-full py-1 my-3 float-left bg-[#d2e2f9] text-center `} style={{  cursor: isDropped ? 'no-drop' : 'move', opacity }} data-testid="box">
            {isDropped ? <s>{label}</s> : label}
        </div>
    )
})