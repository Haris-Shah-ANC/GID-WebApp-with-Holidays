import React, { useContext } from 'react'
import * as XLSX from "xlsx";
import Papa from 'papaparse';
import * as Actions from '../../../../state/Actions';
import moment from 'moment';
import FileUploadButton from '../../../custom/Elements/buttons/FileUploadButton';
import { MAPPING } from '../../../../utils/Constant';
import TableHeader from '../../../custom/TableHeader';
import TableRow from '../../../custom/TableRow';
import PlainButton from '../../../custom/Elements/buttons/PlainButton';
const TimesheetFileData = () => {
    const state = Actions.getState(useContext);
    const dispatch = Actions.getDispatch(useContext);

    const { mappings, mapping_for } = state
    const { rows, fileName, columns } = mappings

    console.log("STATE", mappings)
    const onFileUpload = (fileData) => {
        const file = fileData
        const extension = file.name.split(".")[file.name.split(".").length - 1]
        if (extension === "csv" || extension === "xls" || extension === "xlsx") {
            //Reset the save state data 

            let fileSize = (file.size / 1024 / 1024)
            if (fileSize > 3) {
                // stateChangeManager(dispatch, Actions, true, 'error', "Maximum file size allowed is 3 MB. Please try with different file.")
                return
            }
            if (extension === "csv") {
                Papa.parse(file, {
                    complete: (result) => {
                        result.uploadedFile = file;
                        result.extension = extension;
                        updateData(result);
                    },
                    header: true,
                    skipEmptyLines: true,
                });
            } else if (extension === "xls" || extension === "xlsx") {
                const reader = new FileReader();

                reader.onload = (evt) => {

                    var filedata = new Uint8Array(evt.target.result);

                    const wb = XLSX.read(filedata, { type: 'array', cellDates: true, });

                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];

                    const data = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, raw: false, dateNF: 'YYYY-MM-DD' });

                    let headers = data[0]

                    let rows = data.map((item, i) => {
                        return Object.assign({}, ...item.map((x, index) => ({ [headers[index]]: x, })));
                    })
                    updateData({ data: rows, extension: extension, uploadedFile: file })
                };
                reader.readAsArrayBuffer(file);
            }
        } else {
            // stateChangeManager(dispatch, Actions, true, 'error', "Incorrect file type. Please try with different file in csv or xlsx format.")
        }
    }
    const updateData = (result) => {
        var data = result.data;
        // console.log('===>data',result.data)
        let _mappings = { ...mappings }
        let firstElement = result.extension === "csv" ? data[0] : data.shift();

        if (data.length) {
            _mappings.rows = data
            _mappings.uploadedFile = result.uploadedFile
            _mappings.file_headers = Object.keys(firstElement)

            _mappings.columns = Object.keys(firstElement).map((key) => { return { field: key, headerName: key, editable: false, sortable: false, flex: 1, minWidth: 200, fontWeight: key === 'Description' ? 500 : 700 } })
            // dispatch(Actions.stateChange("filterMessage", null))
        } else {
            // dispatch(Actions.stateChange("filterMessage", `The uploaded file does't contain any data, please check that the file is not empty`))
        }
        _mappings.fileExtension = result.extension
        _mappings.fileName = result.uploadedFile.name
        dispatch(Actions.stateChange("mappings", _mappings))
    }
    return (
        <div className='overflow-hidden' >
            <div className='flex flex-row  mt-6 md:mt-6 items-center justify-between '>
                <div className='flex-row flex items-center w-full'>
                    <FileUploadButton onSuccessFileUpload={onFileUpload} from={MAPPING} className={'flex-auto justify-start'}>{fileName}</FileUploadButton>
                </div>
                <div className='flex flex-row gap-6'>
                    {/* <PlainButton onButtonClick={() => ""} title={"Clear"} className={"py-2"} disable={false} /> */}
                    <PlainButton onButtonClick={() => ""} title={"Next"} className={"py-2"} disable={true} />
                </div>
            </div>
            <div className='mt-4 overflow-hidden ' >
                {columns && <TimeSheetTable columnsList={columns} rowsList={rows} />}
            </div>
        </div>
    )
}

function TimeSheetTable(props) {
    const { columnsList, rowsList } = props

    return (
        <div className='fixTableHead'>
            <table className=" bg-transparent w-full" >
                <thead className='bg-gray-200 px-10 justify-center items-center'>
                    <tr className='h-10 flex-auto'>
                        {columnsList.map((item, index) => (<TableHeader className={`text-left w-auto pl-3`} title={item.field}></TableHeader>))}
                    </tr>
                </thead>

                <tbody className=" divide-y divide-gray-200 table-fixed" style={{ height: 'calc(100vh - 350px)' }}>
                    {
                        rowsList.map((item, index) => {
                            return <TableRow onItemClick={() => ""} item={item} index={index} className={``} />

                        })
                    }
                </tbody>

            </table>
        </div>
    )
}



export default TimesheetFileData
