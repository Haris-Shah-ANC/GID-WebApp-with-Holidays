import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

function MultiSelectAutoCompleteDropdown(props) {
    const { arrayList, labelKey, onChange } = props
    return (
        <Autocomplete
            multiple
            id="tags-outlined"
            options={arrayList}
            getOptionLabel={(option) => option[labelKey]}
            filterSelectedOptions
            size='small'
            sx={{ outline: 'none', border: 'none', outlineWidth: 0, }}
            renderInput={(params) => (
                <TextField
                    className='font-quicksand text-sm'
                    style={{ fontSize: 8 }}
                    {...params}
                    label=""
                    placeholder="Add employee"
                    size='small'
                />
            )}
            onChange={(event, newValue) => onChange(newValue)}
        />
    )
}

export default MultiSelectAutoCompleteDropdown
