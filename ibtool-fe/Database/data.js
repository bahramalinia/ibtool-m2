
const Type = [
  "CSO",
  "Complaint"
];
const MeetingType = [
  "Internal",
  "External"
];

const Hazardous=["Yes","No"];

const Hazard_Decision = [
  "-",
  "Yes",
  "No"
];




 const PieChart = [{
  'Analysis Owner': 'Sana Alinia',
  'number': 55.5,
}, {
  'Analysis Owner': 'Emmanuelle',
  'number': 2.8,
}]; 

const meeting_header = [
  [{
    caption: 'Country',
    dataField: 'Customer Country',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    caption: 'COM Age',
    dataField: 'COM_Age',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    caption: 'CSO Associated',
    dataField: 'Case Number',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'Device Identification Number',
    caption: 'Device Identification Number',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'Application_Release',
    editorOptions: {
      readOnly: true,
    }
  }, {
    dataField: 'Application_Feature',
    editorOptions: {
      readOnly: true,
    }
  }, {
    dataField: 'Analysis Owner',
    colSpan: 1,
    editorOptions: {
      readOnly: true,
    },
  },
  {
    dataField: 'Analysis Status',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    caption: 'Site',
    dataField: 'Customer',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    caption: ' SPCR Age',
    dataField: 'SPCR_Age',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'Priority',
    editorOptions: {
      readOnly: true,
    }
  }, {
    dataField: 'Author',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'Platform_Release',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'Search key',
    editorOptions: {
      readOnly: true,
    }
  },

  {
    dataField: 'PO Review',
    colSpan: 1,
    editorOptions: {
      readOnly: true,
    },
  },
  {
    dataField: 'Hazardous or Potentially Haz?',
    colSpan: 1,
    editorOptions: {
      readOnly: true,
    },
  },

  {
    dataField: 'COM Issue Description (Full)',
    colSpan: 4,
    editorType: 'dxHtmlEditor',
    editorOptions: {
      height: 200,
      readOnly: true,
    },
    labelMode: 'hidden',
  },
  {
    dataField: 'COM Issue Summary',
    colSpan: 4,
    editorType: 'dxHtmlEditor',
    editorOptions: {
      height: 200,
      readOnly: true,
    },
    labelMode: 'hidden',

  },
  {
    dataField: 'Previous action',
    colSpan: 8,
    editorType: 'dxTextBox',
    editorOptions: {
      autoResizeEnabled: true,
      readOnly: true,
      labelMode: "static",
      stylingMode: "outlined",
      elementAttr: {
        id: "Previous_action"
      }
    },

  },

  ],
  [{
    dataField: 'Account Name: Country Name',
    label: { text: 'Country' },
    editorOptions: {
      readOnly: true,
    }
  }, {
    dataField: 'CSO_Age',
    caption: 'CSO Age',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    label: { text: 'Temperature' },
    dataField: 'Customer Temperature',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'Application_Release',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'Application_Feature',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'CSO_Status',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'CSO Account Name',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'Request Category',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'System ID/Asset ID',
    editorOptions: {
      readOnly: true,
    }
  },
  /* {
      dataField: 'Complaint_Number',
      editorOptions: {
          readOnly: true,
      }
  }, */
  {
    dataField: 'Platform_Release',
    editorOptions: {
      readOnly: true,
    }
  },


  /* {
             dataField: 'Analysis Status',
             editorOptions: {
                 readOnly: true,
             }
         }, */
  /* {
      dataField: 'Analysis Owner',
      editorOptions: {
          readOnly: true,
      }
  }, */
  {
    dataField: 'Action Owner',
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'CSO_Current_Action_Status',
    colSpan: 2,
    editorOptions: {
      readOnly: true,
    }
  },



  { colSpan: 3, },

  {
    dataField: 'CSO Issue Description (Full)',
    label: {
      text: 'CSO Issue Description (Full)',
    },
    colSpan: 4,
    editorType: 'dxHtmlEditor',
    editorOptions: {
      //autoResizeEnabled: true,
      height: 200,
      readOnly: true,
      labelMode: "static",
    },
  },
  {
    dataField: 'CSO Issue Summary',
    label: {
      text: 'CSO Issue Summary',
    },
    colSpan: 4,
    editorType: 'dxHtmlEditor',
    editorOptions: {
      //autoResizeEnabled: true,
      height: 200,
      readOnly: true,
      labelMode: "static",

    },

  },
  {
    dataField: 'CSO Solution Type',
    colSpan: 2,
    editorOptions: {
      readOnly: true,
    }
  }, {
    dataField: 'CSO Release Proposed',
    colSpan: 2,
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'associated_complaints[0]',
    label: {
      text: 'Complaint 1',
    },
    visible: true,
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'associated_complaints[1]',
    label: {
      text: 'Complaint 2',
    },
    visible: true,
    editorOptions: {
      readOnly: true,
    }
  },
  {
    dataField: 'associated_complaints[2]',
    label: {
      text: 'Complaint 3',
    },
    visible: true,
    editorOptions: {
      readOnly: true,
    }
  },
  { colSpan: 1, },
  {
    dataField: 'Previous action',
    colSpan: 8,
    editorType: 'dxTextBox',
    editorOptions: {
      autoResizeEnabled: true,
      readOnly: true,
      labelMode: "static",
    },
  },

  ],
];

const filter = [
  ['Type', '=', "Complaint"],
];

const filter_com_cso = [
  ['Analysis Status', '=', "Closed"]
];

const my_analysis = [
  ['Analysis Owner', '=', "Sana Alinia"],
];

let fields;

let appData;
let Analysis_Status;
let CSO_Region;
let priority;
let Temperature;
let SFDC_Status;
let app_feature;
let PQM_Status;
let Integration_mode;
let CSO_Status;
let CSO_actions_status;
let CSO_Internal_meeting;
let CSO_Solution_type;
let Investigation_Team;
let Po_Review;
let Team_Name;
let Application_Feature;
let Platform_Release;
let Application_Release;
let Modality;
let CSO_Release_Proposed;
let Analysis_Owner;
let Hazardous_Category;
let Hazard_ID;

async function buildFields () {
  const response = await fetch(`${localStorage.getItem('backEndIP')}/appData`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json();
  appData = result[0];
  Analysis_Status = appData.analysisStatus;
  CSO_Region = appData.csoRegion;
  priority = appData.priority;
  Temperature = appData.temperature;
  SFDC_Status = appData.SfdcStatus;
  app_feature = appData.appFeature;
  PQM_Status = appData.pqmStatus;
  Integration_mode = appData.integrationMode;
  CSO_Status = appData.csoStatus;
  CSO_actions_status = appData.csoActionStatus;
  CSO_Internal_meeting = appData.csoInternalMeeting;
  CSO_Solution_type = appData.csoSolutionType;
  Investigation_Team = appData.investigationTeam;
  Po_Review = appData.poReview;
  Team_Name=appData.Team_Name;
  Application_Feature = appData.applicationFeature;
  Platform_Release = appData.platformRelease;
  Application_Release = appData.applicationRelease;
  Modality = appData.modality;
  CSO_Release_Proposed = appData.csoReleaseProposed;
  Analysis_Owner = appData.analysisOwner;
  Hazardous_Category = appData.hazardousCategory;
  Hazard_ID = appData.hazardId;

  fields = [{
    caption: 'Type',
    dataField: 'Type',
    dataType: 'string',
    lookup: {
        dataSource: Type,
    },
  },
  {
      caption: 'CSO ID',
      dataField: 'Case Number',
      dataType: 'string',
  },
  {
      caption: 'COM ID',
      dataField: 'ID',
      dataType: 'string',
  },
  {
      dataField: 'Customer Country',
      //filterOperations: ['=', 'anyof'],
      caption: 'Country',
      dataType: 'string',
  }, {
      dataField: 'CSO_Age',
      dataType: 'number',
  }, {
      dataField: 'COM_Age',
      dataType: 'number',
  },
  {
      dataField: 'SPCR_Age',
      dataType: 'number',
  }, {
      dataField: 'Search_key',
      caption: 'Search key',
      dataType: 'string',
  }, {
      dataField: 'Last_Action_Date',
      caption: 'Last Action Date',
      dataType: 'date',
  }, {
      dataField: 'Priority',
      caption: 'Priority',
      filterOperations: ['=','<>', 'anyof'],
      lookup: {
          dataSource: priority,
      },
  },
  {
      dataField: 'Application_Feature',
      caption: 'Application/Feature',
      filterOperations: ['=', 'anyof'],
      lookup: {
          dataSource: Application_Feature,
      },
  },
  {
      dataField: 'Application_Release',
      caption: 'Application/Release',
      filterOperations: ['=', 'anyof'],
      lookup: {
          dataSource: Application_Release,
      },
  },
  {
      dataField: 'Platform_Release',
      caption: 'Platform_Release',
      filterOperations: ['=', 'anyof'],
      lookup: {
          dataSource: Platform_Release,
      },
  },{
    caption: 'Hazardous or Potentially Haz?',
    dataField: 'Hazardous or Potentially Haz?',
    dataType: 'string',
    lookup: {
        dataSource: Hazardous,
    },
  },
  {
      dataField: 'Analysis Owner',
      caption: 'Analysis Owner',
      filterOperations: ['=', 'anyof'],
      lookup: {
          dataSource: Analysis_Owner,
      },
  },
  {
      dataField: 'Analysis Status',
      caption: 'Analysis Status',
      filterOperations: ['=', 'anyof'],
      lookup: {
          dataSource: Analysis_Status,
      },
  },
  {
      dataField: 'PO Review',
      caption: 'Po_Review',
      filterOperations: ['=', 'anyof'],
      lookup: {
          dataSource: Po_Review,
      },
  },
  {
      dataField: 'Investigation Team',
      filterOperations: ['=', 'anyof'],
      lookup: {
          dataSource: Investigation_Team,
      },
  },
  {
      dataField: 'Modality',
      caption: 'Modality',
      filterOperations: ['=', 'anyof'],
      lookup: {
          dataSource: Modality,
      },
  },
  {
      dataField: 'Customer Temperature',
      filterOperations: ['=', 'anyof'],
      caption: 'Temperature',
      lookup: {
          dataSource: Temperature,
      },
  },
  {
      dataField: 'CSO_Internal_Meeting',
      filterOperations: ['=', 'anyof'],
      lookup: {
          dataSource: CSO_Internal_meeting
      }
  },
  {
      dataField: 'CSO Account Name'
  },
  {
      dataField: 'CSO Region',
      filterOperations: ['=', 'anyof'],
      lookup: {
          dataSource: CSO_Region
      }
  },
  {
      dataField: 'CSO_Alert_Flag',
  }
  ];
}

$(async () => await buildFields());


// get data for My analysis
async function getMyAnalysis(user) {
  const usern = await getUserData(localStorage.getItem('CURRENT_USER_SSO'));
  const username = usern.firstName + " " + usern.lastName;
  let list = [];
  await fetch(`${localStorage.getItem('backEndIP')}/getMyAnalysis/${username}`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'get',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(json => {
          list = json;
      });
  return list;
}

// get data for COM/CSO List by default (Just open records)
async function getCOMCSOList() {
  try {
    const response = await fetch(`${localStorage.getItem('backEndIP')}/getCOMCSOList`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const list = await response.json();
    console.log('-------------- COM CSO List: ', list);
    return list;
  } catch (error) {
    console.error('Error fetching COMCSO list:', error.message);
    return [];
  }
}


// get data for meeting List by default (Just open records)
async function getMeetingList() {
  console.log('--- getMeetingList begin')
  try {
    const response = await fetch(`${localStorage.getItem('backEndIP')}/getMeetingList`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const list = await response.json();
    console.log('-------------- Meeting list: ', list);
    return list;
  } catch (error) {
    console.error('Error fetching meeting list:', error.message);
    return [];
  }
}


//Get data for COM/CSO List (when the switch key is on and it gets all records open and closed)
async function getAllRecords() {
  let list = [];
  await fetch(`${localStorage.getItem('backEndIP')}/getAllRecords`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'get',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(json => {
          list = json;
      });
  return list;
}

//Get data for Page CSO Assignment
async function getNotAssignedCSO() {
  let list = [];
  await fetch(`${localStorage.getItem('backEndIP')}/getNotAssignedCSO`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'get',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(json => {
          list = json;
      });
  return list;
}

//Get data for Page COM Assignment
async function getNotAssignedCOM() {
  let list = [];
  await fetch(`${localStorage.getItem('backEndIP')}/getNotAssignedCOM`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'get',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(json => {
          list = json;
      });
  return list;
}

// Key can be LastComUpdate or LastCsoUpdate
var key;
async function getLastImport(key) {
  let date;
  await fetch(`${localStorage.getItem('backEndIP')}/readlastimport/${key}`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'get',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(json => {
          date = json;
      });
  return date;
}

//Get data for CSO Detail pages
async function getCSODetails(cso_id) {
  let details = [];
  await fetch(`${localStorage.getItem('backEndIP')}/readCSODetails/${cso_id}`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'get',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => {
          details = response.json();
      });
  return details;
}

// Get data for COM detail pages
async function getCOMDetails(com_id) {
  let details = [];
  await fetch(`${localStorage.getItem('backEndIP')}/readCOMDetails/${com_id}`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'get',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => {
          details = response.json();
      });
  return details;
}

//Get records with their _id in mongoDB
async function getRecords(recordIds) {
  
  let records = [];
  if (recordIds.length === 0) {
    return records;
  }
  await fetch(`${localStorage.getItem('backEndIP')}/records/${recordIds}`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'get',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => {
          records = response.json();
      });
  return records;
}


async function getUserMeetingTitles(sso) {
  let meetingTitles;
  await fetch(`${localStorage.getItem('backEndIP')}/getMeetingTitles/${sso}`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(result => { meetingTitles = result });
  if (meetingTitles === undefined) {
      meetingTitles = [];
  }
  return meetingTitles;
}

async function getUserMeetings(sso) {
  let meetingTitles;
  await fetch(`${localStorage.getItem('backEndIP')}/getMeetings/${sso}`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(result => { meetingTitles = result });
  if (meetingTitles === undefined) {
      meetingTitles = [];
  }
  return meetingTitles;
}

// function for building tabs in meeting page
async function buildTabs(sso) {
  const meetingTitles = await getUserMeetingTitles(sso);
  let count = 2;
  const tabs = meetingTitles.map(title => ({
      id: count++,
      text: title,
  }));
  const extendedtabs = [{
          id: 0,
          text: 'Agenda/Selection',
      },
      {
          id: 1,
          text: 'Minutes Review',
      }, ...tabs,

  ];
  return extendedtabs;
}

async function getSearchResult(text) {
  let list = [];
  await fetch(`${localStorage.getItem('backEndIP')}/search`, {
          // mode: 'no-cors' // 'cors' by default
          method: 'post',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({text}),
      })
      .then(response => response.json({text}))
      .then(json => {
          list = json;
      });
  return list;
}

