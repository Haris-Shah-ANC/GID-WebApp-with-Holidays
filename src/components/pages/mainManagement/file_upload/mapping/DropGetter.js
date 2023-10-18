import { memo } from 'react'
import { useDrop } from 'react-dnd'
import { Chip, FormLabel } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

const style = {
    float: 'left',
    display: 'flex',
    textAlign: 'center',
    borderRadius: '30px',
    alignItems: 'center',
    marginBottom: '1.5rem',
    justifyContent: 'center',
    padding: '0.3rem 1.5rem',
    border: '1px solid #f4c92e',
    backgroundColor: '#d2e2f9',

}

function selectBackgroundColor(isActive, canDrop) {
    if (isActive) {
        return 'darkgreen'
    } else if (canDrop) {
        return 'darkkhaki'
    } else {
        return '#fef9e7'
    }
}

export const DropGetter = memo(function DropGetter({
    index,
    accept,
    onDrop,
    model_field,
    onDeleteMapping,
}) {
    const [{ isOver, canDrop }, drop] = useDrop({
        model_field,
        index,
        onDeleteMapping,
        accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })
    const isActive = isOver && canDrop

    var border = '1px solid #f4c92e'
    var backgroundColor = selectBackgroundColor(isActive, canDrop)
    if (!isActive) {
        border = 'none'
        backgroundColor = "#ebebeb"
    }

    return (
        <div ref={drop} className={`capitalize rounded-full py-1 my-3 float-left bg-[#fae6f3] text-center `} style={{  border, backgroundColor }} data-testid="dustbin">
            {isActive
                ? <Chip label={"Release"} style={{ width: '82%' }}></Chip>
                : <>{model_field.file_header ?
                    <>{<label style={{}}>{model_field.verbose_name}{model_field.is_required && <span style={{ color: 'red' }}> *</span>}</label>}<CloseIcon fontSize='small' sx={{ cursor: 'pointer' }} onClick={() => onDeleteMapping(index)} /></>
                    :
                    <FormLabel style={{}}>{model_field.verbose_name}{model_field.is_required && <span style={{ color: 'red' }}> *</span>}</FormLabel>
                }</>
            }

        </div>
    )
})