window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);

function getSearchParameter(sParam) {
    const href = window.location.href;
    let paramValue;
    const idx = href.indexOf(`${sParam}=`);
    paramValue = href.substring(idx + sParam.length + 1).replace("%20", " ");
    console.log("paramValue", paramValue)
    return paramValue;
};
$(async() => {
    //Function for sorting used for COM and CSO Age
    const numericSorting = function(value1, value2) {
        if (!value1 && value2) return -1;
        if (!value1 && !value2) return 0;
        if (value1 && !value2) return 1;

        if (parseInt(value1) > parseInt(value2)) return 1;
        if (parseInt(value1) < parseInt(value2)) return -1;

        return 0;
    };


    //com/cso list data grid
    const search_list = $('#search-list')
        .dxDataGrid({
            dataSource: await getSearchResult(getSearchParameter('search')),
            keyExpr: '_id',
            // columnsAutoWidth: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            showColumnLines: true,
            //columnWidth: 200,
            showBorders: true,
            //filterSyncEnabled: true,
            paging: {
                pageSize: 3,
            },
            pager: {
                visible: true,
                allowedPageSizes: [5, 10, 15, 20, 'all'],
                showPageSizeSelector: true,
                showInfo: true,
                showNavigationButtons: true,
            },
            columnChooser: {
                mode: 'select',
                enabled: true,
                height: 800,
            },
            scrolling: {
                columnRenderingMode: 'virtual',
                useNative: false,
                showScrollbar: 'always',
                scrollByThumb: true,
                scrollByContent: true,
            },
            filterRow: {
                visible: true,
                //applyFilter: 'auto',
            },
            filterPanel: {
                visible: true,
            },
            headerFilter: {
                visible: true,
                //applyFilter: 'auto',
            },
            searchPanel: {
                id: "com-cso-grid-search",
                visible: true,
                width: 600,
                text: getSearchParameter('search'),
                placeholder: 'Search...',
                highlightSearchText: true,
                highlightCaseSensitive: false,
            },
            //Data grid Excel export
            export: {
                enabled: true,
            },
            onExporting(e) {
                const workbook = new ExcelJS.Workbook()
                const worksheet = workbook.addWorksheet('Search Result')

                DevExpress.excelExporter
                    .exportDataGrid({
                        component: e.component,
                        worksheet,
                    })
                    .then(() => {
                        workbook.xlsx.writeBuffer().then((buffer) => {
                            saveAs(
                                new Blob([buffer], { type: 'application/octet-stream' }),
                                'Search Result.xlsx',
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
                    fixed: true,
                    width: 100,
                    allowEditing: false,
                    allowHeaderFiltering: false,
                    cellTemplate: function(element, info) {
                        element.append("<a href='/views/detail-pages/com-detail-page/com-detail-html.html?com_id=" + info.text + "'>" + info.text + "</a>");
                    }
                },
                {
                    dataField: 'Case Number',
                    caption: 'CSO',
                    fixed: true,
                    dataType: "string",
                    allowHeaderFiltering: false,
                    allowEditing: false,
                    minWidth: 100,
                    cellTemplate: function(element, info) {
                        element.append("<a href='/views/detail-pages/cso-detail-page/cso-detail-html.html?cso_id=" + info.text + "'>" + info.text + "</a>");
                    }
                },
                {
                    dataField: 'Search key',
                    caption: 'Search key',
                    dataType: "string",
                    width: 100,
                },
                {
                    dataField: 'CSO Issue Summary',
                    caption: 'CSO Issue summary',
                    visible: true,
                    dataType: "string",
                    width: 400,
                    cellTemplate: function(element, info) {
                        element.append("<div style= font-size:12px;margin-top: 0;margin-bottom: 0.5rem !important>" + info.text + "</div>");
                    }
                },
                {
                    dataField: 'COM Issue Summary',
                    caption: 'COM Issue summary',
                    visible: true,
                    dataType: "string",
                    width: 400,
                    cellTemplate: function(element, info) {
                        element.append("<div style=font-size:12px; margin-top: 0;margin-bottom: 0.5rem !important>" + info.text + "</div>");
                    }
                },
                {
                    dataField: 'History',
                    caption: 'History',
                    //editorType: 'dxTextArea',
                    visible: false,
                    dataType: "string",
                    width: 400,
                    cellTemplate: function(element, info) {
                        element.append("<div style=font-size:12px; margin-top: 0;margin-bottom: 0.5rem !important>" + info.text + "</div>");
                    }
                }, {
                    dataField: 'Investigation Reference Rationale(Full)',
                    caption: 'Investigation Reference Rationale',
                    //editorType: 'dxTextArea',
                    visible: true,
                    dataType: "string",
                    width: 400,
                    cellTemplate: function(element, info) {
                        element.append("<div style=font-size:12px; margin-top: 0;margin-bottom: 0.5rem !important>" + info.text + "</div>");
                    }
                },
                {
                    dataField: "FE's Issue Description(Full)",
                    caption: "FE's Description",
                    dataType: "string",
                    width: 400,
                },
                {
                    dataField: 'Actions Taken / Repairs(Full)',
                    caption: 'Actions Taken / Repairs',
                    dataType: "string",
                    width: 400,
                },
                {
                    dataField: 'Additional Information(Full)',
                    caption: 'Additional Information',
                    dataType: "string",
                    width: 400,
                },
                {
                    dataField: 'Subject',
                    caption: 'SFDC Subject',
                    dataType: "string",
                    width: 400,
                },
                {
                    dataField: 'Description',
                    caption: 'SFDC Description',
                    dataType: "string",
                    width: 400,
                },
                {
                  dataField: 'Analysis Owner',
                  dataType: 'string',
                  visible: false,
              },
              {
                dataField: 'Analysis Status',
                dataType: 'string',
                visible: false,
            },




            ],
            //row detail 
            masterDetail: {
                enabled: true,
                template: function(container, info) {
                    const detail = info.data;
                    container.append(
                        $(`<div >
                        <table style=width:100%;>
                        <tr>
                          <th>Analysis Status</th>
                          <th>Application_Feature</th>
                          <th>Country</th>
                          <th>Priority</th>
                        </tr>
                        <tr>
                          <td>${detail["Analysis Status"]}</td>
                          <td>${detail["Application_Feature"]}</td>
                          <td>${detail["Customer Country"]}</td>
                          <td>${detail["Priority"]}</td>
                        </tr>
                      </table>
                        </div>`)
                    );
                }
            },
            //data grid toolbar
            toolbar: {
                items: [
                    'groupPanel',
                    {
                        text: 'Search',
                        location: 'before',
                        cssClass: "text-primary",
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
                                search_list.clearFilter();
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
                                    search_list.expandAll(-1);
                                } else if (!e.value) {
                                    search_list.collapseAll(-1);
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
                                    component: search_list,
                                    customizeCell: function(options) {
                                        const { gridCell, pdfCell } = options;
                                        if (gridCell.rowType === 'data') {
                                            pdfCell.wordWrapEnabled = true;
                                        }
                                    }
                                }).then(() => {
                                    doc.save('search_list.pdf');
                                });
                            },
                        },
                    },
                    'exportButton',
                    'columnChooserButton',
                    'searchPanel',
                ],
            },
        })
        .dxDataGrid('instance');
});