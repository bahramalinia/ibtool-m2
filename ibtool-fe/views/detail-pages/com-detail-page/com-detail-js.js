function getUrlParameter(sParam) {
    console.log('----- location: ', window.location.href);
    const href = window.location.href;
    let paramValue;
    const idx = href.indexOf(`${sParam}=`);
    paramValue = href.substring(idx + sParam.length + 1);
    console.log('---- com_id is: ', paramValue);
    return paramValue;
};

$(async() => {
    // Navigation bar
    $('#longtabs > .tabs-container').dxTabs({
        items: [
            { text: "Analysis Management" },
            { text: "Safety/Regulatory" },
            { text: "Other Information" },
            { text: "COM/CSO Association" },
            { text: "Information Table" },
            { text: "Closure Information" },
        ],
        selectedIndex: 0,
        onItemClick(e) {
            switch (e.itemIndex) {
                case (0):
                    {
                        $('#container-analysis-management').get(0).style.display = 'block';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-Safety-Regulatory').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        $('#container-information-table').get(0).style.display = 'none';
                        break;
                    }
                case (1):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-Safety-Regulatory').get(0).style.display = 'block';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        $('#container-information-table').get(0).style.display = 'none';
                        break;
                    }
                case (2):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-Safety-Regulatory').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'block';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        $('#container-information-table').get(0).style.display = 'none';
                        break;
                    }
                case (3):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-Safety-Regulatory').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'block';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-information-table').get(0).style.display = 'none';
                        break;
                    }
                case (5):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'block';
                        $('#container-Safety-Regulatory').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        $('#container-information-table').get(0).style.display = 'none';
                        break;
                    }
                    case (4):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-Safety-Regulatory').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        $('#container-information-table').get(0).style.display = 'block';
                        break;
                    }
                default:
                    console.log("nothing to display");
            }
        },
    }).dxTabs('instance');

    //Analysis Management
    //Header card
    const com_header = $('#com-header').dxForm({
        colCount: 8,
        labelMode: 'static',
        formData: await getCOMDetails(getUrlParameter('com_id')),
        items: [{
                dataField: 'ID',
                editorType: 'dxTextBox',
                label: { text: 'COM ID' },
                /* editorOptions: {
                    inputAttr: {
                        class: "dx-texteditor-input-green"
                    }
                } */
            },
            {
                dataField: 'Case Number',
                editorType: 'dxTextBox',
                label: { text: 'CSO ID' },
                editorOptions: {
                    buttons: [{
                        name: 'link',
                        location: 'after',
                        options: {
                            icon: 'info',
                            type: 'default',
                            disabled: false,
                            onClick() {
                                data = com_header.option("formData");
                                const csonumber = data['Case Number']
                                window.open('/views/detail-pages/cso-detail-page/cso-detail-html.html?cso_id=' + csonumber, '_blank')
                            },
                        }
                    }],
                },
                visible: false,
            },
            'COM_Age',
            'Customer',
            'Author',
            'Product Group',
            'CHU Priority',
            'Assigned To',
            'Hazardous or Potentially Haz?',
            {
              dataField: 'Customer Country',
              label: { text: 'Country' },
          },
            'SPCR_Age',
            {
              dataField: 'Device Identification Number',
              label: { text: 'System ID' },
              editorType: 'dxTextBox',

          },
            'GE Knowledge Date',
            'Software Version',
            'Source Service System',
            'Task Owner',
            'Regulatory Non-Conformance?'
            //"Associated_to_CSO",
        ],
        readOnly: true,
    }).dxForm('instance');

    function calculateCOMAge(records_history) {
        if (records_history["ID"] != null){

            if ((records_history["Analysis Status"] != "Closed") && (records_history["Analysis Status"] !="Cancelled") && 
            (records_history["Analysis Status"] !="Duplicate") && (records_history["Analysis Status"] !="Transferred")) {
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

    //Set COM ID in COM detail card headers
    data = com_header.option("formData");
    $(".com-number").text(data.ID);
    /* com_header.option("formData", {
        ...data,
        "SPCR_Age": "gio",
    }); */


    if (calculateCOMAge(data) < 40) {
        com_header.option("formData", {
            ...data,
            "CHU Priority": "NO",
            "COM_Age": calculateCOMAge(data),
            "SPCR_Age": calculateSPCRAge(data),
        });
    } else {
        com_header.option("formData", {
            ...data,
            "CHU Priority": "Yes",
            "COM_Age": calculateCOMAge(data),
            "SPCR_Age": calculateSPCRAge(data),
        });
    }

    // Analysis Management/right side card forms
    // Calculate Fiscal date displayed in the history  
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
    const user = await getUserData(localStorage.getItem('CURRENT_USER_SSO'));
    var username = user.firstName;
    var userlastname = user.lastName;
    var userAccessLevel = user.AccessLevel;
    username = username.charAt(0);
    var userlastnamefirst = userlastname.charAt(0)
    userlastname = userlastname.charAt(userlastname.length - 1);
    var acr = username + userlastnamefirst + userlastname;
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
    const addComNumber = "<strong>"+date + " " + data["ID"] + " : "+"</strong>"+ " &nbsp";


    const associateButton = $("#associate").dxButton({
      text: "Associate COM/CSO",
      type: "Default",
      stylingMode: "contained",
      onClick: async function() {
          var data = com_cso_association_header.option("formData");
          var updatedField = "Case Number";
          var newValue = data["Case Number"];
          const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
          const body = {
              [`${updatedField}`]: newValue,
              "Last_Action_Date": currentDate // Assign today's date
          };
          fetch(`${localStorage.getItem('backEndIP')}/associated/${data._id}`, {
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
              message: "Complaint successfully associated to the CSO",
              width: 800,
              position: {
                  my: 'center top',
                  at: 'center top',
              },
          }, 'success', 10000);
          setTimeout(function() {
              window.location.reload();
          }, 2000);
      }
  });
  
  

   
  $("#external").dxButton({
    text: "Add to External",
    type: "default",
    stylingMode: "contained",
    onClick: async function() {
        if (data["Associated_to_CSO"] == "Yes") {
            const info = await getCSODetails(data["Case Number"]);
            const mongoid = info._id;
            const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const body = {
                External_History: editorInstance.option('value'),
                Last_Action_Date: currentDate // Assign today's date
            };
            let updatedExternalHistory;
            await fetch(`${localStorage.getItem('backEndIP')}/externalhistory/${mongoid}`, {
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
            // Add the COM number to Add history if associated to a CSO
            const text = fiscal + " [" + acr + "] : " + data["ID"] + " : ";
            editorInstance.insertText(0, text, { bold: true });
            //This part allows to add a space after the colon and deactivate the default bold option 
            const space = " ";
            const space_position = text.length;
            editorInstance.insertText(space_position, space, { bold: false });
        } else {
            const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const body = {
                External_History: editorInstance.option('value'),
                Last_Action_Date: currentDate // Assign today's date
            };
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
            const text = fiscal + " [" + acr + "] :";
            editorInstance.insertText(0, text, { bold: true });
            //This part allows to add a space after the colon and deactivate the default bold option 
            const space = " ";
            const space_position = text.length;
            editorInstance.insertText(space_position, space, { bold: false });
        }
    }
});

$("#internal").dxButton({
  text: "Add to Internal",
  type: "success",
  stylingMode: "contained",
  onClick: async function() {
      data = com_header.option("formData");
      if (data["Associated_to_CSO"] == "Yes") {
          console.log("associateddddd", data["Case Number"])
          const info = await getCSODetails(data["Case Number"]);
          const mongoid = info._id;
          const body = {
              Internal_History: editorInstance.option('value'),
              Last_Action_Date: currentDate // Assign today's date

          };

          let updatedInternalHistory;
          await fetch(`${localStorage.getItem('backEndIP')}/internalhistory/${mongoid}`, {
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
         // Add the COM number to Add history if associated to a CSO
          const text = fiscal + " [" + acr + "] : "+ data["ID"] + " : "; 
          editorInstance.insertText(0, text,{bold:true});
          //This part allows to add a space after the colon and deactivate the default bold option 
          const space = " ";
          const space_position = text.length;
          editorInstance.insertText(space_position, space,{bold:false});


      } else {
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
          const text =  fiscal + " [" + acr + "] : " ;
          editorInstance.insertText(0, text ,{bold:true});
           //This part allows to add a space after the colon and deactivate the default bold option 
           const space = " ";
           const space_position = text.length;
           editorInstance.insertText(space_position, space,{bold:false});

      }
  }
});

    if (data["Associated_to_CSO"] == "Yes") {
        editorInstance.option("value", addComNumber)
    };

    const internal_history = $("#internal-history").dxHtmlEditor({
        value: data.Internal_History,
        readOnly: true,
        autoResizeEnabled: true,
    }).dxHtmlEditor('instance');


    /* const cso_associated_history = $("#cso-associated-history").dxHtmlEditor({
       readOnly: true,
       autoResizeEnabled: true,
       visible: false,
   }).dxHtmlEditor('instance'); */
    const cso = data["Case Number"];
    if (data["Associated_to_CSO"] == "Yes") {
        com_header.itemOption("Case Number", "visible", true);
        //cso_associated_history.option("visible", true);
        //$("#Associated_CSO_History").css("display", "block");
        //const info = await getCSODetails(cso);
        //cso_associated_history.option('value', info["History"]);
    }

    const internaledit= $("#internaledit").dxButtonGroup({
        selectionMode: 'none',
        items: [{
                text: "Edit Internal History",
                stylingMode: 'outlined',
                type: 'Normal',
                onClick: async function() {
                    DevExpress.ui.notify({
                      message: "WARNING: Any edition made in the internal history of this Complaint won't appear in the history field of this Complaint during a meeting!",
                      position: {
                          my: 'center top',
                          at: 'center center',
                      },
                  }, 'error', 5000);
                    
                  internal_history.option('readOnly', false);
                  }
            },
            {
                text: 'Save',
                stylingMode: 'outlined',
                type: 'success',
                onClick: async function() {

                    if (data["Associated_to_CSO"] == "Yes") {
                        const cso = data["Case Number"];
                        const info = await getCSODetails(cso);
                        const mongoid = info._id;
                        const body = {
                            Internal_History: internal_history.option('value')
                        }
                        let updatedInternalHistory;
                        await fetch(`${localStorage.getItem('backEndIP')}/editinternalhistory/${mongoid}`, {
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
                            internal_history.option('value', updatedInternalHistory);
                
                    }
                    else {
                        const mongoid = data._id;
                        const body = {
                            Internal_History: internal_history.option('value')
                        }
                        let updatedInternalHistory;
                        await fetch(`${localStorage.getItem('backEndIP')}/editinternalhistory/${mongoid}`, {
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
                        
                            internal_history.option('value', updatedInternalHistory);

                    };
                    DevExpress.ui.notify({
                        message: "Saved",
                        position: {
                            my: 'center bottom',
                            at: 'center bottom',
                        },
                   }, 'success',1000); 
                }

            },
        ],

    }).dxButtonGroup('instance');

    const external_history = $("#external-history").dxHtmlEditor({
        value: data.External_History,
        readOnly: true,
        autoResizeEnabled: true,
    }).dxHtmlEditor('instance');
    
        if (data["Associated_to_CSO"] == "Yes") {
        const cso = data["Case Number"];
        const info = await getCSODetails(cso);
        internal_history.option("value", info["Internal_History"])
        external_history.option("value", info["External_History"])

    };

    const externaledit = $("#externaledit").dxButtonGroup({
        selectionMode: 'none',
        items: [{
                text: "Edit External History",
                type: 'Normal',
                onClick: function() {
                    DevExpress.ui.notify({
                      message: "WARNING: Any edition made in the external history of this Complaint won't appear in the history field of this Complaint during a meeting!",
                      position: {
                          my: 'center top',
                          at: 'center center',
                      },
                  }, 'error', 5000); 

                  external_history.option('readOnly', false);
                }
            },
            {
                text: 'Save',
                stylingMode: 'outlined',
                type: 'success',
                onClick: async function() {

                    if (data["Associated_to_CSO"] == "Yes") {
                        const cso = data["Case Number"];
                        const info = await getCSODetails(cso);
                        /* internal_history.option("value", info["Internal_History"])
                        external_history.option("value", info["External_History"]) */
                        const mongoid = info._id;
                        const body = {
                            External_History: external_history.option('value')
                        }
                        fetch(`${localStorage.getItem('backEndIP')}/editinternalhistory/${mongoid}`, {
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
                    else {
                        const mongoid = data._id;
                        const body = {
                            External_History: external_history.option('value')
                        }
                        fetch(`${localStorage.getItem('backEndIP')}/editinternalhistory/${mongoid}`, {
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
                

                    };
                    DevExpress.ui.notify({
                        message: "Saved",
                        position: {
                            my: 'center bottom',
                            at: 'center bottom',
                        },
                   }, 'success',1000); 
                }

            },
        ],

    }).dxButtonGroup('instance');

    const IssueDescriptionFull = $('#IssueDescriptionFull').dxHtmlEditor({
        value: data["COM Issue Description (Full)"],
        autoResizeEnabled: true,
        readOnly: true,
       
    }).dxHtmlEditor('instance');

    const IssueSummary = $('#IssueSummary').dxHtmlEditor({
        value: data["COM Issue Summary"],
        autoResizeEnabled: true,
        toolbar: {
            items: [
                'bold', 'italic', 'strike', 'color', 'background', 'orderedList', 'bulletList', 'blockquote'
            ],
            multiline: false,
        },

    }).dxHtmlEditor('instance');
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
      for (let i = 0; i < app_feature.length; i++) {
          if (app_feature[i].Name == data["Application_Feature"]) {
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
    const saveButtonIssue = $("#saveButtonissue").dxButton({
      text: "Save",
      type: "Success",
      stylingMode: "contained",
      onClick: async function() {
          const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
          const body = {
              "COM Issue Summary": IssueSummary.option('value'),
              "Last_Action_Date": currentDate
          };
          await fetch(`${localStorage.getItem('backEndIP')}/comissueupdate/${data._id}`, {
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
  


    const analysis_textboxes = $('#analysis-textboxes').dxForm({
        colCount: 6,
        labelMode: 'static',
        formData: await getCOMDetails(getUrlParameter('com_id')),
        items: [
          {
            itemType: 'group',
            colSpan: 2,
            colCount: 2,

          //  caption: 'Analysis Details', // Group caption
            items: [
              {
                dataField: 'Analysis Status',
                editorType: 'dxSelectBox',
                colSpan: 1,
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Analysis_Status,
                },
            },{
              dataField: 'Priority',
              colSpan: 1,
              editorType: 'dxSelectBox',
              editorOptions: {
                  searchEnabled: true,
                  dataSource: priority,
              },
          },
                {
                    dataField: 'Previous action',
                    label: { text: 'Next Action' },
                    editorType: 'dxTextArea',
                    colSpan: 2,
                    editorOptions: {
                        autoResizeEnabled: true,
                        showClearButton: true,
                        minHeight: 105, // Set the minimum height
                    },
                },
                {
                  dataField: 'Last_Action_Date',
                  editorType: 'dxDateBox',
                  colSpan: 2,
                  editorOptions: {
                      searchEnabled: true,
                      showClearButton: true,
                  },
              },
            ]},{
              itemType: 'group',
              colSpan: 2,
              colCount: 2,
            //  caption: 'Analysis Details', // Group caption
              items: [    {
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
            dataField: 'Integration_mode',
            editorType: 'dxSelectBox',
            editorOptions: {
                searchEnabled: true,
                dataSource: Integration_mode,
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
              dataField: 'Search key',
              editorType: 'dxTextBox',
              colSpan: 2,
              editorOptions: {
                  autoResizeEnabled: true,
                  showClearButton: true,
              },
          },]},{
            itemType: 'group',
            colSpan: 2,
            colCount: 2,
          //  caption: 'Analysis Details', // Group caption
            items: [
              {
                dataField: 'Investigation Team',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Investigation_Team,
                },
            },
            {
              dataField: 'Team Name',
              label: {
                text: 'Development Team', // Set the caption for the field name
            },
              /* editorType: 'dxSelectBox',
              editorOptions: {
                  searchEnabled: true,
                  dataSource: Po_Review,
              }, */
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
                dataField: 'PO Review',
                label: {
                  text: 'PO/LSD Owner', // Set the caption for the field name
              },
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Po_Review,
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
              dataField: 'marketing',
              label: {
                text: 'Marketing Representative', // Set the caption for the field name
            },
            /*   editorType: 'dxSelectBox',
              editorOptions: {
                  searchEnabled: true,
                  dataSource: Team_Name,
              }, */
          },
          {
            itemType: 'empty', // Empty item for separator
            colSpan: 3,
        },
        {
          itemType: 'empty', // Empty item for separator
          colSpan: 3,
      },
      {
        itemType: 'empty', // Empty item for separator
        colSpan: 3,
    },
    {
      itemType: 'empty', // Empty item for separator
      colSpan: 3,
  },{
    itemType: 'empty', // Empty item for separator
    colSpan: 1,
},

            {
                itemType: 'button',
                name:'myFormButton',
              //  colSpan: 2,
                horizontalAlignment: 'right',
                buttonOptions: {
                    text: 'Save',
                    type: 'success',
                    onClick: async function() {
                      data = analysis_textboxes.option("formData");
                      
                      const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
                      
                      const body = {
                          "Previous action": data["Previous action"],
                          "Analysis Status": data["Analysis Status"],
                          "Priority": data["Priority"],
                          "Application_Feature": data["Application_Feature"],
                          "Family_Issue": data["Family_Issue"],
                          "Modality": data["Modality"],
                          "Care Area": data["Care Area"],
                          "Application_Release": data["Application_Release"],
                          "Platform_Release": data["Platform_Release"],
                          "Analysis Owner": data["Analysis Owner"],
                          "Investigation Team": data["Investigation Team"],
                          "PO Review": data["PO Review"],
                          "Integration_mode": data["Integration_mode"],
                          "Last_Action_Date": currentDate, // Assign today's date
                          "Search key": data["Search key"],
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
          ]},

        ],
    }).dxForm('instance');


    // End of Analysis Management/right side card forms
    //End of CSO-Detail Page Analysis Management 
    //com detail page closure information
    //com detail closure information header
    const closure_header = $('#closure-header').dxForm({
        colCount: 7,
        labelMode: 'static',
        formData: await getCOMDetails(getUrlParameter('com_id')),
        items: [
            //'Duration_Of_Analysis',
            'Task State',
            'SPCR Symptom Description',
            'SPCR  Resolution',
            'Date Closed',
            'SPCR Problem Description',
            'Investigation Code',
            'Date Task Submitted',
            'SPCR Root Cause Code',
            'Subsystem Code',
        ],
        readOnly: true,
    }).dxForm('instance');

    //Analysis Stop Date
    const startDate = new Date();
    $('#stop-date').dxDateBox({
        applyValueMode: 'useButtons',
        value: startDate,
        max: new Date(),
        min: new Date(1900, 0, 1),
        onValueChanged(data) {
            dateDiff(new Date(data.value));
        },
    });

    function dateDiff(date) {
        const diffInDay = Math.floor(Math.abs((new Date() - date) / (24 * 60 * 60 * 1000)));
        return $('#age').text(`${diffInDay} days Since the closure`);
    }
    //dateDiff(startDate);

    //closure information text areas
    const closure_text_areas = $('#closure-text-areas').dxForm({
        colCount: 2,
        labelMode: 'static',
        formData: await getCOMDetails(getUrlParameter('com_id')),
        items: [{
                dataField: 'SPR',
                editorType: 'dxTextBox',
            },
            {
                dataField: 'Analysis Stop Date',
                editorType: 'dxDateBox',
                editorOptions: {
                    searchEnabled: true,
                },
            },
            {
                dataField: 'Program',
                editorType: 'dxTextBox',
            },
            {
                dataField: 'Confluence',
                editorType: 'dxTextBox',
                editorOptions: {
                    autoResizeEnabled: true,
                }
            },
            {
                dataField: 'Reason Of Closure',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    autoResizeEnabled: true,
                    validationRules: [{
                        type: 'required',
                        message: 'Reason Of Closure is required',
                    }],
                },

            },
            {
                dataField: 'Workaround',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    autoResizeEnabled: true,
                }
            },


            {
                dataField: 'Investigation Reference Rationale(Full)',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                    readOnly: true,
                }
            },
            {
                dataField: 'Customers Issue Description(Full)',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                    readOnly: true,
                },
            },
        ],
    }).dxForm('instance');

    const closureSaveButton = $("#saveButton").dxButton({
      text: "Save",
      type: "Success",
      stylingMode: "contained",
      onClick: function() {
          var data = closure_text_areas.option("formData");
          const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
          const body = {
              "SPR": data.SPR,
              "Reason Of Closure": data["Reason Of Closure"],
              "Program": data["Program"],
              "Workaround": data["Workaround"],
              "Confluence": data["Confluence"],
              "Analysis Stop Date": currentDate // Assign today's date
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
  

    const closureCloseButton= $("#closureButton").dxButton({
        text: "Close Complaint",
        type: "Default",
        stylingMode: "contained",
        useSubmitBehavior: true,
        onClick: function() {
            var data = closure_text_areas.option("formData");
            if (data["Reason Of Closure"] == null) {
                DevExpress.ui.notify({
                    message: "Reason Of Closure is Required",
                    width: 800,
                    position: {
                        my: 'center center',
                        at: 'center center',
                    },
                }, 'error', 5000);

            } else {
                if (data["Application_Feature"] == null) {
                    DevExpress.ui.notify({
                        message: "Please select Application/Feature",
                        width: 800,
                        position: {
                            my: 'center center',
                            at: 'center center',
                        },
                    }, 'warning', 10000);
                }
                if (data["Analysis Stop Date"] == null) {
                    const body = {
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



        }
    });





    //Safety/Regulatory
    //Hazard Last Review Date
    const startDate1 = new Date();

    function dateDiff(date) {
        const diffInDay = Math.floor(Math.abs((new Date() - date) / (24 * 60 * 60 * 1000)));
        return $('#age1').text(`${diffInDay} days Since Hazard last review`);
    }
    dateDiff(startDate1);
    //Safety header card
    $('#safety-header').dxForm({
        colCount: 4,
        labelMode: 'static',
        formData: await getCOMDetails(getUrlParameter('com_id')),
        items: [{
                dataField: 'Regulatory Non-Conformance?',
                editorType: 'dxTextBox',
                editorOptions: {
                    width: 300,
                },
            },
            {
                dataField: 'RSL',
                editorOptions: {
                    width: 300,
                },
            },
            {
                dataField: 'Hazardous Situation',
                editorType: 'dxTextBox',
                editorOptions: {
                    width: 300,
                },
            },
            {
                dataField: 'Potentially Reportable?',
                editorType: 'dxTextBox',
                editorOptions: {
                    width: 300,
                },
            },
            {
                dataField: 'RAC Reference DOC#',
                editorType: 'dxTextBox',
                editorOptions: {
                    width: 300,
                },
            },
            {
                dataField: 'Further Investigation/Actions?',
                colSpan: 3,
                editorType: 'dxTextBox',
                editorOptions: {
                    width: 600,
                },
            },
        ],
        readOnly: true,
    }).dxForm('instance');
    //Safety Regulatory Select boxes and text box
    const safety_select = $('#safety-select').dxForm({
        colCount: 2,
        labelMode: 'static',
        formData: await getCOMDetails(getUrlParameter('com_id')),
        items: [{
                dataField: 'Hazard Raised By',
                editorType: 'dxTextBox',
                editorOptions: {
                    searchEnabled: true,
                },
            },
            {
                dataField: 'Hazard_Last_Review_Date',
                editorType: 'dxDateBox',
                editorOptions: {
                    searchEnabled: true,
                },
            },
            {
                dataField: 'Hazardous_category',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Hazardous_Category,
                },
            },
            {
                dataField: 'Hazard_ID',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Hazard_ID,
                },
            },
            {
                dataField: 'Hazard_decision',
                editorType: 'dxSelectBox',
                editorOptions: {
                    searchEnabled: true,
                    dataSource: Hazard_Decision,
                },
            },
            {
                colSpan: 2,
            },
            {
                dataField: 'Hazard_assessment',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    autoResizeEnabled: true,
                },
            },
            {
                dataField: 'Customers Issue Description(Full)',
                editorType: 'dxHtmlEditor',
                colSpan: 2,
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                    readOnly: true,
                },
            },
        ],
        readOnly: false,

    }).dxForm('instance');

    const hazardsaveButton = $("#hazardsaveButton").dxButton({
      text: "Save",
      type: "Success",
      stylingMode: "contained",
      onClick: function() {
          var data = safety_select.option("formData");
          const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
          const body = {
              "Hazard Raised By": data["Hazard Raised By"],
              "Hazard_Last_Review_Date": currentDate, // Assign today's date
              "Hazardous_category": data["Hazardous_category"],
              "Hazard_ID": data["Hazard_ID"],
              "Hazard_decision": data["Hazard_decision"],
              "Hazard_assessment": data["Hazard_assessment"],
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
  

    //Other information
    $('#other-header').dxForm({
        colCount: 7,
        labelMode: 'static',
        formData: await getCOMDetails(getUrlParameter('com_id')),
        items: [
            //'Days Since Closure',
            'Customer',
            'Modality',
            'Modality Segment',
            'Task ID',
            'Product Name',
            {
                dataField: 'Status',
                label: { text: 'Status (PQM)' },
            },
            'Assigned To',
            'Service System Product ID Code',
            'Source Record ID',
            'Care Area',
            'Date First Active',
            'Date Created',
            'USA Become Aware Date',
            'Date Task Created',
            'Serial Lot Batch No',
            'Model No',
            'Unique Device Identifier',
            'Source Service System',
            'Task State',
        ],
        readOnly: true,
    }).dxForm('instance');

    //Transfer Date
    const startDate2 = new Date();

    function dateDiff(date) {
        const diffInDay = Math.floor(Math.abs((new Date() - date) / (24 * 60 * 60 * 1000)));
        return $('#age2').text(`${diffInDay} days Since Transfer Date`);
    }
    dateDiff(startDate1);
    //other information text areas
    const other_text_areas = $('#other-text-areas').dxForm({
        colCount: 2,
        minColWidth: 500,
        labelMode: 'static',
        formData: await getCOMDetails(getUrlParameter('com_id')),
        items: [{
                dataField: 'Transfer Date',
                editorType: 'dxDateBox',
            },
            {
                dataField: 'More Release Information',
                editorType: 'dxTextBox',

            }, {
                dataField: 'Comments',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    autoResizeEnabled: true,
                },
            },
            {
                dataField: 'Actions Taken / Repairs(Full)',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                    readOnly: true,
                },
            },
            {
                dataField: "FE's Issue Description(Full)",
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                    readOnly: true,
                },
            },
            {
                dataField: 'Repair Test / Inspection Data(Full)',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                    readOnly: true,
                },
            },
            {
                dataField: 'Additional Information(Full)',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                    readOnly: true,
                },
            },
            {
                dataField: 'Customers Issue Description(Full)',
                editorType: 'dxHtmlEditor',
                editorOptions: {
                    stylingMode: 'filled',
                    autoResizeEnabled: true,
                    readOnly: true,
                },
            },
        ],
    }).dxForm('instance');

    const othersaveButton = $("#othersaveButton").dxButton({
      text: "Save",
      type: "Success",
      stylingMode: "contained",
      onClick: function() {
          var data = other_text_areas.option("formData");
          const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
          const body = {
              "Transfer Date": currentDate, // Assign today's date
              "More Release Information": data["More Release Information"],
              "Comments": data["Comments"],
          };
          fetch(`${localStorage.getItem('backEndIP')}/safetyupdate/${data._id}`, {
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
  


    const com_cso_association_header = $('#com-cso-association-header').dxForm({
        colCount: 1,
        labelMode: 'static',
        formData: await getCOMDetails(getUrlParameter('com_id')),
        items: [
            'Case Number',
        ],
        readOnly: false,
    }).dxForm('instance');

  
  

  const desassociateButton = $("#desassociate").dxButton({
    text: "disassociate COM/CSO",
    type: "Default",
    stylingMode: "contained",
    onClick: async function() {
        const id = com_cso_association_header.option().formData.ID;
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const body = {
            "Last_Action_Date": currentDate // Assign today's date
        };
        await fetch(`${localStorage.getItem('backEndIP')}/disassociate/${id}`, {
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
        }, 1000);
    }
});

var complaintData = {
  "Complaint Number": data.ID,
  "Sys ID": data["Device Identification Number"],
  "System Type": data["Product Name"],
  "SW version": data["Software Version"],
  "Application Name": data["Application_Feature"],
  "Customer Name": data["Customer"],
  "Customer Country": data["Customer Country"],
  "Customer's Issue Description": data["Customers Issue Description(Full)"],
  "FE's Issue Description": data["FE's Issue Description(Full)"],
  "Actions Taken/Repairs": data["Actions Taken / Repairs(Full)"],
  "Repair Test/Inspection Data": data["Repair Test / Inspection Data(Full)"],
  "Additional information": data["Additional Information(Full)"],
  "Creation Date": data["Date Created"],
  "GE Knowledge date": data["GE Knowledge Date"],
  "Complaint Author": data["Author"],
  "Complaint Author's SSO": "",
  "Initial Engineering Analysis Owner": data["Analysis Owner"],
};

// Function to generate HTML table
function generateHTMLTable(data) {
  var html = "<table border='2'>\n";
  for (var key in data) {
      html += "<tr>";
      html += "<td style='background-color: rgba(96, 34, 166, 0.5) ;'><b>" + key + "</b></td>";
      html += "<td>" + data[key] + "</td>";
      html += "</tr>\n";
  }
  html += "</table>";
  return html;
}

// Generate HTML table
var htmlTable = generateHTMLTable(complaintData);

// Display the HTML table
document.getElementById("tableContainer").innerHTML = htmlTable;


  // Function to select all table content
  function selectAllTableContent() {
      var range = document.createRange();
      range.selectNode(document.getElementById("tableContainer"));
      window.getSelection().removeAllRanges(); // Clear current selection
      window.getSelection().addRange(range);
  }

  // Attach click event listener to the select all button
  document.getElementById("selectAllButton").addEventListener("click", selectAllTableContent);

  // Function to copy email subject to clipboard
  document.getElementById("copyButton").addEventListener("click", function() {
    var emailSubject = document.getElementById("emailSubjectInput").value;
    navigator.clipboard.writeText(emailSubject).then(function() {
    }, function(err) {
        console.error('Could not copy email subject: ', err);
    });
});

document.getElementById("emailSubjectInput").value = data.ID +" "+"<"+acr+"> "+data["Customer"];

function getFormattedDate() {
  const currentDate = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-GB', options);
  
  return formattedDate;
}
const dateforRationale=getFormattedDate();

  // Select the textarea element
  var textarea = document.getElementById("floatingTextarea2");
  var textarea2 = document.getElementById("floatingTextarea3");
  var localtext = document.getElementById("floatingTextarea4");


  // Add  text to the textarea
  textarea.value = "Analyzed by the AV Apps & AW Workstation L4 support team.\nComplaint description: "+data["COM Issue Summary Markdown"]+"\nAnalysis: \nReason of closure: \nNotification of responsible personnel: "+data["Author"]+"\nAnalysis Closed By: "+data["Analysis Owner"]+" / "+data["Task Owner"]+" on "+dateforRationale+"\nSubsystem Code:  " +data["Application_Feature"] +"\nInvestigation Code: Engineering Follow-up_To trend";
textarea2.value= `Hi ${data["PO Review"]} ,

<Quick summary of application impacted + request to check information below and investigate the questions in blue>

Problem: ${data["Customers Issue Description(Full)"]}

Summary of actions done by local Team: <summary of local team troubleshooting, if it is helpful for Eng investigation: Load From Cold, reconfiguration, tests, comparison with other systems….>

Summary of actions done by Buc IB Team: <description of tests, issue reproduction or not, logfiles review, DICOM conformance statement review>

Potential root cause: <if possible, Buc IB Team tries to indicate what could be the root cause: SW defect, dataset issue, …>

Configuration: Platform Version: ${data["Platform_Release"]}, Software version:  ${data["Software Version"]}, integration mode if important, + any other important details about customer configuration>

Frequency: <how often per week/day, specific to one user or applicable for all users, specific to one dataset or not>

Workflow: <usually this points to the video listed in Resources>

Workaround: <description of successful workaround, acceptance by customer if known>

Customer context: <specific to RED CSO, to explain why customer temperature is RED and what their expectations are>

Questions for engineering: <potential list of questions are listed below >
• Safety risk analysis
• Suggest workaround
• Analyze root cause
• Identify solution
• Decide on product enhancement (scoped / backlog / refused)

Resources:
• <HST link + content>
• <box link if appropriate>
• <dataset: description of dataset, including ID to identify dataset, but no Patient Name>
• <video: description of main info in the video >
• <screenshots: error message, successful result, failed result…>
`;
localtext.value="Hello "+ data["Author"]+",\n\n"+"Thank you for entering this complaint. In order to proceed with the analysis of this issue could you please share:\n\n1. Dataset\n2. Workflow in video\n3. Frequency of the issue? It happens just for one specific patient?\n4. The configuration file (conf > config.txt) \n\nFor legal and regulatory reasons, please use Healthcare Secure Transfer (HST) to communicate PHI.In the field, HST is better known as 'Reactive Service'.\nFor more details about HST, you may consult this Confluence space :  https://devcloud.swcoe.ge.com/devspace/x/UhlKPg \n\nThank you \nBest regards\n"+data["Analysis Owner"];

function copyRationale() {
  // Select the text inside the textarea
  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices

  // Copy the selected text using the Clipboard API
  navigator.clipboard.writeText(textarea.value).then(function() {
    console.log('Text copied to clipboard');
  }, function(err) {
    console.error('Could not copy text: ', err);
  });

  // Deselect the textarea
  textarea.setSelectionRange(0, 0);
}

function copyEngineering() {
  // Select the text inside the textarea
  textarea2.select();
  textarea2.setSelectionRange(0, 99999); // For mobile devices

  // Copy the selected text using the Clipboard API
  navigator.clipboard.writeText(textarea2.value).then(function() {
    console.log('Text copied to clipboard');
  }, function(err) {
    console.error('Could not copy text: ', err);
  });

  // Deselect the textarea
  textarea2.setSelectionRange(0, 0);
}

function sendEngineering() {
  var subject = document.getElementById("emailSubjectInput").value+' --Internal';
  var body = encodeURIComponent(document.getElementById("floatingTextarea2").value);
  var cc = encodeURIComponent("awvvapps-ibteam@ge.com"); // Add email addresses separated by comma
  // Construct the mailto link
  var mailtoLink = "mailto:?subject=" + subject + "&body=" + body + "&cc=" + cc;
console.log("giolar",body);
  // Open the default email client
  window.location.href = mailtoLink;
}

function sendLocal() {
  var subject = encodeURIComponent(document.getElementById("emailSubjectInput").value);
  var body = encodeURIComponent(document.getElementById("floatingTextarea4").value);
  var to = encodeURIComponent("recipient@example.com"); // Add the recipient email address
  var cc = encodeURIComponent("awvvapps-ibteam@ge.com"); // Add email addresses separated by comma

  // Construct the mailto link
  var mailtoLink = "mailto:" + to + "?cc=" + cc + "&subject=" + subject + "&body=" + body;
  // Open the default email client
  window.location.href = mailtoLink;
}
document.getElementById("copyButtonRationale").addEventListener("click", copyRationale);
document.getElementById("copyButtonEngineering").addEventListener("click", copyEngineering);
document.getElementById("emailButtonEngineering").addEventListener("click", sendEngineering);
document.getElementById("emailButtonLocal").addEventListener("click", sendLocal);





//Set some components to read only according to the profile
if (userAccessLevel != "IB"){
    analysis_textboxes.option('readOnly', true);
    closure_text_areas.option('readOnly', true);
    safety_select.option('readOnly', true);
    IssueSummary.option('readOnly', true);
    other_text_areas.option('readOnly', true);
    $('#add-history-div').hide();
    com_cso_association_header.option('readOnly', true);
    saveButtonIssue.dxButton('instance').option('visible', false);
    desassociateButton.dxButton('instance').option('visible', false);
    associateButton.dxButton('instance').option('visible', false);
    closureSaveButton.dxButton('instance').option('visible', false);
    closureCloseButton.dxButton('instance').option('visible', false);
    hazardsaveButton.dxButton('instance').option('visible', false);
    othersaveButton.dxButton('instance').option('visible', false);
    analysis_textboxes.itemOption('myFormButton', 'visible', false);
    internaledit.option('visible', false);
    externaledit.option('visible', false);
}
})

