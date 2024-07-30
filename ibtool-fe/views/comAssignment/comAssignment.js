$(async() => {
    //com Assigenment data grid
    const comAssignement = $('#comAssigenement').dxDataGrid({
        dataSource: await getNotAssignedCOM(),
        columnsAutoWidth: true,
        allowColumnResizing: true,
        keyExpr: '_id',
        columns: [{
                dataField: 'ID',
                caption: 'Complaint',
                editorType: 'dxTextBox',
                dataType: "string",
                allowEditing: false,
                cellTemplate: function(element, info) {
                    element.append("<a href='/views/detail-pages/com-detail-page/com-detail-html.html?com_id=" + info.text + "'>" + info.text + "</a>");
                }
            },
            {
                dataField: 'COM Issue Description (Full) Markdown',
                caption: 'Issue Summary',
                editorType: 'dxTextBox',
                dataType: "string",
                editorOptions: {
                    autoResizeEnabled: true,
                },
                width: 600,
            }, {
                dataField: 'Analysis Status',
                editorType: 'dxSelectBox',
                dataType: "string",
                //filterValue: "Not Assigned",
                lookup: {
                    dataSource: Analysis_Status,
                },
                validationRules: [{
                    type: 'required',
                    message: 'Please Change Analysis Status to To Be Assigned',
                }],
            },
            {
                dataField: 'Customer',
                editorType: 'dxTextBox',
                dataType: "string",
                allowEditing: true,
            },
            {
                dataField: 'Customer Country',
                caption: 'Country',
                editorType: 'dxTextBox',
                dataType: "string",
                allowEditing: false,
            },
            {
                dataField: 'Analysis Owner',
                editorType: 'dxSelectBox',
                dataType: "string",
                allowEditing: true,
                lookup: {
                    dataSource: Analysis_Owner,
                },
            },
            {
                dataField: 'Priority',
                editorType: 'dxSelectBox',
                dataType: "string",
                allowEditing: true,
                lookup: {
                    dataSource: priority,
                },
            },
            {
                dataField: 'Application_Feature',
                caption: 'Application/Feature',
                dataType: "string",
                lookup: {
                    dataSource: new DevExpress.data.ArrayStore({
                        data: app_feature,
                        key: 'ID',
                    }),
                    displayExpr: 'Name',
                    valueExpr: 'Name',
                },
            },
            {
                dataField: 'Investigation Team',
                caption: 'Investigation Team',
                dataType: "string",
                lookup: {
                    dataSource: Investigation_Team,
                },
                validationRules: [{
                    type: 'required',
                    message: 'Investigation team is required',
                }],

            },
            {
                dataField: 'Type',
                visible: false,
            }
        ],
        showBorders: true,
        showColumnLines: true,
        editing: {
            mode: 'row',
            allowUpdating: true,
        },
        onRowUpdating(e) {
            const change = e.newData;
            const key = e.key;
            fetch(`${localStorage.getItem('backEndIP')}/comassign/${key}`, {
                    method: 'POST', // or 'PUT'
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(change),
                })
                .then(response => response.json())
                .then(result => {
                    console.log('Success:', result);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        },
    }).dxDataGrid('instance')
});