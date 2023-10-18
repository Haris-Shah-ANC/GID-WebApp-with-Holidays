import TableHeader from "./TableHeader"
import TableRow from "./TableRow"

export default function TimeSheetTable(props) {
    const { columnsList, rowsList } = props

    return (
        <div className='fixTableHead w-full'>
            <table className=" bg-transparent table-auto w-full" >
                <thead className='bg-gray-200 px-10 justify-center items-center'>
                    <TableHeader headerList={columnsList} className={`text-left w-auto pl-3`} labelKey={'field'}></TableHeader>
                </thead>

                <tbody className=" divide-y divide-gray-200" >
                    {
                        rowsList.map((item, index) => {
                            return (
                                <tr key={1} className={"bg-white hover:bg-blue-100"} >
                                    {columnsList.map((cols, i) => {
                                        return <TableRow onItemClick={() => ""} item={item[cols.field] ? item[cols.field] : '  -'} index={index} className={``} />

                                    })}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
