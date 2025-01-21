import CsvDownloader from 'react-csv-downloader';

export const SaveToCSV = ({datas}) => {
    return (
        <div className="saveToCSV">
            <CsvDownloader 
                datas={datas}
                text="Export CSV"
                filename={`overtime_`+new Date().toLocaleString()}
                extension=".csv"
                className="btn btn-success"
            />
        </div>
    )
}