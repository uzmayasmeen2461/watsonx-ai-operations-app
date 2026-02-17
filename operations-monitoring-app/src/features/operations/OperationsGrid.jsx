// src/features/operations/OperationsGrid.jsx
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'operationId', headerName: 'Operation ID', flex: 1 },
    { field: 'processingState', headerName: 'State', flex: 1 },
    { field: 'priority', headerName: 'Priority', flex: 1 },
    { field: 'sourceSystem', headerName: 'Source System', flex: 1 },
    { field: 'createdDate', headerName: 'Created Date', flex: 1 },
];

const OperationsGrid = ({ rows }) => {
    
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSizeOptions={[5, 10]}
            initialState={{
                pagination: {
                    paginationModel: { pageSize: 5, page: 0 },
                },
            }}
        />
    );
};

export default OperationsGrid;
