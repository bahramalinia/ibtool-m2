window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
$(async() => {
    const numericSorting = function(value1, value2) {
        if (!value1 && value2) return -1;
        if (!value1 && !value2) return 0;
        if (value1 && !value2) return 1;

        if (parseInt(value1) > parseInt(value2)) return 1;
        if (parseInt(value1) < parseInt(value2)) return -1;

        return 0;
    };

    const dataGrid = $('#my-analysis')
        .dxDataGrid({
            dataSource: await getMyAnalysis(),
            keyExpr: '_id',
            columnsAutoWidth: true,
            allowColumnResizing: true,
            allowColumnReordering: true,
            showColumnLines: true,
            showBorders: false,
            filterSyncEnabled: true,
            paging: {
                pageSize: 50,
            },
            stateStoring: {
                enabled: true,
                type: 'localStorage',
                storageKey: 'my_analysis',
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
                refreshMode: "repaint",
            },
            columnChooser: {
                enabled: true,
                mode: 'select',
                height: 800,
            },
            filterRow: {
                visible: true,
                //applyFilter: 'auto',
            },
            filterPanel: {
                visible: true
            },
            searchPanel: {
                visible: true,
                width: 400,
                placeholder: 'Search...',
                highlightSearchText: true,
                highlightCaseSensitive: false,
            },
            headerFilter: {
                visible: true,
            },
            groupPanel: {
                visible: true,
            },
            grouping: {
                autoExpandAll: false,
            },
            export: {
                enabled: true,
            },
            onExporting(e) {
                const workbook = new ExcelJS.Workbook()
                const worksheet = workbook.addWorksheet('Analyse')

                DevExpress.excelExporter
                    .exportDataGrid({
                        component: e.component,
                        worksheet,
                    })
                    .then(() => {
                        workbook.xlsx.writeBuffer().then((buffer) => {
                            saveAs(
                                new Blob([buffer], { type: 'application/octet-stream' }),
                                'Analyse.xlsx',
                            )
                        })
                    })
                e.cancel = true
            },

            columns: [{
                    dataField: 'ID',
                    caption: 'COM ID',
                    dataType: "string",
                    allowEditing: false,
                    cellTemplate: function(element, info) {
                        element.append("<a href='/views/detail-pages/com-detail-page/com-detail-html.html?com_id=" + info.text + "'>" + info.text + "</a>");
                    }
                },
                {
                    dataField: 'Case Number',
                    caption: 'CSO ID',
                    dataType: "string",
                    allowEditing: false,
                    cellTemplate: function(element, info) {
                        element.append("<a href='/views/detail-pages/cso-detail-page/cso-detail-html.html?cso_id=" + info.text + "'>" + info.text + "</a>");
                    }
                },
                {
                    dataField: 'Priority',
                    caption: 'Priority',
                    dataType: "string",
                    lookup: {
                        dataSource: priority,
                    },
                    allowSearch: true,
                },
                {
                    dataField: 'COM_Age',
                    caption: 'COM Age',
                    dataType: "number",
                    allowHeaderFiltering: false,
                    allowEditing: false,
                    allowSearch: true,
                    alignment: 'left',
                    sortingMethod: numericSorting,
                    calculateCellValue(data) {
                        if (data["ID"] != null){
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
                    caption: 'CSO Age',
                    allowEditing: false,
                    dataType: "number",
                    allowSearch: true,
                    allowHeaderFiltering: false,
                    alignment: 'left',
                    sortingMethod: numericSorting,
                    calculateCellValue(data) {
                        if (data["Case Number"] != null){
                            if (data["CSO_Status"] != "CLOSED" && data["CSO_Status"] != "CANCELLED") {
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
                    caption: "Country",
                    dataType: "string",
                    allowEditing: false,
                },
                {
                    dataField: 'Application_Feature',
                    caption: "Application/Feature",
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
                    dataField: 'Last_Action_Date',
                    caption: 'Last Action Date',
                    dataType: 'date',
                    visible: false,
                },
                {
                    dataField: 'Search key',
                    caption: 'Search key',
                    dataType: 'string',
                },
                {
                    dataField: 'CSO Issue Summary Markdown',
                    caption: 'CSO Issue summary',
                    dataType: 'String',
                    visible: false,
                    width: 320,
                },
                {
                    dataField: 'COM Issue Summary Markdown',
                    caption: 'COM Issue summary',
                    dataType: 'string',
                    visible: false,
                    width: 320,
                },
                {
                    dataField: 'Type',
                    caption: 'Type',
                    dataType: 'string',
                    lookup: {
                        dataSource: Type,
                    },
                    visible: false,
                    allowEditing: false,
                },
                {
                    dataField: 'Hazardous or Potentially Haz?',
                    caption: 'Haz',
                    dataType: 'string',
                    lookup: { dataSource: Hazard_Decision, },
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
                  dataField: 'PO Review',
                  visible: false,
              },
                {
                    dataField: 'CSO Account Name',
                    caption: 'CSO Account Name',
                    dataType: "string",
                    visible: false,
                },
                {
                    dataField: 'Customer Temperature',
                    caption: 'Temperature',
                    dataType: 'string',
                    visible: false,
                    allowEditing: false,
                    lookup: { dataSource: Temperature },
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
            ],

            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    const detail = options.data
                    $('<div>')
                        .addClass('master-detail-caption')
                        .text('Complaint/CSO Issue summary:')
                        .appendTo(container)
                    container.append($(`<p>${detail['COM Issue Summary']}</p>`));
                    if (detail['Associated_to_CSO'] == 'Yes') {
                        container.append($(`<p>${detail['CSO Issue Summary']}</p>`));
                        // container.append($(`<p>${detail['Associated CSO Summary']}</p>`));
                    }
                },
            },
            toolbar: {
                items: [
                    'groupPanel',
                    {
                        text: 'My Analysis',
                        location: 'before',
                        cssClass: "text-primary",
                    },
                    {
                        text: 'Clear All Filters',
                        location: 'after',
                        cssClass: "expand-collapse",
                    },
                    {
                        widget: 'dxButton',
                        location: 'after',
                        options: {
                            icon: 'clearformat',
                            onClick() {
                                dataGrid.clearFilter();
                            },
                        },
                    },
                    {
                        text: 'Show/Hide details',
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
                                    dataGrid.expandAll(-1);
                                } else if (!e.value) {
                                    dataGrid.collapseAll(-1);
                                }
                            }
                        },
                    },
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
                                    component: dataGrid,
                                    customizeCell: function(options) {
                                        const { gridCell, pdfCell } = options;
                                        if (gridCell.rowType === 'data') {
                                            pdfCell.wordWrapEnabled = true;
                                        }
                                    }
                                }).then(() => {
                                    doc.save('MyAnalysis.pdf');
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
                fetch(`${localStorage.getItem('backEndIP')}/analyseupdate/${key
                    }`, {
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
            onRowPrepared(e) {
              const lastActionDate = e.data && e.data.Last_Action_Date;
              if (lastActionDate) {
                  const today = new Date();
                  const lastActionDateObj = new Date(lastActionDate);
                  const daysDifference = Math.floor((today - lastActionDateObj) / (1000 * 60 * 60 * 24)); // Calculate difference in days
                  
                  if (daysDifference > 21) {
                      e.rowElement.css('background-color', 'rgba(255, 0, 0, 0.3)'); // If more than 3 weeks ago, change to red
                  } else if (daysDifference > 14) {
                      e.rowElement.css('background-color', 'rgba(255, 165, 0, 0.3)'); // If more than 2 weeks ago, change to orange
                  } else if (daysDifference > 7) {
                      e.rowElement.css('background-color', 'rgba(255, 255, 0, 0.2)'); // If more than 1 week ago, change to light yellow
                  }
              }
          },                
        })
        .dxDataGrid('instance')

    var Totalhaz = 0;
    var HazInternal = 0;
    var all_cso = 0;
    var red_cso = 0;
    var sensitive = 0;
    var all_complaints = 0;
    var Other_CSOs = 0;
    var HazPQM = 0;
    var Old_CSOs = 0;
    var Old_Complaints = 0;
    var Other_Complaints = 0;
    for (i = 0; i < dataGrid.option().dataSource.length; i++) {
        if (dataGrid.option().dataSource[i]["Hazardous or Potentially Haz?"] === "Yes") {
            Totalhaz++;
        }
        if ((dataGrid.option().dataSource[i]["Priority"] === "Potential Safety ? (On assessment") ||
            (dataGrid.option().dataSource[i]["Priority"] === "Potential Regulatory ? (On assessment") ||
            (dataGrid.option().dataSource[i]["Priority"] === "Safety (Confirmed)") ||
            (dataGrid.option().dataSource[i]["Priority"] === "Regulatory (Confirmed)")) {
            HazInternal++;
        }
        if (dataGrid.option().dataSource[i]["Customer Temperature"] === "Red") {
            red_cso++;
        }
        if (dataGrid.option().dataSource[i]["ID"] == null) {
            all_cso++;
        }
        if (
            (dataGrid.option().dataSource[i]["Priority"] === "Sensitive Site") ||
            (dataGrid.option().dataSource[i]["Priority"] === "Urgent")) {
            sensitive++;
        }
        if (dataGrid.option().dataSource[i]["ID"] != null) {
            all_complaints++;
        }
        if ((dataGrid.option().dataSource[i]["Hazardous or Potentially Haz?"] === "Yes")) {
            HazPQM++;
        }
        var date1 = new Date(dataGrid.option().dataSource[i]["Date/Time Opened"]);
        var date3 = new Date(dataGrid.option().dataSource[i]["Date First Active"]);
        var date2 = new Date();
        let difference = date2.getTime() - date1.getTime();
        let difference2 = date2.getTime() - date3.getTime();
        let TotalDays1 = Math.ceil(difference / (1000 * 3600 * 24));
        let TotalDays2 = Math.ceil(difference2 / (1000 * 3600 * 24));
        if (TotalDays1 >= 70) {
            Old_CSOs++;
        }

        if (TotalDays2 >= 45) {
            Old_Complaints++;
        }

        if ((dataGrid.option().dataSource[i]["Customer Temperature"] === "Green") || (dataGrid.option().dataSource[i]["Customer Temperature"] === "Yellow") && (TotalDays1 < 70)) {
            Other_CSOs++;
        }

        if ((dataGrid.option().dataSource[i]["Hazardous or Potentially Haz?"] === "No") && (dataGrid.option().dataSource[i]["Priority"] == null) && (TotalDays2 < 45)) {
            Other_Complaints++;
        }


    }
    var Analysis = dataGrid.option().dataSource.length;
    $("#TotalHaz").text("Total Haz or Potentially Haz. : " + Totalhaz);
    $("#HazPQM").text("Haz. or Potentially Haz. (PQM): " + HazPQM);
    $("#HazInternal").text("Haz. or Potentially Haz. (Internal): " + HazInternal);
    $("#All_CSO").text("Total CSOs : " + all_cso);
    $("#Red_CSO").text("RED CSOs : " + red_cso);
    $("#Old_CSOs").text("Old CSOs : " + Old_CSOs);
    $("#Other_CSOs").text("Other CSOs : " + Other_CSOs);
    $("#All_Complaints").text(" Total Complaints : " + all_complaints);
    $("#Sensitive").text("Sensitive Complaints : " + sensitive);
    $("#Other_Complaints").text("Other Complaints : " + Other_Complaints);
    $("#Old_Complaints").text("Old Complaints : " + Old_Complaints);
    $("#Analysis").text("Analysis : " + Analysis);

    if (userAccessLevel != "IB"){
      console.log("User Access Level: ", userAccessLevel);
      cso_com_list.option("editing.allowUpdating", false);
   }

})