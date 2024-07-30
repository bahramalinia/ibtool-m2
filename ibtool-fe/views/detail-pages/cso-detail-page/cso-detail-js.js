//Function to redirect to the detail pages

function getUrlParameter(sParam) {
    const href = window.location.href;
    let paramValue;
    const idx = href.indexOf(`${sParam}=`);
    paramValue = href.substring(idx + sParam.length + 1);
    return paramValue;
};
$(async() => {
    // Navigation bar
    $('#longtabs > .tabs-container').dxTabs({
        items: [
            { text: "Analysis Management" },
            { text: "Other Information" },
            { text: "Complaints Information" },
            { text: "Closure Information" },
        ],
        scrollingEnabled: true,
        scrollByContent: true,
        showNavButtons: true,
        selectedIndex: 0,
        onItemClick(e) {
            switch (e.itemIndex) {
                case (0):
                    {
                        $('#container-analysis-management').get(0).style.display = 'block';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        $('#container-com-information').get(0).style.display = 'none';
                        break;
                    }
                case (1):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'block';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        $('#container-com-information').get(0).style.display = 'none';
                        break;
                    }
                case (2):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        $('#container-com-information').get(0).style.display = 'block';
                        break;
                    }
                case (3):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'block';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        $('#container-com-information').get(0).style.display = 'none';
                        break;
                    }
                default:
                    console.log("nothing to display");
            }
        },
    }).dxTabs('instance');

    //CSO-Detail Page Analysis Management
    //Analysis Management Header card
    const cso_header = $('#cso-header').dxForm({
        colCount: 7,
        labelMode: 'static',
        formData: await getCSODetails(getUrlParameter('cso_id')),
        items: [{
                dataField: 'Case Number',
                label: { text: 'CSO ID' },
            },
            'CSO_Age', {
                dataField: 'Customer Temperature',
                editorType: 'dxTextBox',
                label: { text: 'Temperature' },
                /* editorOptions: {
                    inputAttr: {
                        class: 'dx-texteditor-input-yellow',
                    }
                }, */
            },
            'Service Request Number',
            'CSO Account Name',
            'Account Name: Country Name',
            'CSO Region',
            'Assigned To: Email',
            'Assigned To: Full Name',
            'Requestor Email',
            'System ID/Asset ID',
            'System Type',
            'SW Version (software version)',
            'Product Description',
            'System Status',
            'Status',
            'Request Category',
            {
                dataField: 'Date/Time Opened',
                editorType: 'dxDateBox',
                editorOptions: {
                    displayFormat: ' d of MMM, yyyy',
                }
            },
        ],
        readOnly: true,
        onContentReady: function(e) {
            console.log("eeeee", e)
        }

    }).dxForm('instance');

    data = cso_header.option("formData");
    $(".cso-number").text(data["Case Number"]);

    /*     if (data['Customer Temperature'] == "Green") {
             cso_header.option("items")[2]["editorOptions"]["inputAttr"]["class"] = "dx-texteditor-input-Green";
            console.log("formmmm===", cso_header.itemOption('Customer Temperature', "label"))
        }
        if (data['Customer Temperature'] == "Yellow") {
            console.log("yellowww")
            cso_header.option("items")[2]["editorOptions"]["inputAttr"]["class"] = "dx-texteditor-input-red"
            console.log(cso_header.option("items")[2]["editorOptions"]["inputAttr"]["class"]);
        }
        if (data['Customer Temperature'] == "Red") {
            cso_header.option("items")[2]["editorOptions"]["inputAttr"]["class"] = "dx-texteditor-input-red";
        }
    */
    if (data["associated_complaints"].length > 0) {
        $("#complaints-info").css("display", "block");
    }

    const length1 = data["associated_complaints"].length;
    const com1 = data["associated_complaints"][0];
    const com2 = data["associated_complaints"][1];
    const com3 = data["associated_complaints"][2];
    const detail1 = await getCOMDetails(com1);
    const detail2 = await getCOMDetails(com2);
    const detail3 = await getCOMDetails(com3);


    const com1_info_header = $('#com1_info_header').dxForm({
        colCount: 4,
        labelMode: 'static',
        formData: {},
        items: [{
            dataField: 'ID',
            label: {
                text: 'Complaint 1',
            },
            editorOptions: {
                buttons: [{
                    name: 'link',
                    location: 'after',
                    options: {
                        icon: 'info',
                        type: 'default',
                        disabled: false,
                        onClick() {
                            data = com1_info_header.option("formData");
                            const comnumber = data['ID']
                            window.open('/views/detail-pages/com-detail-page/com-detail-html.html?com_id=' + comnumber, '_blank')
                        },
                    }
                }],
            },
        }, {
            dataField: 'Analysis Owner',
            label: {
                text: 'Analysis Owner 1',
            },
        }, {
            dataField: 'Investigation Team',
            label: {
                text: 'Investigation Team 1',
            },
        }, {
            dataField: 'Analysis Status',
            label: {
                text: 'Analysis Status 1',
            },
        }, ],
        readOnly: true,
        visible: true,
    }).dxForm('instance');

    const com2_info_header = $('#com2_info_header').dxForm({
        colCount: 4,
        labelMode: 'static',
        formData: {},
        items: [{
            dataField: 'ID',
            label: {
                text: 'Complaint 2',
            },
            editorOptions: {
                buttons: [{
                    name: 'link',
                    location: 'after',
                    options: {
                        icon: 'info',
                        type: 'default',
                        disabled: false,
                        onClick() {
                            data = com2_info_header.option("formData");
                            const comnumber = data['ID']
                            window.open('/views/detail-pages/com-detail-page/com-detail-html.html?com_id=' + comnumber, '_blank')
                        },
                    }
                }],
            },
        }, {
            dataField: 'Analysis Owner',
            label: {
                text: 'Analysis Owner 2',
            },
        }, {
            dataField: 'Investigation Team',
            label: {
                text: 'Investigation Team 2',
            },
        }, {
            dataField: 'Analysis Status',
            label: {
                text: 'Analysis Status 2',
            },
        }, ],
        readOnly: true,
        visible: false,
    }).dxForm('instance');

    const com3_info_header = $('#com3_info_header').dxForm({
        colCount: 4,
        labelMode: 'static',
        formData: {},
        items: [{
            dataField: 'ID',
            label: {
                text: 'Complaint 3',
            },
            editorOptions: {
                buttons: [{
                    name: 'link',
                    location: 'after',
                    options: {
                        icon: 'info',
                        type: 'default',
                        disabled: false,
                        onClick() {
                            data = com3_info_header.option("formData");
                            const comnumber = data['ID']
                            window.open('/views/detail-pages/com-detail-page/com-detail-html.html?com_id=' + comnumber, '_blank')
                        },
                    }
                }],
            },
        }, {
            dataField: 'Analysis Owner',
            label: {
                text: 'Analysis Owner 3',
            },
        }, {
            dataField: 'Investigation Team',
            label: {
                text: 'Investigation Team 3',
            },
        }, {
            dataField: 'Analysis Status',
            label: {
                text: 'Analysis Status 3',
            },
        }, ],
        readOnly: true,
        visible: false,
    }).dxForm('instance');


    switch (length1) {
        case 1:
            com1_info_header.option("visible", true)
            com1_info_header.option("formData", detail1)
            break;
        case 2:
            com1_info_header.option("visible", true)
            com1_info_header.option("formData", detail1)
            com2_info_header.option("visible", true)
            com2_info_header.option("formData", detail2)

            break;
        case 3:
            com1_info_header.option("visible", true)
            com1_info_header.option("formData", detail1)
            com2_info_header.option("visible", true)
            com2_info_header.option("formData", detail2)
            com3_info_header.option("visible", true)
            com3_info_header.option("formData", detail3)
            break;
        default:
            // code block
    }
    function calculateCSOAge(data) {
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
      
    }

    cso_header.option("formData", {
        ...data,
        "CSO_Age": calculateCSOAge(data),
    });

    const target = new Date();
    // ISO week date weeks start on monday  
    // so correct the day number  
    const dayNr = (target.getDay() + 6) % 7 + 1;
    // ISO 8601 states that week 1 is the week  
    // with january 4th in it  
    const jan4 = new Date(target.getFullYear(), 0, 4);
    //compute the dayNr of january 4th
    const jan4DayNr = (jan4.getDay() + 6) % 7 + 1;
    // Set the target to the same day as the jan4DayNr
    target.setDate(target.getDate() - dayNr + jan4DayNr);
    // Number of days between target date and january 4th  
    const dayDiff = (target - jan4) / 86400000;
    // Calculate week number: Week 1 (january 4th) plus the    
    // number of weeks between same day of the week as target date and january 4th    
    const weekNr = Math.ceil(dayDiff / 7);
    const year = target.getFullYear();
    var getTwodigitYear = year.toString().substring(2);
    const fiscal = getTwodigitYear + "_" + "FW" + weekNr + "." + dayNr;
    //End of Analysis Management Header card
    //Analysis Management Html Editors
    const user = await getUserData(localStorage.getItem('CURRENT_USER_SSO'));
    var username = user.firstName;
    var userlastname = user.lastName;
    username = username.charAt(0);
    var userlastnamefirst = userlastname.charAt(0)
    userlastname = userlastname.charAt(userlastname.length - 1);
    var acr = username + userlastnamefirst + userlastname;
    var userAccessLevel = user.AccessLevel;
    acr = acr.toUpperCase();
     //" &nbsp" adds a space in html and deactivates the bold default option
    const date = "<strong>"+fiscal + " [" + acr + "] :"+"</strong>"+ " &nbsp";
    const editorInstance = $('#add-history').dxHtmlEditor({
        value: date,
        toolbar: {
            items: [
                'undo', 'bold', 'italic','underline', 'strike', 'color', 'background', 'orderedList', 'bulletList',
                {
                    name: 'header',
                    acceptedValues: [false, 1, 2, 3, 4, 5],
                },
                'variable', 'blockquote', 'separator',
                'insertTable', 'deleteTable',
            ],
            multiline: false,
        },
        variables: {
            dataSource: ["Internal Complaint Review", "Buc weekly review", "Buc COM review", "Not reviewed", "Comments", "Next Action"],
            escapeChar: ["[", "]"]
        }
    }).dxHtmlEditor('instance');

    const addCSONumber = "<strong>"+date + " " + data["Case Number"] + " : "+"</strong>"+ " &nbsp";  // Add Case Number to the date

    $("#internal").dxButton({
        text: "Add to Internal",
        type: "success",
        stylingMode: "contained",
        onClick: async function() {
            data = cso_header.option("formData");
            const body = {
                Internal_History: editorInstance.option('value')
            };

            let updatedInternalHistory;
            await fetch(`${localStorage.getItem('backEndIP')}/internalhistory/${data._id}`, {
                    method: 'POST', // or 'PUT'
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                })
                .then(response => response.json())
                .then(result => {
                    updatedInternalHistory = result;
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            editorInstance.reset();
            internal_history.option('value', updatedInternalHistory);
            // Add the CSO number to Add history if associated to a complaint
            if (data["associated_complaints"].length != 0){
                const text = fiscal + " [" + acr + "] : "+ data["Case Number"] + " : "; 
                editorInstance.insertText(0, text,{bold:true});
                //This part allows to add a space after the colon and deactivate the default bold option 
                const space = " ";
                const space_position = text.length;
                editorInstance.insertText(space_position, space,{bold:false});
            }
            else {
                const text = fiscal + " [" + acr + "] :";
                editorInstance.insertText(0, text,{bold:true});
                //This part allows to add a space after the colon and deactivate the default bold option 
                const space = " ";
                const space_position = text.length;
                editorInstance.insertText(space_position, space,{bold:false});
            }
        }
    });
    $("#external").dxButton({
        text: "Add to External",
        type: "default",
        stylingMode: "contained",
        onClick: async function() {
            data = cso_header.option("formData");
            const body = {
                External_History: editorInstance.option('value')
            }
            let updatedExternalHistory;
            await fetch(`${localStorage.getItem('backEndIP')}/externalhistory/${data._id}`, {
                    method: 'POST', // or 'PUT'
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                })
                .then(response => response.json())
                .then(result => {
                    updatedExternalHistory = result;
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            editorInstance.reset();
            external_history.option('value', updatedExternalHistory);
           
            //Add CSO number to Add History if the CSO is associated yo a complaint
            if (data["associated_complaints"].length != 0){
                const text = fiscal + " [" + acr + "] : "+ data["Case Number"] + " : "; 
                editorInstance.insertText(0, text,{bold:true});
                //This part allows to add a space after the colon and deactivate the default bold option 
                const space = " ";
                const space_position = text.length;
                editorInstance.insertText(space_position, space,{bold:false});


            }
            else {
                const text = fiscal + " [" + acr + "] :";
                editorInstance.insertText(0, text,{bold:true});
                //This part allows to add a space after the colon and deactivate the default bold option 
                const space = " ";
                const space_position = text.length;
                editorInstance.insertText(space_position, space,{bold:false});
            }
            
        }
    });
    //
    if (data["associated_complaints"].length != 0) {
        editorInstance.option("value", addCSONumber)
    };

    const internal_history = $("#internal-history").dxHtmlEditor({
        value: data.Internal_History,
        readOnly: true,
        autoResizeEnabled: true,
    }).dxHtmlEditor('instance');

    const internaledit= $("#internaledit").dxButtonGroup({
        selectionMode: 'none',
        items: [{
                text: "Edit Internal History",
                type: 'Normal',
                onClick: function() {
                  DevExpress.ui.notify({
                    message: "WARNING: Any edition made in the internal history of this CSO won't appear in the history field of this CSO during a meeting!",
                    position: {
                        my: 'center top',
                        at: 'center center',
                    },
                }, 'error', 5000); 
                }
            },
            {
                text: 'Save',
                type: 'success',
                stylingMode: 'outlined',
                onClick: function() {
                    DevExpress.ui.notify({
                        message: "Saved",
                        position: {
                            my: 'center bottom',
                            at: 'center bottom',
                        },
                    }, 'success', 1000); 
                  
                }
                
            },
        ],
        onItemClick(e) {
            if (e.itemData.text == "Edit Internal History") {
                internal_history.option('readOnly', false);
            }
            if (e.itemData.text == "Save") {
                internal_history.option('readOnly', true);
                data = cso_header.option("formData");
                const body = {
                    Internal_History: internal_history.option('value')
                }
                fetch(`${localStorage.getItem('backEndIP')}/editinternalhistory/${data._id}`, {
                        method: 'POST', // or 'PUT'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log('Success:', result);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }
        }
    }).dxButtonGroup('instance');

    const external_history = $("#external-history").dxHtmlEditor({
        value: data.External_History,
        readOnly: true,
        autoResizeEnabled: true,
    }).dxHtmlEditor('instance');

    const externaledit= $("#externaledit").dxButtonGroup({
        selectionMode: 'none',
        items: [{
                text: "Edit External History",
                type: 'Normal',
                onClick: function() {
                    DevExpress.ui.notify({
                      message: "WARNING: Any edition made in the external history of this CSO won't appear in the history field of this CSO during a meeting!",
                      position: {
                          my: 'center top',
                          at: 'center center',
                        },
                    }, 'error', 5000); 
                }
            },
            {
                text: 'Save',
                type: 'success',
                stylingMode: 'outlined',
                onClick: function() {
                    DevExpress.ui.notify({
                        message: "Saved",
                        position: {
                            my: 'center bottom',
                            at: 'center bottom',
                        },
                   }, 'success',1000); }
            },
        ],
        onItemClick(e) {
            if (e.itemData.text == "Edit External History") {
                external_history.option('readOnly', false);
            }
            if (e.itemData.text == "Save") {
                external_history.option('readOnly', true);
                data = cso_header.option("formData");
                const body = {
                    External_History: external_history.option('value')
                }

                fetch(`${localStorage.getItem('backEndIP')}/editinternalhistory/${data._id}`, {
                        method: 'POST', // or 'PUT'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log('Success:', result);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }
        }
    }).dxButtonGroup('instance');

    //END of Analysis Management Html Editors
    // Analysis Management right side card forms
    const IssueSummary = $('#IssueSummary').dxHtmlEditor({
        value: data["CSO Issue Summary"],
        autoResizeEnabled: true,
        toolbar: {
            items: [
                'bold', 'italic', 'strike', 'color', 'background', 'orderedList', 'bulletList', 'blockquote'
            ],
            multiline: false,
        },

    }).dxHtmlEditor('instance');

    const IssueDescriptionFull= $('#IssueDescriptionFull').dxHtmlEditor({
        value: data["CSO Issue Description (Full)"],
        autoResizeEnabled: true,
    }).dxHtmlEditor('instance');

  const saveButtonissue=  $("#saveButtonissue").dxButton({
        text: "Save",
        type: "Success",
        stylingMode: "contained",
        onClick: async function() {
            const body = {
                "CSO Issue Summary": IssueSummary.option('value')
            }
            await fetch(`${localStorage.getItem('backEndIP')}/csoissueupdate/${data._id}`, {
                    method: 'POST', // or 'PUT'
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                })
                .then(response => response.json())
                .then(result => {
                    console.log('Success:', result);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
                DevExpress.ui.notify({
                  message: "Saved",
                  position: {
                      my: 'center bottom',
                      at: 'center bottom',
                  },
              }, 'success', 1000); 
        }

    });


    const cso_selectboxes = $('#form').dxForm({
        colCount: 5,
        formData: await getCSODetails(getUrlParameter('cso_id')),
        labelMode: 'static',
        items: [
            {
                dataField: 'Previous action',
                label: { text: 'Next Action' },
                colSpan: 3,
                editorType: 'dxTextArea',
                editorOptions: {
                    showClearButton: true,
                },
            },
            {
                dataField: 'Comments',
                colSpan: 2,
                editorType: 'dxTextArea',
                editorOptions: {
                    autoResizeEnabled: true,
                },
            }, {
                dataField: 'Investigation Team',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Investigation_Team,
                },
            },
            {
                dataField: 'Analysis Owner',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Analysis_Owner,
                },
            },
            {
                dataField: 'Analysis Status',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Analysis_Status,
                },
            },
            {
                dataField: 'CSO_Status',
                editorType: 'dxSelectBox',
                label: {
                    text: 'CSO Status',
                },
                editorOptions: {
                    searchEnabled: true,
                    dataSource: CSO_Status,
                },
            }, {
                dataField: 'CSO_Current_Action_Status',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: CSO_actions_status,
                },
            },
            {
                dataField: 'CSO_Internal_Meeting',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: CSO_Internal_meeting,
                },
            },
            {
                dataField: 'Platform_Release',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Platform_Release,
                },
            },
            {
                dataField: 'Application_Release',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Application_Release,
                },
            },
            {
                dataField: 'Application_Feature',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: new DevExpress.data.ArrayStore({
                        data: app_feature,
                        key: 'ID',
                    }),
                    displayExpr: 'Name',
                    valueExpr: 'Name',
                },
            },
            {
                dataField: 'Family_Issue',
                editorType: 'dxTextBox',
                editorOptions: {
                    readOnly: true,
                    value: getAppFeatureForCurrentApp().Family,
                },
            },
            {
                dataField: 'Modality',
                editorType: 'dxTextBox',
                editorOptions: {
                    readOnly: true,
                    value: getAppFeatureForCurrentApp().Modality,
                },
            },
            {
                dataField: 'Care Area',
                editorType: 'dxTextBox',
                editorOptions: {
                    readOnly: true,
                    value: getAppFeatureForCurrentApp().Care_Area,

                },
            },
            {
                dataField: 'CSO Region',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: CSO_Region,
                },
            },
            {
                dataField: 'Last_Action_Date',
                editorType: 'dxDateBox',
                editorOptions: {
                    searchEnabled: true,
                    showClearButton: true,
                },
            },
            {
                dataField: "CSO Account Name"
            },
            {
                dataField: "Search key"
            },

            {
                dataField: 'CSO_Alert_Flag',
                editorType: 'dxTextBox',
                editorOptions: {
                    autoResizeEnabled: true,
                },
            }, {
                itemType: 'button',
                name:'CSOSaveButton',
                colSpan: 4,
                horizontalAlignment: 'right',
                buttonOptions: {
                    text: 'Save',
                    type: 'success',
                    onClick: function() {
                        data = cso_selectboxes.option("formData");

                        const body = {
                            "Previous action": data["Previous action"],
                            "Comments": data["Comments"],
                            "CSO_Status": data["CSO_Status"],
                            "Investigation Team": data["Investigation Team"],
                            "Analysis Owner": data["Analysis Owner"],
                            "Analysis Status": data["Analysis Status"],
                            "CSO_Current_Action_Status": data["CSO_Current_Action_Status"],
                            "Application_Feature": data["Application_Feature"],
                            "Family_Issue": data["Family_Issue"],
                            "Modality": data["Modality"],
                            "Care Area": data["Care Area"],
                            "Application_Release": data["Application_Release"],
                            "Platform_Release": data["Platform_Release"],
                            "Last_Action_Date": data["Last_Action_Date"],
                            "Search key": data["Search key"],
                            "CSO Region": data["CSO Region"],
                            "CSO Account Name": data["CSO Account Name"],
                            "CSO_Alert_Flag": data["CSO_Alert_Flag"],
                            "CSO_Internal_Meeting": data["CSO_Internal_Meeting"],
                        };
                        fetch(`${localStorage.getItem('backEndIP')}/closureupdate/${data._id}`, {
                                method: 'POST', // or 'PUT'
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(body),
                            })
                            .then(response => response.json())
                            .then(result => {
                                console.log('Success:', result);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
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
    }).dxForm('instance');

    if (data["associated_complaints"].length > 0) {
        cso_selectboxes.itemOption("Investigation Team", "visible", false);
        cso_selectboxes.itemOption("Analysis Owner", "visible", false);
        cso_selectboxes.itemOption("Analysis Status", "visible", false);
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    function getAppFeatureForCurrentApp() {
      let idnumber;
      let retries = 0;
      
      // Retry loop
      while (typeof app_feature === 'undefined' && retries < 3) {
          retries++;
          console.log("Retrying...");
          sleep(1000); // Wait for 1 second before retrying
      }
      
      // If app_feature is still undefined after retries, return idnumber
      if (typeof app_feature === 'undefined') {
          return idnumber;
      }
  
      // Perform your calculation
      for (let i = 0; i < app_feature.length; i++) {
        if (data["Application_Feature"] === app_feature[i].Name) {
            idnumber = app_feature[i].ID - 1;
        }
      }
      if (idnumber) {
        return app_feature[idnumber];
      }
      else {
        return {
          Modality: 'N/A',
          Family: 'N/A',
          Care_Area: 'N/A',
        }
      }
    }
    // End of Analysis Management/right side card forms
    //End of CSO-Detail Page Analysis Management 
    //cso detail page closure information
    //cso detail closure information header
    $('#closure-header').dxForm({
        colCount: 7,
        labelMode: 'static',
        formData: await getCSODetails(getUrlParameter('cso_id')),
        items: [
            'Rationale',
            'Enhancement Identifier',
            'Awaiting Product Enhancement',
            'Anticipated Enhancement Delivery Date',
            'Product Manager Disposition',
            'Date/Time Closed',
        ],
        readOnly: true,
    }).dxForm('instance');
    //advanced date picker

    //closure information text areas
    const closure_text_areas = $('#closure-text-areas').dxForm({
        colCount: 2,
        minColWidth: 500,
        labelMode: 'static',
        formData: await getCSODetails(getUrlParameter('cso_id')),
        items: [{
                dataField: 'Resolution Notes',
                editorType: 'dxTextBox',
                editorOptions: {
                    stylingMode: 'outlined',
                    readOnly: true,
                }
            },
            {
                dataField: 'Root Cause Description',
                editorType: 'dxTextBox',
                editorOptions: {
                    stylingMode: 'outlined',
                    readOnly: true,
                }
            },
            {
                dataField: 'CSO Solution Type',
                editorType: 'dxSelectBox',
                editorOptions: {
                    items: CSO_Solution_type,
                    searchEnabled: true,
                },
            },
            {
                dataField: 'CSO Release Proposed',
                editorType: 'dxSelectBox',
                editorOptions: {
                    items: CSO_Release_Proposed,
                    searchEnabled: true,
                },

            },
            {
                dataField: 'Analysis Stop Date',
                editorType: 'dxDateBox',
            },
            {
                dataField: 'CSO Closure Date',
                editorType: 'dxDateBox',
            },
            {
                dataField: 'Engineering Feedback',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    autoResizeEnabled: true,
                },
            },
            {
                dataField: 'IB Team Feedback',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    autoResizeEnabled: true,
                },
            },
            {
                dataField: 'Official Communication',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    autoResizeEnabled: true,
                },
            },
        ],
    }).dxForm('instance');


    const ClosureSaveButton=$("#saveButton").dxButton({
        text: "Save",
        type: "Success",
        stylingMode: "contained",
        onClick: function() {
            var data = closure_text_areas.option("formData");
            const body = {
                "CSO Solution Type": data["CSO Solution Type"],
                "Analysis Stop Date": data["Analysis Stop Date"],
                "CSO Closure Date": data["CSO Closure Date"],
                "CSO Release Proposed": data["CSO Release Proposed"],
                "IB Team Feedback": data["IB Team Feedback"],
                "Official Communication": data["Official Communication"],
                "Engineering Feedback": data["Engineering Feedback"],
            };
            fetch(`${localStorage.getItem('backEndIP')}/closureupdate/${data._id}`, {
                    method: 'POST', // or 'PUT'
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                })
                .then(response => response.json())
                .then(result => {
                    console.log('Success:', result);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
                DevExpress.ui.notify({
                  message: "Saved",
                  position: {
                      my: 'center bottom',
                      at: 'center bottom',
                  },
              }, 'success', 1000); 
        }
    });

  const closureButton=  $("#closureButton").dxButton({
        text: "Close CSO",
        type: "Default",
        stylingMode: "contained",
        onClick: function() {
            var data = closure_text_areas.option("formData");
            if (data["Analysis Stop Date"] == null) {
                const body = {
                    "CSO_Status": "CLOSED",
                    "CSO_Current_Action_Status": "[Step 9] - Closed CSO",
                    "Analysis Status": "Closed",
                    "Analysis Stop Date": Date(),
                };
                fetch(`${localStorage.getItem('backEndIP')}/closureupdate/${data._id}`, {
                        method: 'POST', // or 'PUT'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log('Success:', result);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                setTimeout(function() {
                    window.location.reload();
                }, 800);
            } else {
                const body = {
                    "CSO_Status": "CLOSED",
                    "CSO_Current_Action_Status": "[Step 9] - Closed CSO",
                    "Analysis Status": "Closed",
                };
                fetch(`${localStorage.getItem('backEndIP')}/closureupdate/${data._id}`, {
                        method: 'POST', // or 'PUT'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log('Success:', result);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                setTimeout(function() {
                    window.location.reload();
                }, 800);
            }
        }

    });



    //Other information
    //other information header
    $('#other-information-header').dxForm({
        colCount: 7,
        labelMode: 'static',
        formData: await getCSODetails(getUrlParameter('cso_id')),
        items: [
            'Acct Global Region',
            'IB Asset: IB Asset ID',
            'Created By: Full Name',
            'IB Asset: Serial Number',
            'Action Owner',
            'Part #',
            'Complaint Number (PQM)',
            'Tier 1',
            'Tier 2',
            'Tier 3'
        ],
        readOnly: true,
    }).dxForm('instance');

    //other information text areas
    $('#other-information-text-areas').dxForm({
        colCount: 2,
        minColWidth: 500,
        labelMode: 'static',
        formData: await getCSODetails(getUrlParameter('cso_id')),
        items: [{
                dataField: 'GE Contact Names Engaged Pre-Escalation',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                },
            },
            {
                dataField: 'CSO Email Title',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                },
            },
            {
                dataField: 'Subject',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                },
            },

            {
                dataField: 'Action Plan',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                },
            },
            {
                dataField: 'Case History',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                },
            },
            {
                dataField: 'Description',
                colSpan: 2,
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                },
            },
        ],
        readOnly: true,
    }).dxForm('instance');


    const com_info_header1 = $("#com-info-header1").dxForm({
        labelMode: 'static',
        formData: {},
        items: [
            'ID',
            'Analysis Owner',
            'Analysis Status',
            'Application_Feature',
            'Investigation Team',
            'Search key',
            'Platform_Release',
            'Application_Release',
            'Analysis Stop Date',
            { colSpan: 1 },
            {
                dataField: 'History',
                colSpan: 2,
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    autoResizeEnabled: true,
                },
            },
        ],
        readOnly: true,
        colCount: 2,

    }).dxForm('instance');

    const com_info_header2 = $("#com-info-header2").dxForm({
        labelMode: 'static',
        formData: {},
        items: [
            'ID',
            'Analysis Owner',
            'Analysis Status',
            'Application_Feature',
            'Investigation Team',
            'Search key',
            'Platform_Release',
            'Application_Release',
            'Analysis Stop Date',
            { colSpan: 1 },
            {
                dataField: 'History',
                colSpan: 2,
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    autoResizeEnabled: true,
                },
            },
        ],
        readOnly: true,
        colCount: 2,

    }).dxForm('instance');

    const com_info_header3 = $("#com-info-header3").dxForm({
        labelMode: 'static',
        formData: {},
        items: [
            'ID',
            'Analysis Owner',
            'Analysis Status',
            'Application_Feature',
            'Investigation Team',
            'Search key',
            'Platform_Release',
            'Application_Release',
            'Analysis Stop Date',
            { colSpan: 1 },

            {
                dataField: 'History',
                colSpan: 2,
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    autoResizeEnabled: true,
                },
            },
        ],
        readOnly: true,
        colCount: 2,
    }).dxForm('instance');


    const length = data["associated_complaints"].length;
    switch (length) {
        case 0:
            $("#flex-items1").css("display", "none");
            $("#flex-items2").css("display", "none");
            $("#flex-items3").css("display", "none");
            $("#No_Complaint_Associated").css("display", "block");

            break;
        case 1:
            $("#flex-items1").css("display", "block");
            $("#flex-items2").css("display", "none");
            $("#flex-items3").css("display", "none");
            com_info_header1.option("formData", detail1)
            break;
        case 2:
            $("#flex-items1").css("display", "block");
            $("#flex-items2").css("display", "block");
            $("#flex-items3").css("display", "none");
            com_info_header1.option("formData", detail1)
            com_info_header2.option("formData", detail2)
            break;
        case 3:
            $("#flex-items1").css("display", "block");
            $("#flex-items2").css("display", "block");
            $("#flex-items3").css("display", "block");
            com_info_header1.option("formData", detail1)
            com_info_header2.option("formData", detail2)
            com_info_header3.option("formData", detail3)
            break;
        default:
            // code block
    }
    //Set some components to read only according to the profile
    if (userAccessLevel != "IB"){
        $('#add-history-div').hide();
        cso_selectboxes.option('readOnly', true);
        cso_selectboxes.itemOption('CSOSaveButton', 'visible', false);
        IssueSummary.option('readOnly', true);
        IssueDescriptionFull.option('readOnly', true);
        saveButtonissue.dxButton('instance').option('visible', false);
        internaledit.option('visible', false);
        externaledit.option('visible', false);
        closure_text_areas.option('readOnly', true);
        ClosureSaveButton.dxButton('instance').option('visible', false);
        closureButton.dxButton('instance').option('visible', false);
    }
});

