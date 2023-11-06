import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, lighten, darken } from '@mui/system';
import { useState } from 'react';
const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
}));

const GroupItems = styled('ul')({
    padding: 0,
});


export default function AutocompleteDropdown(props) {
    const { onTextChange, value, data, onSelect, groupByKey, labelKey } = props
    const [selectedOption, select] = useState(null)
    const onSelectValue = (option) => {
        let selected = data.find((item) => item.title == option)
        if (option !== selectedOption) {
            select(option)
            onSelect(selected)
        }
    }

    return (
        <Autocomplete
            id="grouped-demo"
            options={data.sort((a, b) => -b[groupByKey].localeCompare(a[groupByKey]))}
            onSelect={(event) => onSelectValue(event.target.value)}
            groupBy={(option) => option[groupByKey]}
            getOptionLabel={(option) => option[labelKey]}
            sx={{ outline: 'none', border: 'none', outlineWidth: 0, marginTop: 2, marginLeft: 1, marginRight: 1 }}
            size='small'
            renderInput={(params) =>
                <TextField size='small' className='font-quicksand text-sm' style={{ fontSize: 8 }} onChange={(event) => onTextChange(event.target.value)} placeholder='search'  {...params}
                    inputProps={{
                        ...params.inputProps,
                    }}
                    
                />
            }
            renderGroup={(params) => (
                <li key={params.key}>
                    <GroupHeader className='font-quicksand bg-gray-200 text-sm font-medium text-blue-600'>{params.group}</GroupHeader>
                    <GroupItems className='font-quicksand text-sm'>{params.children}</GroupItems>
                </li>
            )}
            
            noOptionsText="No data found."
        />
    );
}

