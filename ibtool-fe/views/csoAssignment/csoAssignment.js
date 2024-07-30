$(async() => {
    //cso assignement data grid
    const csoAssignement = $('#csoAssigenement').dxDataGrid({
        dataSource: await getNotAssignedCSO(),
        columnsAutoWidth: true,
        allowColumnResizing: true,
        keyExpr: '_id',
        columns: [{
                dataField: 'Case Number',
                caption: 'CSO Number',
                dataType: "string",
                editorType: 'dxTextBox',
                allowEditing: false,
                cellTemplate: function(element, info) {
                    element.append("<a href='/views/detail-pages/cso-detail-page/cso-detail-html.html?cso_id=" + info.text + "'>" + info.text + "</a>");
                }
            }, {
                dataField: "CSO Issue Description (Full) Markdown",
                editorType: 'dxTextBox',
                dataType: "string",
                editorOptions: {
                    autoResizeEnabled: true,
                },
                width: 600,
            },
            {
                dataField: 'Customer Temperature',
                dataType: "string",
                allowEditing: false,
                caption: "Temperature",
                cellTemplate: function(element, info) {
                    switch (info.text) {
                        case ("Yellow"):
                            element.append("<div style='font-weight: bold;color: goldenrod'>" + info.text + "</div>");
                            break;
                        case ("Red"):
                            element.append("<div style='font-weight: bold;color: red'>" + info.text + "</div>");
                            break;
                        case ("Green"):
                            element.append("<div style='font-weight: bold;color: green'>" + info.text + "</div>");
                            break;
                    }
                }
            },
            {
                dataField: 'Investigation Team',
                caption: 'Investigation Team',
                dataType: "string",
                lookup: {
                    dataSource: Investigation_Team,
                }
            }, {
                dataField: 'CSO Account Name',
                dataType: "string",
                caption: 'Account Name',
            },
            {
                dataField: 'Account Name: Country Name',
                dataType: "string",
                allowEditing: false,
                caption: 'Country',
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
                dataField: "CSO_Status",
                dataType: "string",
                caption: "CSO Status",
                lookup: {
                    dataSource: CSO_Status,
                },
            }, {
                dataField: 'Type',
                dataType: "string",
                visible: false,
            }

        ],
        showBorders: true,
        showColumnLines: true,
        editing: {
            mode: 'row',
            allowUpdating: true,
        },
        selection: {
            mode: 'multiple',
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
    });

});