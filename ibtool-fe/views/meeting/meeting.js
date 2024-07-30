window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);

function getUrlParameter(sParam) {
    const href = window.location.href;
    let paramValue;
    const idx = href.indexOf(`${sParam}=`);
    paramValue = href.substring(idx + sParam.length + 1);
    return paramValue;
};

$(async() => {

    const numericSorting = function(value1, value2) {
        if (!value1 && value2) return -1;
        if (!value1 && !value2) return 0;
        if (value1 && !value2) return 1;

        if (parseInt(value1) > parseInt(value2)) return 1;
        if (parseInt(value1) < parseInt(value2)) return -1;

        return 0;
    };

    $('#longtabs > .tabs-container').dxTabs({
        dataSource: await buildTabs(localStorage.getItem('CURRENT_USER_SSO')),
        scrollingEnabled: true,
        scrollByContent: true,
        showNavButtons: true,
        selectedIndex: 0,
        onItemClick(e) {
            switch (e.itemIndex) {
                case (0):
                    {
                        $('#container-fluid-agenda').get(0).style.display = 'block';
                        $('#container-fluid-meeting').get(0).style.display = 'none';
                        $('#container-fluid-minutes').get(0).style.display = 'none';
                        break;
                    }
                case (1):
                    {
                        $('#container-fluid-agenda').get(0).style.display = 'none';
                        $('#container-fluid-meeting').get(0).style.display = 'none';
                        $('#container-fluid-minutes').get(0).style.display = 'block';
                        break;
                    }
                default:
                    {
                        $('#container-fluid-agenda').get(0).style.display = 'none';
                        $('#container-fluid-meeting').get(0).style.display = 'block';
                        $('#container-fluid-minutes').get(0).style.display = 'none';
                        handlePagination();
                    }
            }
        },
    }).dxTabs('instance');
    // fields is computed asynchronously and might not be ready yet
    let retry = 3;
    while ((fields === undefined || fields === null) && retry > 0) {
      retry--;
      console.log('Waiting for fields to be computed...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    // build 
    const filterbuilder = $('#filterBuilder').dxFilterBuilder({
        fields,
        value: filter,
        customOperations: [{
            name: 'anyof',
            caption: 'Is any of',
            icon: 'check',
            editorTemplate(conditionInfo) {
                console.log("conditionInfo", conditionInfo)
                return $('<div>').dxTagBox({
                    value: conditionInfo.value,
                    items: conditionInfo.field.lookup.dataSource,
                    onValueChanged(e) {
                        conditionInfo.setValue(e.value && e.value.length ? e.value : null);
                    },
                    width: 'auto',
                });
            },
        }],
    }).dxFilterBuilder('instance');


    const apply = $('#apply').dxButton({
        text: 'Filter',
        type: 'default',
        useSubmitBehavior: true,
        onClick() {
            const filter = $('#filterBuilder').dxFilterBuilder('instance').option('value');
            $('#agenda-grid-container').dxDataGrid('instance').option('filterValue', filter);
            dataGrid.selectAll();
        },
    }).dxButton('instance');

    const dataGrid = $('#agenda-grid-container')
        .dxDataGrid({
            dataSource: await getMeetingList(),
            keyExpr: '_id',
            columnsAutoWidth: true,
            allowColumnResizing: true,
            allowColumnReordering: true,
            showBorders: true,
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'always',
            },
            paging: {
                pageSize: 10,
            },
            pager: {
                visible: true,
                allowedPageSizes: [20, 30, 50, 'all'],
                showPageSizeSelector: true,
                showInfo: true,
                showNavigationButtons: true,
            },
            /* stateStoring: {
                enabled: true,
                type: 'localStorage',
                storageKey: 'agenda-selection',
            }, */
            columnChooser: {
                enabled: true,
                mode: 'select',
                height: 800,
            },
            filterRow: {
                visible: true,
                applyFilter: 'auto',
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

            export: {
                enabled: true,
                // allowExportSelectedData: true,
            },
            onExporting(e) {
                const workbook = new ExcelJS.Workbook()
                const worksheet = workbook.addWorksheet('Analyse')

                DevExpress.excelExporter
                    .exportDataGrid({
                        component: e.component,
                        worksheet,
                        autoFilterEnabled: true,
                        selectedRowsOnly: true,
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
                    caption: 'COM',
                    cellTemplate: function(element, info) {
                        element.append("<a href='/views/detail-pages/com-detail-page/com-detail-html.html?com_id=" + info.text + "'>" + info.text + "</a>");
                    }
                },
                {
                    dataField: 'Case Number',
                    caption: 'CSO',
                    cellTemplate: function(element, info) {
                        element.append("<a href='/views/detail-pages/cso-detail-page/cso-detail-html.html?cso_id=" + info.text + "'>" + info.text + "</a>");
                    }
                },
                {
                    dataField: 'Priority',
                    caption: 'Priority',
                    lookup: {
                        dataSource: priority,
                    },
                },
                {
                    dataField: 'COM_Age',
                    caption: 'COM Age',
                    dataType: "number",
                    allowHeaderFiltering: false,
                    allowEditing: false,
                    alignment: 'left',
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
                    caption: 'CSO Age',
                    allowEditing: false,
                    allowHeaderFiltering: false,
                    dataType: "number",
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

                                    else{
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
                },
                {
                    dataField: 'Application_Feature',
                    lookup: {
                        dataSource: new DevExpress.data.ArrayStore({
                            data: app_feature,
                            key: 'ID',
                        }),
                        displayExpr: 'Name',
                        valueExpr: 'Name',
                    }
                },
                {
                    dataField: 'Analysis Status',
                    lookup: {
                        dataSource: Analysis_Status,
                    },
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
                },
                {
                    dataField: 'Last_Action_Date',
                    caption: 'Last Action Date',
                    dataType: 'date',
                },
                {
                    dataField: 'Analysis Owner',
                },
                {
                    dataField: 'Search_key',
                    caption: 'Search key',
                },
                {
                    dataField: 'CSO Issue Summary Markdown',
                    caption: 'CSO Issue summary',
                    visible: false,
                },
                {
                  dataField: 'Hazardous or Potentially Haz?',
                  caption: 'Hazardous or Potentially Haz?',
                  visible: false,
              },
                {
                    dataField: 'Investigation Team',
                    visible: false,
                },
                {
                  dataField: 'PO Review',
                  visible: false,
              },
                {
                    dataField: 'COM Issue Summary Markdown',
                    caption: 'COM Issue summary',
                    visible: false,
                },
                {
                    dataField: 'Type',
                    caption: 'Type',
                    visible: false,
                },
                {
                    dataField: 'CSO_Internal_Meeting',
                    visible: false,
                },
                {
                    dataField: 'CSO_Alert_Flag',
                    visible: false,
                },
                {
                    dataField: 'CSO Region',
                    visible: false,
                },
                {
                    dataField: 'Account Name: Country Name',
                    caption: 'SFDC Account Country',
                    visible: false,
                }, {
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
                {
                    dataField: 'CSO Account Name',
                    caption: 'CSO Account Name',
                    visible: false,
                },
                {
                    dataField: 'Assigned To: Full Name',
                    caption: 'Assigned To',
                    visible: false,
                },
                {
                    dataField: 'CSO_Current_Action_Status',
                    caption: 'CSO Current Action Status',
                    visible: false,
                },
                {
                    dataField: 'Priority',
                    caption: 'Priority',
                    visible: false,
                },
                {
                    dataField: 'Customer',
                    caption: 'COM Site',
                    visible: false,
                },
                {
                    dataField: 'System ID/Asset ID',
                    caption: 'System ID',
                    visible: false,
                },
                {
                    dataField: 'CSO_Status',
                    caption: 'CSO Status',
                    visible: false,
                },

            ],

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

                    /* $('<div>')
                        .addClass('master-detail-caption')
                        .text('CSO Issue summary:')
                        .appendTo(container) */
                    //$('<div>').text(detail.COM_Issue).appendTo(container)
                },
            },
            toolbar: {
                items: [
                    'groupPanel',
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
                    'exportButton',

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
                                    selectedRowsOnly: true,
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
                    'columnChooserButton',
                    'searchPanel',
                ],
            },
        })
        .dxDataGrid('instance')

    /////////////////////////////////// build form for new meeting
    // // TODO read all meetings from DB

    let newMeetingName;
    const create_meeting = $('#create-meeting').dxForm({
        labelMode: 'outSide',
        labelLocation: 'Left',
        colCount: 3,
        formData: {},
        items: [{
                dataField: 'Registration_Format',
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: MeetingType,
                },
                validationRules: [{
                    type: 'required',
                    message: 'Registration Format is required',
                }],
            }, {
                dataField: 'Meeting Title',
                editorOptions: {
                    maxLength: 20,
                },
                validationRules: [{
                    type: 'required',
                    message: 'Meeting Title is required',
                }],
            },
            {
                itemType: 'button',
                buttonOptions: {
                    text: 'Create Meeting',
                    type: 'success',
                    useSubmitBehavior: true,
                },
            }, {
                colSpan: 2,
            },
        ],
    }).dxForm('instance');

    $('#form-container1').on('submit', (e) => {
        const infor = create_meeting.option("formData");
        var meetingName = infor["Meeting Title"];
        var Registration_Format = infor.Registration_Format
        const selectedRows = dataGrid.getSelectedRowKeys();
        const expression = JSON.stringify(filterbuilder.getFilterExpression());
        const sso = localStorage.getItem('CURRENT_USER_SSO');
        const obj = {
            expression: expression,
            selectedRows: selectedRows,
            Registration_Format: Registration_Format
        }
        fetch(`${localStorage.getItem('backEndIP')}/addMeeting/${meetingName}/${sso}`, {
                // mode: 'no-cors' // 'cors' by default
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj),
            })
            .then(response => {
                console.log('---- /addMeeting/ response: ', response.json());
            });
        e.preventDefault();
        DevExpress.ui.notify({
            message: "You have created a new meeting",
            position: {
                my: 'center top',
                at: 'center top',
            },
        }, 'success', 1000);

        setTimeout(function() {
            window.location.reload();
        }, 1000);
    });


    $('#switch-off').dxSwitch({
        value: false,
        onValueChanged: function(e) {
            const newValue = e.value;
            if (e.value) {
                // long text
                showinternalhistory.option("visible", true);
                $("#internaltitle").css("display", "block");
                showexternalhistory.option("visible", false);
                $("#externaltitle").css("display", "none");


            } else if (!e.value) {
                // short text
                showinternalhistory.option("visible", false);
                $("#internaltitle").css("display", "none");
                showexternalhistory.option("visible", true);
                $("#externaltitle").css("display", "block");


            }
        }
    });


    const showinternalhistory = $("#showinternalhistory").dxHtmlEditor({
        autoResizeEnabled: true,
        visible: false,
        readOnly: true,
    }).dxHtmlEditor('instance');

    const showexternalhistory = $("#showexternalhistory").dxHtmlEditor({
        value: [],
        autoResizeEnabled: true,
        readOnly: true,
    }).dxHtmlEditor('instance');

    async function handlePagination() {
        const userMeetings = await getUserMeetings(localStorage.getItem('CURRENT_USER_SSO'));

        const meeting_header1 = $('#meeting-header').dxForm({
            labelMode: 'static',
            formData: {},
            items: {},
            //readOnly: true,
            colCount: 8,
        }).dxForm('instance');

        const form_next_action = $('#form-next-action').dxForm({
            colCount: 4,
            labelMode: 'hidden',
            formData: {},
            items: [],
        }).dxForm('instance');

        function getCurrentSelectedMeeting(userMeetings) {
            const currentSelectedTab = $("#longtabs .tabs-container [aria-selected=true] .dx-tab-text").get(0).innerText;
            const m = userMeetings.find(e => e.meetingTitle.toUpperCase() === currentSelectedTab.toUpperCase());
            return m;
        }

        function createPaginationDataSource(userMeetings) {
            const m = getCurrentSelectedMeeting(userMeetings);
            if (m !== undefined) {
                return Array.from({ length: m.RecordIDs.length }, (_, i) => i + 1)
            }
            return [1];
        }

        async function next_action_submit() {
          console.log('---- next_action_submit ----');

          const data = form_next_action.option("formData");
          const body = {
            "Next_Action": data["Next_Action"],
            "Comments": data["Comments"],
            "Analysis Owner": data["Analysis Owner"],
            "Analysis Status": data["Analysis Status"],
            "Next Steps": data["Next Steps"],
            "Alert Escalation": data["Alert Escalation"]
          }
          const btn = form_next_action.getButton('Save');
          console.log('--- buttonww: ', btn);
          form_next_action.getButton('Save').option('disabled', true);

          console.log('--- sending data: ', data);
          fetch(`${localStorage.getItem('backEndIP')}/formupdate/${data._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })
          .then(response => {
            console.log('--- response: ', response);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Success:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
          
          console.log('---- enabling button ----');
          form_next_action.getButton('Save').option('disabled', false);
          return true;
        }
        const next_action_items = [
          [{
            dataField: 'Analysis Owner',
            editorType: 'dxSelectBox',
            colSpan:2,
            editorOptions: {
                searchEnabled: true,
                dataSource: Analysis_Owner,
            },
        },{
          dataField: 'Analysis Status',
          editorType: 'dxSelectBox',
          colSpan: 2,
          editorOptions: {
              searchEnabled: true,
              dataSource: Analysis_Status,
          },
      },
              {
                  dataField: 'Next_Action',
                  editorType: 'dxTextArea',
                  colSpan: 4,
                  editorOptions: {
                      autoResizeEnabled: true,
                      labelMode: "static",
                      stylingMode: "outlined",
                      showClearButton: true,
                  },
              },
              {
                  dataField: 'Comments',
                  editorType: 'dxTextArea',
                  colSpan: 4,
                  editorOptions: {
                      autoResizeEnabled: true,
                      labelMode: "static",
                      showClearButton: true,
                      stylingMode: "outlined",
                  },
              },  
              {
                  itemType: 'button',
                  name: 'Save',
                  colSpan: 4,
                  horizontalAlignment: 'right',
                  buttonOptions: {
                      text: 'Save',
                      type: 'success',
                      useSubmitBehavior: false,
                      onClick: async function(e) {
                        console.log('--- hello3', e);
                         await next_action_submit();
                         DevExpress.ui.notify({
                            message: "Saved",
                            position: {
                                my: 'center bottom',
                                at: 'center bottom',
                            },
                        }, 'success', 1000); 
                      }
                  },
              },
          ],
          [
              {
                  dataField: 'Next_Action',
                  colSpan: 4,
                  editorType: 'dxTextArea',
                  editorOptions: {
                      autoResizeEnabled: true,
                      minHeight: 50,
                      labelMode: "static",
                      showClearButton: true,
                  },
              },
              {
                  dataField: 'Alert Escalation',
                  colSpan: 4,
                  editorType: 'dxTextArea',
                  editorOptions: {
                      autoResizeEnabled: true,
                      minHeight: 50,
                      labelMode: "static",
                      showClearButton: true,
                  },
              },
              {
                  dataField: 'Comments',
                  colSpan: 4,
                  editorType: 'dxTextArea',
                  editorOptions: {
                      autoResizeEnabled: true,
                      minHeight: 50,
                      labelMode: "static",
                      showClearButton: true,
                  },
              },
              {
                  itemType: 'button',
                  name: 'Save',
                  colSpan: 4,
                  horizontalAlignment: 'right',
                  buttonOptions: {
                      text: 'Save',
                      type: 'success',
                      useSubmitBehavior: false,
                      onClick: async function(e) {
                        console.log('--- hello2', e);
                        await next_action_submit();
                        DevExpress.ui.notify({
                           message: "Saved",
                           position: {
                               my: 'center bottom',
                               at: 'center bottom',
                           },
                      }, 'success',1000); }
                  },
              },
          ]
        ];
        const container = $('#demo');
        container.pagination({
            dataSource: createPaginationDataSource(userMeetings),
            // dataSource: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            pageSize: 1,
            callback: async function(data, pagination) {
                const m = getCurrentSelectedMeeting(userMeetings);
                const records = await getRecords(m.RecordIDs);
                function calculateCOMAge(records_history) {
                    if (records_history["ID"] != null){
                        if (records_history["Analysis Status"] != "Closed" && records_history["Analysis Status"] != "Cancelled" &&
                        records_history["Analysis Status"] != "Duplicate" && records_history["Analysis Status"] != "Transferred") {
                        var date1 = new Date(records_history["Date First Active"]);
                        var date2 = new Date();
                        let difference = date2.getTime() - date1.getTime();
                        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                        return [
                            TotalDays,
                        ];
                        }
                        else {
                        var date1 = new Date(records_history["Date First Active"]);
                        var date2 = new Date(records_history["Date Closed"]);
                        let difference = date2.getTime() - date1.getTime();
                        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                        return [
                            TotalDays,
                        ];
                        }
                    }
                };

                function calculateSPCRAge(records_history) {
                    if (records_history["ID"] != null && records_history["Task State"] != ("Resolved-Closed" || "Resolved-Cancelled")) {
                        var date1 = new Date(records_history["Date Task Created"]);
                        var date2 = new Date();
                        let difference = date2.getTime() - date1.getTime();
                        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                        return [
                            TotalDays,
                        ];
                    }
                    if (records_history["ID"] != null && records_history["Task State"] == ("Resolved-Closed" || "Resolved-Cancelled")) {
                        var date1 = new Date(records_history["Date Task Created"]);
                        var date2 = new Date(records_history["Date Task Submitted"]);
                        let difference = date2.getTime() - date1.getTime();
                        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                        return [
                            TotalDays,
                        ];
                    }
                };

                function calculateCSOAge(records_history) {
                    //Compute CSOAge from CSO_Status
                    if (records_history["Case Number"] != null){
            
                        if ((records_history["CSO_Status"] != "CLOSED") && (records_history["CSO_Status"] != "CANCELLED")){
                            var date1 = new Date(records_history["Date/Time Opened"]);
                            var date2 = new Date();
                            let difference = date2.getTime() - date1.getTime();
                            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                            return [
                                TotalDays.toString(),
                        ];
                        }
            
                        else{
                            var date1 = new Date(records_history["Date/Time Opened"]);
                            var date2 = new Date(records_history["Date/Time Closed"]);
                            let difference = date2.getTime() - date1.getTime();
                            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                            return [
                                TotalDays.toString(),
                            ];
                        }
                    }
                  
                }

                records.forEach((record) => {
                  record['COM_Age'] = calculateCOMAge(record);
                  record['CSO_Age'] = calculateCSOAge(record);
                  record['SPCR_Age'] = calculateSPCRAge(record);
                });

                records.sort((record1, record2) => {
                  if (record1['COM_Age'] !== undefined && record2['COM_Age'] !== undefined) {
                    return Number(record2['COM_Age']) - Number(record1['COM_Age']);
                  } else if (record2['CSO_Age'] !== undefined && record1['CSO_Age'] !== undefined) {
                    return Number(record2['CSO_Age']) - Number(record1['CSO_Age']);
                  } else if (record2['SPCR_Age'] !== undefined && record1['SPCR_Age'] !== undefined) {
                    return Number(record2['SPCR_Age']) - Number(record1['SPCR_Age']);
                  }
                  return 0;
                });
                
                let header = {};
                if (records.length > 0) {
                    header = records[0].Type === "Complaint" ? meeting_header[0] : meeting_header[1];
                    body = records[0].Type === "Complaint" ? next_action_items[0] : next_action_items[1];
                }
                const records_history = records[pagination.pageNumber - 1];
                if (records_history.Type == "Complaint") {
                    $("#recordlink").text(records_history.ID);
                    $("#recordlink").attr("href", "/views/detail-pages/com-detail-page/com-detail-html.html?com_id=" + records_history.ID);
                    $("#internaltitle").text('History - '+records_history.ID);
                    $("#internaltitle").css('color','#6022A6');
                    $("#externaltitle").text('External History - '+records_history.ID);
                    $("#externaltitle").css('color','#6022A6');
                }
                if (records_history.Type == "CSO") {
                    $("#recordlink").text(records_history["Case Number"]);
                    $("#recordlink").attr("href", "/views/detail-pages/cso-detail-page/cso-detail-html.html?cso_id=" + records_history["Case Number"]);
                    $("#internaltitle").text('History - '+records_history["Case Number"]);
                    $("#internaltitle").css('color','#6022A6');
                    $("#externaltitle").text('External History - '+records_history["Case Number"]);
                    $("#externaltitle").css('color','#6022A6');
                }
                
                meeting_header1.option("formData", {
                    ...records[pagination.pageNumber - 1],
                });
                if (records_history["Associated_to_CSO"] == "Yes") {
                    console.log("associateeeed shod")
                    const csonumber = records_history["Case Number"];
                    const info = await getCSODetails(csonumber);
                    showinternalhistory.option("value", info["History"]);
                    showexternalhistory.option("value", info["External_History"]);
                } else {
                    showinternalhistory.option("value",
                        records_history["History"]
                    );
                    showexternalhistory.option("value",
                        records_history["External_History"]
                    );
                }

                form_next_action.option("formData", {
                    ...records[pagination.pageNumber - 1],
                });
                meeting_header1.option("items", header);
                form_next_action.option("items", body);
            }
        });
    }

    const Meetings = $('#meetings')
        .dxDataGrid({
            dataSource: [],
            keyExpr: '_id',
            showBorders: true,
            editing: {
                mode: 'row',
                allowDeleting: true,
            },
            paging: {
              pageSize: 10,
          },
          pager: {
              visible: true,
              allowedPageSizes: [10, 20, 30, 50, 'all'],
              showPageSizeSelector: true,
              showInfo: true,
              showNavigationButtons: true,
          },
            columns: [{
                    dataField: 'meetingTitle',
                    caption: "Meeting Title"
                },
                {
                    dataField: 'DateCreated',
                    caption: "Date Created",
                    dataType: 'string',
                    allowEditing: false,

                },
                {
                    dataField: 'Type',
                    caption: "Meeting Type",
                },
                {
                    dataField: 'Registration_Format',
                    caption: "Registration_Format",
                    dataType: "string",
                },
                {
                    dataField: 'filterExpression',
                    caption: "Filter Expression",
                    width: 700,
                }, {
                    type: "buttons",
                    width: 110,

                    buttons: ['delete',
                        {
                            text: "Save to DB",
                            icon: "movetofolder",
                            hint: "Save to DB",
                            onClick: function(e) {
                                DevExpress.ui.notify({
                                    message: "meeting saved to DB",
                                    position: {
                                        my: 'center top',
                                        at: 'center top',
                                    },
                                }, 'success', 1000);
                                const sso = localStorage.getItem('CURRENT_USER_SSO');
                                fetch(`${localStorage.getItem('backEndIP')}/savetodbmeeting/${sso}/${e.row.key
                                }`, {
                                        method: 'POST', // or 'PUT'
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(e.row.data),
                                    })
                                    .then(response => response.json())
                                    .then(result => {
                                        console.log('Success:', result);
                                    })
                                    .catch((error) => {
                                        console.error('Error:', error);
                                    });
                            }
                        },
                        {
                            text: "Refresh",
                            icon: "refresh",
                            hint: "Refresh",
                            onClick: async function(e) {
                                 DevExpress.ui.notify({
                                    message: "Meeting is Updated",
                                    position: {
                                        my: 'center top',
                                        at: 'center top',
                                    },
                                }, 'success'); 
                                const sso = localStorage.getItem('CURRENT_USER_SSO');
                                const newfiltervalue = e.row.data["filterExpression"];
                                await $('#agenda-grid-container').dxDataGrid('instance').deselectAll();
                                $('#agenda-grid-container').dxDataGrid('instance').option('filterValue', JSON.parse(newfiltervalue));
                                await $('#agenda-grid-container').dxDataGrid('instance').selectAll();
                                const keys = $('#agenda-grid-container').dxDataGrid('instance').getSelectedRowKeys();
                                console.log('----keys: ', keys);
                                console.log(e.row.rowIndex)
                                fetch(`${localStorage.getItem('backEndIP')}/refreshmeeting/${sso}/${e.row.rowIndex
                                }`, {
                                        method: 'POST', // or 'PUT'
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(keys),
                                    })
                                    .then(response => response.json())
                                    .then(result => {
                                        console.log('Success:', result);
                                    })
                                    .catch((error) => {
                                        console.error('Error:', error);
                                    });
                                await $('#agenda-grid-container').dxDataGrid('instance').deselectAll();
                                await $('#agenda-grid-container').dxDataGrid('instance').clearFilter();
                                const userMeetings = await getUserMeetings(localStorage.getItem('CURRENT_USER_SSO'));
                                await Meetings.option("dataSource", userMeetings);
                            }

                        }
                    ]
                }

            ],
            onRowRemoved(e) {
                const sso = localStorage.getItem('CURRENT_USER_SSO');
                fetch(`${localStorage.getItem('backEndIP')}/deletemeeting/${sso}/${e.key
                    }`, {
                        method: 'POST', // or 'PUT'
                        headers: {
                            'Content-Type': 'application/json',
                        },
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

    const userMeetings = await getUserMeetings(localStorage.getItem('CURRENT_USER_SSO'));
    Meetings.option("dataSource", userMeetings);

    const MinutesReview = $('#minutes-review')
        .dxDataGrid({
            dataSource: [],
            keyExpr: '_id',
            columnsAutoWidth: true,
            allowColumnResizing: true,
            selection: {
                mode: 'multiple',
                allowSelectAll: true,
                selectAllMode: 'allPages',
                showCheckBoxesMode: 'always',
            },
            showBorders: true,
            grouping: {
                autoExpandAll: false,
            },
            searchPanel: {
                visible: true,
                width: 400,
                highlightSearchText: true,
                highlightCaseSensitive: false,
            },
            paging: {
                pageSize: 20,
            },
            stateStoring: {
                enabled: true,
                type: 'localStorage',
                storageKey: 'minutes-review',
            },
            
          headerFilter: {
              visible: true,
          },
            groupPanel: {
                visible: true,
            },
            columnChooser: {
                enabled: true,
                mode: 'select',
                height: 800,
            },
            export: {
                enabled: true,
                //allowExportSelectedData: true,
                selectedRowsOnly: true,
                formats: ['xlsx'],
                texts: {
                    exportSelectedRows: 'Export selected rows to {0}',
                    exportTo: 'Export',
                    exportAll: 'Export all data to {0}',

                }
            },
            onExporting(e) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Minutes Review');

                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                    selectedRowsOnly: true
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MinutesReview.xlsx');
                    });
                });
                e.cancel = true;
            },
            editing: {
                mode: 'row',
                allowUpdating: true,
            },
            columns: [{
                    dataField: 'ID',
                    caption: 'COM',
                    cellTemplate: function(element, info) {
                        element.append("<a href='/views/detail-pages/com-detail-page/com-detail-html.html?com_id=" + info.text + "'>" + info.text + "</a>");
                    }
                }, , {
                    dataField: 'Case Number',
                    caption: 'CSO',
                    cellTemplate: function(element, info) {
                        element.append("<a href='/views/detail-pages/cso-detail-page/cso-detail-html.html?cso_id=" + info.text + "'>" + info.text + "</a>");
                    }
                },
                {
                    dataField: 'CSO Age',
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

                                    else{
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
                    dataField: 'COM Age',
                    alignment: 'left',
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
                    dataField: 'Customer Temperature',
                    caption: 'Temperature',
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
                    dataField: 'Customer Country',
                    caption: 'Country'
                },
                {
                    dataField: 'meetingtitle',
                    caption: "Meeting Title",
                    groupIndex: 0,
                },
                {
                    dataField: 'Customer',
                    caption: 'Site'
                },
                {
                    dataField: 'CSO Issue Summary Markdown',
                    caption: 'CSO Issue Summary',
                    visible: false,
                },
                {
                    dataField: 'COM Issue Summary Markdown',
                    caption: 'COM Issue Summary',
                    visible: false,
                },
                {
                    dataField: 'Next_Action',
                    caption: 'Next_Action',
                    editorType: 'dxTextArea',
                    width: 250,
                    editorOptions: {
                        autoResizeEnabled: true,
                    },
                },
                {
                    dataField: 'Comments',
                    caption: 'Comments',
                    editorType: 'dxTextArea',
                    width: 200,
                    editorOptions: {
                        autoResizeEnabled: true,
                    },
                },
                {
                    dataField: 'Alert Escalation',
                    caption: 'Alert Escalation',
                    editorType: 'dxTextArea',
                    width: 200,
                    editorOptions: {
                        autoResizeEnabled: true,
                    },
                },
                {
                    dataField: 'CSO Account Name',
                    caption: 'CSO Account Name',
                    visible: false,
                },
                {
                    dataField: 'Assigned To: Full Name',
                    caption: 'Assigned To',
                    visible: false,
                },
                {
                    dataField: 'CSO_Current_Action_Status',
                    caption: 'CSO Current Action Status',
                    visible: false,
                },
                {
                    dataField: 'Priority',
                    caption: 'Priority',
                    visible: false,
                },
                {
                    dataField: 'Customer',
                    caption: 'COM Site',
                    visible: false,
                },
                {
                    dataField: 'System ID/Asset ID',
                    caption: 'System ID',
                    visible: false,
                },
                {
                    dataField: 'CSO_Status',
                    caption: 'CSO Status',
                    visible: false,
                }, {
                    dataField: 'Application_Feature',
                    caption: 'Application/Feature',
                    visible: false,
                },
            ],
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    const detail = options.data
                    $('<div>')
                        .addClass('master-detail-caption')
                        .text('Issue summary:')
                        .appendTo(container)
                    container.append($(`< p > ${detail['COM Issue Summary']}</p > `));
                },
            },
            toolbar: {
                items: [
                    'groupPanel',
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
                                    MinutesReview.expandAll(-1);
                                } else if (!e.value) {
                                    MinutesReview.collapseAll(-1);
                                }
                            }
                        },
                    },
                    "exportButton",
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
                                    component: MinutesReview,
                                    selectedRowsOnly: true,
                                    customizeCell: function(options) {
                                        const { gridCell, pdfCell } = options;
                                        if (gridCell.rowType === 'data') {
                                            pdfCell.wordWrapEnabled = true;
                                        }
                                    }
                                }).then(() => {
                                    doc.save('MinutesReview.pdf');
                                });
                            },
                        },
                    },
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
        .dxDataGrid('instance')

    const userMeetings1 = await getUserMeetings(localStorage.getItem('CURRENT_USER_SSO'));
    var dataSourcearray = [];
    for (i = 0; i <= userMeetings1.length - 1; i++) {
        const RecordIDs1 = userMeetings1[i].RecordIDs;
        const title = userMeetings1[i].meetingTitle;
        const records = await getRecords(RecordIDs1);
        var reco = [];
        if (records.length > 0) {
          for (j = 0; j <= records.length - 1; j++) {
              const rec = {
                  ...records[j],
                  "meetingtitle": title,
              }
              reco.push(rec);
          }
        }
        else {
          const rec = {
            "_id": null,
            "meetingtitle": title,
        }
        reco.push(rec);
        }
        dataSourcearray.push(...reco);
    }
    MinutesReview.option("dataSource", dataSourcearray);

});