window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);

$(async() => {
    //Get the access level from the user SSO
    const user = await getUserData(localStorage.getItem('CURRENT_USER_SSO'));
    var userAccessLevel = user.AccessLevel;
    console.log("Access Level ", userAccessLevel);
    //Function for sorting used for COM and CSO Age
    const numericSorting = function(value1, value2) {
        if (!value1 && value2) return -1;
        if (!value1 && !value2) return 0;
        if (value1 && !value2) return 1;

        if (parseInt(value1) > parseInt(value2)) return 1;
        if (parseInt(value1) < parseInt(value2)) return -1;

        return 0;
    };
    if (fields === undefined)
    {
      await buildFields();
    }    
    $('#filterBuilder').dxFilterBuilder({
        fields,
    });

    //Apply button to Filter dataGrid
    const apply = $('#apply').dxButton({
        text: 'Filter',
        type: 'default',
        useSubmitBehavior: true,
        onClick() {
            const filter = $('#filterBuilder').dxFilterBuilder('instance').option('value');
            $('#cso-com-list').dxDataGrid('instance').option('filterValue', filter);
        },
    }).dxButton('instance');


    //com/cso list data grid
    const cso_com_list = $('#cso-com-list')
        .dxDataGrid({
            dataSource: await getCOMCSOList(),
            keyExpr: '_id',
            columnsAutoWidth: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            showColumnLines: true,
            //columnWidth: 200,

            showBorders: true,
            //filterSyncEnabled: true,
            paging: {
                pageSize: 50,
            },
            pager: {
                visible: true,
                allowedPageSizes: [50, 100, 150, 200, 'all'],
                showPageSizeSelector: true,
                showInfo: true,
                showNavigationButtons: true,
            },
            editing: {
                mode: 'row',
                allowUpdating: true,
            },
            columnChooser: {
                mode: 'select',
                enabled: true,
                height: 800,
            },
            filterRow: {
                visible: true,
                //applyFilter: 'auto',
            },
            filterPanel: {
                visible: false
            },
            headerFilter: {
                visible: true,
                //applyFilter: 'auto',
            },
            searchPanel: {
                id: "com-cso-grid-search",
                visible: true,
                width: 400,
                //text: localStorage.getItem('csoComSearchText'),
                placeholder: 'Search...',
                highlightSearchText: true,
                highlightCaseSensitive: false,
            },
            stateStoring: {
                enabled: true,
                type: 'localStorage',
                storageKey: 'csoComSearchText33',
            },

            //Data grid Excel export
            export: {
                enabled: true,
            },
            onExporting(e) {
                const workbook = new ExcelJS.Workbook()
                const worksheet = workbook.addWorksheet('COM_CSO List')

                DevExpress.excelExporter
                    .exportDataGrid({
                        component: e.component,
                        worksheet,
                    })
                    .then(() => {
                        workbook.xlsx.writeBuffer().then((buffer) => {
                            saveAs(
                                new Blob([buffer], { type: 'application/octet-stream' }),
                                'COM_CSO_List.xlsx',
                            )
                        })
                    })
                e.cancel = true
            },
            //data grid columns
            columns: [{
                    dataField: 'ID',
                    caption: 'COM ID',
                    dataType: "string",
                    allowEditing: false,
                    allowHeaderFiltering: false,
                    cellTemplate: function(element, info) {
                        element.append("<a href='/views/detail-pages/com-detail-page/com-detail-html.html?com_id=" + info.text + "'>" + info.text + "</a>");
                    }
                },
                {
                    dataField: 'Case Number',
                    caption: 'CSO ID',
                    dataType: "string",
                    allowHeaderFiltering: false,
                    allowEditing: false,
                    cellTemplate: function(element, info) {
                        element.append("<a href='/views/detail-pages/cso-detail-page/cso-detail-html.html?cso_id=" + info.text + "'>" + info.text + "</a>");
                    }
                },
                {
                    dataField: 'Priority',
                    caption: 'Priority',
                    dataType: "string",
                    allowSearch: false,
                    lookup: {
                        dataSource: priority,
                    },
                },
                {
                    dataField: 'COM_Age',
                    caption: 'COM_Age',
                    allowEditing: false,
                    allowHeaderFiltering: false,
                    dataType: 'number',
                    alignment: 'left',
                    allowSorting: true,
                    sortingMethod: numericSorting,
                    calculateCellValue(data) {
                        if (data["ID"] != null) {
                            if (data["Analysis Status"] != "Closed" && data["Analysis Status"] != "Cancelled" &&
                            data["Analysis Status"] != "Duplicate" && data["Analysis Status"] != "Transferred") {
                                var date1 = new Date(data["Date First Active"]);
                                var date2 = new Date();
                                let difference = date2.getTime() - date1.getTime();
                                let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                                return [
                                    TotalDays,
                                ];
                            }
                            else {
                                var date1 = new Date(data["Date First Active"]);
                                var date2 = new Date(data["Date Closed"]);
                                let difference = date2.getTime() - date1.getTime();
                                let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                                return [
                                    TotalDays,
                                ];
                            }
}
                    },
                    cellTemplate: function(element, info) {
                        if (info.text >= 70) {
                            element.append("<div style='font-weight: bold;color: red'>" + info.text + "</div>");
                        } else {
                            element.append("<div style='color: black'>" + info.text + "</div>");
                        }
                    }
                },
                {
                    dataField: 'SPCR_Age',
                    caption: 'SPCR Age',
                    dataType: "number",
                    allowHeaderFiltering: false,
                    allowEditing: false,
                    allowSearch: true,
                    alignment: 'left',
                    visible: false,
                    sortingMethod: numericSorting,
                    calculateCellValue(data) {
                        if (data["ID"] != null && data["Task State"] != ("Resolved-Closed" || "Resolved-Cancelled")) {
                            var date1 = new Date(data["Date Task Created"]);
                            var date2 = new Date();
                            let difference = date2.getTime() - date1.getTime();
                            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                            return [
                                TotalDays,
                            ];
                        }
                        if (data["ID"] != null && data["Task State"] == ("Resolved-Closed" || "Resolved-Cancelled")) {
                            var date1 = new Date(data["Date Task Created"]);
                            var date2 = new Date(data["Date Task Submitted"]);
                            let difference = date2.getTime() - date1.getTime();
                            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                            return [
                                TotalDays,
                            ];
                        }
                    },
                    cellTemplate: function(element, info) {
                        if (info.text >= 70) {
                            element.append("<div style='font-weight: bold;color: red'>" + info.text + "</div>");
                        } else {
                            element.append("<div style='color: black'>" + info.text + "</div>");
                        }
                    }
                },
                {
                    dataField: 'CSO_Age',
                    caption: 'CSO_Age',
                    dataType: "number",
                    allowEditing: false,
                    allowHeaderFiltering: false,
                    alignment: 'left',
                    sortingMethod: numericSorting,
                    calculateCellValue(data) {
                        //Compute CSOAge from CSO_Status
                        if (data["Case Number"] != null){

                            if ((data["CSO_Status"] != "CLOSED") && (data["CSO_Status"] != "CANCELLED")){
                                var date1 = new Date(data["Date/Time Opened"]);
                                var date2 = new Date();
                                let difference = date2.getTime() - date1.getTime();
                                let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                                return [
                                    TotalDays.toString(),
                            ];
                            }

                            else {
                                var date1 = new Date(data["Date/Time Opened"]);
                                var date2 = new Date(data["Date/Time Closed"]);
                                let difference = date2.getTime() - date1.getTime();
                                let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                                return [
                                    TotalDays.toString(),
                                ];
                            }
                        }
                    },
                    cellTemplate: function(element, info) {
                        if (info.text >= 70) {
                            element.append("<div style='font-weight: bold;color: red'>" + info.text + "</div>");
                        } else {
                            element.append("<div style='color: black'>" + info.text + "</div>");
                        }
                    }
                },
                {
                    dataField: 'Customer Country',
                    caption: 'Country',
                    allowEditing: false,
                    dataType: "string",
                },
                {
                    dataField: "Application_Feature",
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
                    allowSearch: true,
                },
                {
                    dataField: 'Analysis Status',
                    caption: 'Analysis Status',
                    //different status colors
                    dataType: "string",
                    cellTemplate: function(element, info) {
                        switch (info.text) {
                            case ("To Start"):
                                element.append("<div style='font-weight: bold;color: magenta'>" + info.text + "</div>");
                                break;
                            case ("Continue Analysis"):
                                element.append("<div style='font-weight: bold;color: orange'>" + info.text + "</div>");
                                break;
                            case ("Waiting For Other Modality Support"):
                                element.append("<div style='font-weight: bold;color: PaleVioletRed'>" + info.text + "</div>");
                                break;
                            case ("Waiting For Field Information"):
                                element.append("<div style='font-weight: bold;color: RosyBrown'>" + info.text + "</div>");
                                break;
                            case ("SPCR To Close"):
                                element.append("<div style='font-weight: bold;color: green'>" + info.text + "</div>");
                                break;
                            case ("To Be Assigned"):
                                element.append("<div style='font-weight: bold;color: BlueViolet'>" + info.text + "</div>");
                                break;
                            case ("Not owner"):
                                element.append("<div style='font-weight: bold;color: red'>" + info.text + "</div>");
                                break;
                            case ("Transferred"):
                                element.append("<div style='font-weight: bold;color: MediumTurquoise'>" + info.text + "</div>");
                                break;
                            case ("Cancelled"):
                                element.append("<div style='font-weight: bold;color: FireBrick'>" + info.text + "</div>");
                                break;
                            case ("Duplicate"):
                                element.append("<div style='font-weight: bold;color: DarkGoldenRod'>" + info.text + "</div>");
                                break;
                            case ("Closed"):
                                element.append("<div style='font-weight: bold;color: Olive'>" + info.text + "</div>");
                                break;
                            case ("SPCR To Close"):
                                element.append("<div style='font-weight: bold;color: green'>" + info.text + "</div>");
                                break;
                            case ("SPR (For RDB Enter)"):
                                element.append("<div style='font-weight: bold;color: SlateGrey'>" + info.text + "</div>");
                                break;
                            case ("On Hold"):
                                element.append("<div style='font-weight: bold;color: OrangeRed'>" + info.text + "</div>");
                                break;
                            case ("Waiting For Team Information"):
                                element.append("<div style='font-weight: bold;color: CadetBlue'>" + info.text + "</div>");
                                break;
                            case ("-"):
                                element.append("<div style='font-weight: bold;color: black'>" + info.text + "</div>");
                                break;
                            default:
                                element.append("<div style='font-weight: bold;color: black'>" + info.text + "</div>");
                        }
                    },
                    lookup: {
                        dataSource: Analysis_Status,
                    },
                    allowSearch: true,
                },
                {
                    dataField: "CSO_Status",
                    caption: 'CSO Status',
                    dataType: "string",
                    lookup: {
                        dataSource: CSO_Status,
                    },
                    allowSearch: true,
                },

                {
                    dataField: 'Date Created',
                    caption: 'Last Action Date',
                    dataType: 'date',
                },
                {
                    dataField: 'Customer Temperature',
                    caption: 'Temperature',
                    dataType: "string",
                    allowEditing: false,
                    cellTemplate: function(element, info) {
                        switch (info.text) {
                            case ("Red"):
                                element.append("<div style='font-weight: bold;color: red'>" + info.text + "</div>");
                                break;
                            case ("Yellow"):
                                element.append("<div style='font-weight: bold;color: gold'>" + info.text + "</div>");
                                break;
                            case ("Green"):
                                element.append("<div style='font-weight: bold;color: green'>" + info.text + "</div>");
                                break;
                        }
                    }
                },
                {
                    dataField: 'Analysis Owner',
                    caption: 'Owner',
                    dataType: 'string',
                    allowFiltering: true,
                    lookup: {
                        dataSource: Analysis_Owner,
                    },
                    allowSearch: true,
                },
                {
                    dataField: 'Search key',
                    caption: 'Search key',
                    dataType: "string",
                },
                {
                    dataField: 'CSO Issue Summary Markdown',
                    caption: 'CSO Issue summary',
                    visible: false,
                    dataType: "string",
                    width: 320,
                },
                {
                    dataField: 'COM Issue Summary Markdown',
                    caption: 'COM Issue summary',
                    visible: false,
                    dataType: "string",
                    width: 320,
                },
                {
                    dataField: 'Type',
                    caption: 'Type',
                    visible: false,
                    allowEditing: false,
                    dataType: "string",
                    lookup: {
                        dataSource: Type,
                    },
                },
                {
                    dataField: 'Author',
                    caption: 'Author',
                    dataType: "string",
                    visible: false,
                    allowEditing: false,
                },
                {
                    dataField: 'Request Category',
                    caption: 'Request Category',
                    dataType: "string",
                    visible: false,
                    allowEditing: false,
                },
                {
                    dataField: 'Device Identification Number',
                    caption: 'System ID',
                    dataType: "string",
                    visible: false,
                    allowEditing: false,
                },
                {
                    dataField: 'Software Version',
                    caption: 'Software Version',
                    dataType: "string",
                    visible: false,
                    allowEditing: false,
                },
                {
                    dataField: 'Integration_mode',
                    caption: 'Integration_mode',
                    dataType: "string",
                    visible: false,
                    lookup: {
                        dataSource: Integration_mode,
                    }
                },
                {
                    dataField: 'Customer',
                    caption: 'Site',
                    dataType: "string",
                    visible: false,
                    allowEditing: false,
                },
                {
                  dataField: 'PO Review',
                  visible: false,
              },
                {
                    dataField: 'Status',
                    caption: 'SFDC status',
                    dataType: "string",
                    visible: false,
                    allowEditing: false,
                    lookup: {
                        dataSource: SFDC_Status,
                    }
                },
                {
                  dataField: 'PQM Status',
                  caption: 'PQM Status',
                  dataType: "string",
                  visible: false,
                  allowEditing: false,
                  lookup: {
                      dataSource: SFDC_Status,
                  }
              },
                {
                    dataField: 'Investigation Team',
                    caption: 'Investigation Team',
                    dataType: "string",
                    allowSearch: true,
                    lookup: {
                        dataSource: Investigation_Team,
                    },
                    visible: false,
                },

                {
                    dataField: 'Previous action',
                    caption: 'Next_Action',
                    dataType: "string",
                    allowSearch: true,
                    allowEditing: true,
                    visible: false,
                },

                {
                    dataField: 'Platform_Release',
                    dataType: "string",
                      allowEditing: true,
                      visible: false,
                      lookup: {
                        dataSource: Platform_Release,
                    },
                  },
            ],
            //row detail 
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    const detail = options.data
                    $('<div>')
                        .addClass('master-detail-caption')
                        .text('Issue summary:')
                        .appendTo(container)
                    container.append($(`<p>${detail['COM Issue Summary']}</p>`));
                    container.append($(`<p>${detail['CSO Issue Summary']}</p>`));
                    $('<div>')
                        .addClass('master-detail-caption')
                        .text('CSO Issue summary:')
                        .appendTo(container)
                    container.append($(`<p>${detail['Associated CSO Summary']}</p>`));
                    $('<div>')
                        .addClass('master-detail-caption')
                        .text('Investigation Reference Rationale(Full):')
                        .appendTo(container)
                    container.append($(`<p>${detail['Investigation Reference Rationale(Full)']}</p>`));
                    $('<div>')
                        .addClass('master-detail-caption')
                        .text('Reason of closure :')
                        .appendTo(container)
                    container.append($(`<p>${detail['Reason Of Closure']}</p>`));
                    $('<div>')
                        .addClass('master-detail-caption')
                        .text('Workaround :')
                        .appendTo(container)
                    container.append($(`<p>${detail['Workaround']}</p>`));
                },
            },
            //data grid toolbar
            toolbar: {
                items: [
                    'groupPanel',
                    {
                        text: 'Complaint/CSO List',
                        location: 'before',
                        cssClass: "text-primary",
                    },
                    {
                        text: 'Show All Records',
                        location: 'after',
                        cssClass: "expand-collapse",
                    },
                    {
                        widget: 'dxSwitch',
                        location: 'after',
                        value: false,
                        options: {
                            onValueChanged: async function(e) {
                                const newValue = e.value;
                                if (e.value) {
                                    const allrecords = await getAllRecords();
                                    cso_com_list.option("dataSource", allrecords);
                                } else if (!e.value) {
                                    const openrecords = await getCOMCSOList();
                                    cso_com_list.option("dataSource", openrecords);
                                }
                            }
                        },
                    },
                    {
                        text: 'Clear All Filters',
                        location: 'after',
                        cssClass: "expand-collapse",
                    }, {
                        widget: 'dxButton',
                        location: 'after',
                        options: {
                            icon: 'clearformat',
                            onClick() {
                                cso_com_list.clearFilter();
                            },
                        },
                    },
                    {
                        text: 'Show/Hide Details',
                        location: 'after',
                        cssClass: "expand-collapse",
                    },
                    {
                        widget: 'dxSwitch',
                        location: 'after',
                        value: false,
                        options: {
                            onValueChanged: function(e) {
                                const newValue = e.value;
                                if (e.value) {
                                    cso_com_list.expandAll(-1);
                                } else if (!e.value) {
                                    cso_com_list.collapseAll(-1);
                                }
                            }
                        },
                    },
                    //data grid pdf export
                    {
                        widget: 'dxButton',
                        location: 'after',
                        options: {
                            icon: 'exportpdf',
                            onClick() {
                                const doc = new jsPDF({
                                    orientation: "landscape",
                                });
                                DevExpress.pdfExporter.exportDataGrid({
                                    jsPDFDocument: doc,
                                    component: cso_com_list,
                                    customizeCell: function(options) {
                                        const { gridCell, pdfCell } = options;
                                        if (gridCell.rowType === 'data') {
                                            pdfCell.wordWrapEnabled = true;
                                        }
                                    }
                                }).then(() => {
                                    doc.save('Com_CSO_List.pdf');
                                });
                            },
                        },
                    },
                    'exportButton',
                    'columnChooserButton',
                    'searchPanel',
                ],
            },
            onRowUpdating(e) {
                const change = e.newData;
                const key = e.key;
                fetch(`${localStorage.getItem('backEndIP')}/comcsolist/${key}`, {
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
        })
        .dxDataGrid('instance');
    
        //Set some components to read only according to the profile
    if (userAccessLevel != "IB"){
       console.log("User Access Level: ", userAccessLevel);
       cso_com_list.option("editing.allowUpdating", false);
    }
});