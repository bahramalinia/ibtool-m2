/* eslint-disable no-undef */
import express from 'express'
import fileUpload from 'express-fileupload';
import {
    loginController,
    signUpController,
    resetPasswordRequestController,
    resetPasswordController,
} from "../controllers/auth-controller";
import { Parser } from 'json2csv';
import { DB_URL } from '../config';
import mongoose from 'mongoose';
import {
    usersDocumentModel,
    recordDocumentModel,
    sharedDataDocumentModel,
    validSSODocumentModel,
    recordCollectionFields,
    appDataDocumentModel,
} from '../models/mongo-models';

require("express-async-errors");
require("dotenv").config();

const redis = require('redis');
const redisCache = require('express-redis-cache');

let TurndownService = require('turndown')
let turndownService = new TurndownService()

let Papa = require('papaparse');
const cors = require('cors');

const app = express();
const DIST_DIR = __dirname;

app.use(express.static(DIST_DIR))
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Custom middleware function to log messages 
const logRequestMiddleware = (req, res, next) => {
  console.log(`Request received at ${req.path}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  // Continue with the request handling
  next();
};

// Use the custom middleware for all routes
app.use(logRequestMiddleware);

mongoose.connect(DB_URL, { useNewUrlParser: true });

const db = mongoose.connection
db.once('open', _ => {
    console.log('Database connected successfully')
})

db.on('error', err => {
    console.error('connection error:', err)
});


const cacheClient = redis.createClient();
const cache = redisCache({ client: cacheClient });
cacheClient.on('error', (err) => {
  console.error('Failed to connect to Redis', err);
  process.exit(1);
});
console.log('Connected to Redis');

//Import COM to DB
app.post('/uploadCSV', async(req, res) => {
    const data = req.files.file.data;
    const obj = JSON.parse(JSON.stringify(data));
    const buffer = new Buffer.from(obj.data)
    const csvString = buffer.toString();

    // running Papa Parse, you just pass it your csv. 
    let csv = Papa.parse(csvString, {
        delimiter: "", // auto-detect 
        newline: "", // auto-detect 
        // quoteChar: '"',
        // escapeChar: '"',
        header: true, // creates array of {head:value} 
        dynamicTyping: false, // convert values to numbers if possible
        skipEmptyLines: true
    });
    const complaints = csv.data;


    // const complaints = csv.data;
    for (const com of complaints) {
        // remove trailing spaces from properties
        for (const [key, value] of Object.entries(com)) {
            const newKey = key.trim();
            delete com[key];
            com[newKey] = value;
        }
        let ID = com['ID'];

        if (ID !== "" && com !== undefined && ID !== undefined) {
            const oldDoc = await recordDocumentModel.findOne({ ID: ID }).exec();

            var issue_description_full = com["Customers Issue Description(Full)"];
            issue_description_full = issue_description_full.replace('Describe what happened (what did the customer see/hear/observe)?', '');
            issue_description_full = issue_description_full.replace('Describe what happened to the patient, including patient outcome:', '<br><b>Patient Impact: </b>');
            issue_description_full = issue_description_full.replace('What interventions were required on part of the clinician?', '<br><b>Intervention :</b> ');
            issue_description_full = "<b>Customer Issue description: </b>" +issue_description_full + "<br><b>FE's Issue Description :</b> " + com["FE's Issue Description(Full)"];
            issue_description_full = issue_description_full + "<br><b>Actions Taken: </b>" + com["Actions Taken / Repairs(Full)"];
            issue_description_full = issue_description_full.replace('What actions were taken or repairs made to resolve this issue?', '');
            issue_description_full = issue_description_full.replace('What type of procedure was being performed?', '<i>Procedure</i>:');
            issue_description_full = issue_description_full.replace('How did the customer recover from this issue?', '<i>- Customer Issue Resolution</i>:');

            var COM_issue_description_full = issue_description_full.replace(/\*/g, '');
            var COM_issue_description_full_markdown = turndownService.turndown(issue_description_full);

            var COMIssueSummary = "<b style='color:#7b30a0'>Priority (context):</b>  ";
            COMIssueSummary=COMIssueSummary+ "<br><b style='color:#7b30a0'>Problem Statement:</b>  "
            COMIssueSummary=COMIssueSummary+"<br><b style='color:#7b30a0'>Root cause:</b>  "
            COMIssueSummary=COMIssueSummary+"<br><b style='color:#7b30a0'>Workaround:</b>  "
            COMIssueSummary=COMIssueSummary+"<br><b style='color:#7b30a0'>Closure criteria:</b>  "
            COMIssueSummary=COMIssueSummary+"<br><b style='color:#7b30a0'>Solution:</b> <br> "
            COMIssueSummary = COMIssueSummary.replace(/\*/g, '');
            var COMIssueSummaryMarkdown = turndownService.turndown(COMIssueSummary);

            const additionalFields = {
                "Analysis Status": "Not Assigned",
                "Type": "Complaint",
                "COM Issue Description (Full)": COM_issue_description_full,
                "COM Issue Description (Full) Markdown": COM_issue_description_full_markdown,
                "COM Issue Summary":COMIssueSummary,
                "COM Issue Summary Markdown":COMIssueSummaryMarkdown,
                "Record Status": "Open",
                "Associated_to_CSO": "NO",
            }
            const extendedCom = {
                ...com,
                ...additionalFields,
            };

            if (oldDoc !== undefined && oldDoc !== null) {
                await recordDocumentModel.updateOne({ ID: ID }, {
                    ...com,
                });
            } else {
                recordDocumentModel.create(extendedCom, function(err, doc) {
                    if (err) return console.log(err);
                    // saved!
                    console.log('Inserted new COM: ', doc.ID, ' to DB');
                });
            }
        };
        // the arrays of csv fields are in the data property 
        res.statusCode = 200;
        // res.send('save to db success');
    }
});
//Import CSO To DB
app.post('/uploadCSO', async(req, res) => {
    const data = req.files.file.data;
    const obj = JSON.parse(JSON.stringify(data));
    const buffer = new Buffer.from(obj.data)
    const csvString = buffer.toString();

    // running Papa Parse, you just pass it your csv. 
    let csv = Papa.parse(csvString, {
        delimiter: "", // auto-detect 
        newline: "", // auto-detect 
        // quoteChar: '"',
        // escapeChar: '"',
        header: true, // creates array of {head:value} 
        dynamicTyping: false, // convert values to numbers if possible
        skipEmptyLines: true
    });
    const CSO = csv.data;

    
    // const complaints = csv.data;
    for (const cso of CSO) {
        // remove trailing spaces from properties
        for (const [key, value] of Object.entries(cso)) {
            const newKey = key.trim();
            delete cso[key];
            cso[newKey] = value;
        }
        let caseNumber = cso['Case Number'];
        if (cso !== undefined && caseNumber !== undefined) {
            const oldDoc = await recordDocumentModel.findOne({ 'Case Number': caseNumber, 'Type':'CSO'}).exec();
            
            var text =  cso["Subject"] + ". " + cso["Description"];

            var CSOIssueSummary = "<b style='color:#7b30a0'>Customer context:</b>  ";
            CSOIssueSummary=CSOIssueSummary+ "<br><b style='color:#7b30a0'>Problem statement:</b>  "+text;
            CSOIssueSummary=CSOIssueSummary+"<br><b style='color:#7b30a0'>Root cause:</b> ";
            CSOIssueSummary=CSOIssueSummary+"<br><b style='color:#7b30a0'>Workaround:</b> ";
            CSOIssueSummary=CSOIssueSummary+ "<br><b style='color:#7b30a0'>Closure criteria:</b> <br> ";
            CSOIssueSummary = CSOIssueSummary.replace(/\*/g, '');
            var CSOIssueSummaryMarkdown = turndownService.turndown(CSOIssueSummary);

            var CSOIssueDescriptionFull = "<b>Subject: </b> " + cso["Subject"];
            CSOIssueDescriptionFull = CSOIssueDescriptionFull + "<br><b>Description: </b> " + cso["Description"];
            CSOIssueDescriptionFull = CSOIssueDescriptionFull.replace(/\*/g, '');
            var CSOIssueDescriptionFullMarkdown = turndownService.turndown(CSOIssueDescriptionFull);


            var CSO_Account_Name;
            if (cso["Account Name"].includes("?") == false) {
                CSO_Account_Name = cso["Account Name"];
            } else {
                CSO_Account_Name = cso["Account Name: Alternate Account Name"]
            };
            var CSO_Email_Title = cso["Case Number"] + " " + cso["Customer Temperature"] + " " + CSO_Account_Name + " " + cso["System ID/Asset ID"];
            var region;
            const Asia = ['AKA', 'China', 'India and South Asia', 'Japan'];
            const EMEA = ['Africa', 'EGM', 'Europe'];
            const others = ['EMEA', 'USCAN', 'LATAM'];
            if (Asia.includes(cso["Acct Global Region"])) {
                region = "ASIA"
            }
            if (EMEA.includes(cso["Acct Global Region"])) {
                region = "EMEA"
            }
            if (others.includes(cso["Acct Global Region"])) {
                switch (cso["Acct Global Region"]) {
                    case "EMEA":
                        region = "EMEA"
                        break;
                    case 'USCAN':
                        region = 'USCAN'
                        break;
                    case 'LATAM':
                        region = 'LATAM'
                        break;
                }
            }
            var markdown = turndownService.turndown(text);
            const extendedCso = {
                ...cso,
                "CSO_Status": "NOT ASSIGNED",
                "Type": "CSO",
                "CSO Issue Summary": CSOIssueSummary,
                "CSO Issue Summary Markdown": CSOIssueSummaryMarkdown,
                "CSO Issue Description (Full)":CSOIssueDescriptionFull,
                "CSO Issue Description (Full) Markdown":CSOIssueDescriptionFullMarkdown,
                "Record Status": "Open",
                "Customer Country": cso["Account Name: Country Name"],
                "CSO_Current_Action_Status": "[Step 2] - Additional info. needed",
                "CSO Email Title": CSO_Email_Title,
                "CSO Account Name": CSO_Account_Name,
                "CSO Region": region,
            };
            if (oldDoc !== undefined && oldDoc !== null) {
                await recordDocumentModel.updateMany({ 'Case Number': caseNumber }, {
                    ...cso,
                });
            } else {
                recordDocumentModel.create(extendedCso, function(err, doc) {
                    if (err) return handleError(err);
                    // saved!
                    console.log('Inserted new CSO id: ', caseNumber, ' to DB');
                });
            }
        }
    };
    res.status = 200;
    res.json({});
})


app.post('/addMeeting/:meetingName/:sso', async(req, res) => {
    const sso = req.params.sso;
    const meetingName = req.params.meetingName;
    const expression = req.body.expression;
    const selectedrowkeys = req.body.selectedRows;
    const Registration_Format = req.body.Registration_Format;
    console.log("selected row keys ", selectedrowkeys[0]);
    // if list of meetings is empty, return
    if (selectedrowkeys.length === 0) {
        res.status = 400;
        res.send('empty list provided');
    }

    const user = await usersDocumentModel.findOne({ sso: sso }).exec();

    let meetingType;
    if (selectedrowkeys.length > 0) {
        const firstRecord = await recordDocumentModel.findOne({ _id: selectedrowkeys[0] }).exec();
        meetingType = firstRecord.Type;
    }

    // create new meeting
    const date = new Date().toLocaleString();
    const meetingToAdd = {
        meetingTitle: meetingName,
        RecordIDs: selectedrowkeys,
        Type: meetingType,
        filterExpression: expression,
        DateCreated: date,
        Registration_Format: Registration_Format,
    };

    user.meetings.push(meetingToAdd);
    user.save();
    console.log("New meeting created. following meeting has been added: " + JSON.stringify(meetingToAdd));
    res.status = 200;
});

app.get('/getMeetingTitles/:sso', cache.route({ expire: 60 }), async(req, res) => {
    const sso = req.params.sso;
    console.log('---sso: ', sso);
    const user = await usersDocumentModel.findOne({ sso: sso }).exec();
    console.log('---user: ', user);
    let meetingTitles = [];
    if (user !== null && user !== undefined) {
        meetingTitles = user.meetings.map(meeting => meeting.meetingTitle);
        res.status = 200;
    } else {
        console.error('user not found')
    }
    res.set('Cache-Control', 'public', 'max-age=60');
    res.json(meetingTitles);
});

app.get('/getUser/:sso', cache.route({ expire: 60 }), async(req, res) => {
    const sso = req.params.sso;
    const user = await usersDocumentModel.findOne({ sso: sso }).exec();
    res.set('Cache-Control', 'public', 'max-age=60');
    res.json(user);
});

app.get('/getAccessLevel/:sso', cache.route({ expire: 60 }), async(req, res) => {
    console.log('------ request received at endpoint /getAccessLevel/:sso');
    const sso = req.params.sso;
    console.log('---sso: ', sso);
    let accessLevel = '';
    const fullAccessLevel = await validSSODocumentModel.findOne({ sso: sso }).exec();
    
    if (fullAccessLevel !== null && fullAccessLevel !== undefined) {
        accessLevel = fullAccessLevel.AccessLevel;
        if (accessLevel !== null && accessLevel !== undefined){
            console.log('--- AccessLevel: ', accessLevel);
            res.status = 200;
        }
        else {
            console.error('Access Level not found for this SSO')
        }
        
    } else {
        console.error('Access Level not found for this SSO')
    }
    res.set('Cache-Control', 'public', 'max-age=60');
    res.status = 200;
    res.json(accessLevel);
});

app.get('/getMeetings/:sso', cache.route({ expire: 60 }), async(req, res) => {
    console.log('------ request received at endpoint /getMeetings/:sso');
    const sso = req.params.sso;
    console.log('---sso: ', sso);
    const user = await usersDocumentModel.findOne({ sso: sso }).exec();
    console.log('--- user: ', user);
    let meetings = [];
    if (user !== null && user !== undefined) {
        meetings = user.meetings;
        res.status = 200;
    } else {
        console.error('user not found')
    }
    res.set('Cache-Control', 'public', 'max-age=60');
    res.status = 200;
    res.json(meetings);
});

app.post('/comassign/:id', async(req, res) => {
    const info = req.body;
    const id = req.params.id;
    //console.log("Changed fields" + JSON.stringify(info) + "Added to Document ID: " + JSON.stringify(id));
    const com = await recordDocumentModel.findOneAndUpdate({ _id: id }, {
        ...com,
        ...info,
    });
    res.statusCode = 200;
});

app.post('/comissueupdate/:id', async (req, res) => {
    try {
      const info = req.body;
      const id = req.params.id;
      const COMIssueSummary = info["COM Issue Summary"];
      const COMIssueSummaryMarkdown =  turndownService.turndown(COMIssueSummary);
      const com = await recordDocumentModel.findOneAndUpdate({ _id: id }, {
          ...com,
          ...info,
          "COM Issue Summary Markdown": COMIssueSummaryMarkdown,
      });
      res.status(200).json(com);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.post('/csoissueupdate/:id', async (req, res) => {
    try {
      const info = req.body;
      const id = req.params.id;
      const CSOIssueSummary = info["CSO Issue Summary"];
      const CSOIssueSummaryMarkdown =  turndownService.turndown(CSOIssueSummary);
      const cso = await recordDocumentModel.findOneAndUpdate({ _id: id }, {
          ...cso,
          ...info,
          "CSO Issue Summary Markdown": CSOIssueSummaryMarkdown,
      });
      res.status(200).json(com);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

app.post('/formupdate/:id', async (req, res) => {
  try {
    const info = req.body;
    const id = req.params.id;
    const com = await recordDocumentModel.findOneAndUpdate({ _id: id }, {
        ...com,
        ...info,
    });
    res.status(200).json(com);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/associated/:id', async(req, res) => {
    const info = req.body;
    const id = req.params.id;
    //console.log("associated fields " + info['Case Number'] + "Added to Document ID: " + id);
    const cso = await recordDocumentModel.findOne({ 'Case Number': info['Case Number'], "ID": null }).exec();
    //console.log("cso found: ", cso["Date/Time Opened"])
    const com = await recordDocumentModel.findOneAndUpdate({ _id: id }, {
        ...com,
        "Case Number": cso['Case Number'],
        "Date/Time Opened": cso['Date/Time Opened'],
        "Customer Country": cso['Account Name: Country Name'],
        /* "Investigation Team": cso['Investigation Team'],
        "Analysis Owner": cso['Analysis Owner'],
        "Application_Feature": cso['Application_Feature'], */
        //"History": `${cso['History']}\ncsoassociatedsana`,
        "CSO Issue Summary": cso['CSO Issue Summary'],
        "Customer Temperature": cso['Customer Temperature'],
        "Associated_to_CSO": 'Yes',
    });

    const comhistories = await recordDocumentModel.findOne({ _id: id }).exec();
    cso["Internal_History"] = `*************<strong> ${comhistories["ID"]}</strong> Is associated to CSO\n ${comhistories["Internal_History"]}*************\n ${cso.Internal_History}`;
    cso["History"] = `*************<strong> ${comhistories["ID"]}</strong> Is associated to CSO\n ${comhistories["History"]}\n ************* ${cso.History} `;
    cso["External_History"] = `*************<strong> ${comhistories["ID"]} </strong> Is associated to CSO\n ${comhistories["External_History"]}\n ************* ${cso.External_History}`;


    //const csoupdate = await recordDocumentModel.findOne({ 'Case Number': info['Case Number'], "ID": null }).exec();;
    const associated_complaints = cso.associated_complaints === undefined ? [com['ID']] : [...cso.associated_complaints, com['ID']]
    cso.associated_complaints = associated_complaints;
    cso.save();
    console.log("csoupdate: ", cso.associated_complaints)

    res.statusCode = 200;
});


app.post('/disassociate/:id', async(req, res) => {
    let query = await recordDocumentModel.findOneAndUpdate({ ID: req.params.id }, { $unset: { "Case Number": "", "CSO Issue Summary": "", "Customer Temperature": "", "Date/Time Opened": "", "Associated_to_CSO": 'No' } }).exec();
    await query.save();
    const cso = await recordDocumentModel.findOne({ 'Case Number': query['Case Number'], "ID": null }).exec();
    var array = cso.associated_complaints
    for (var i = 0; i < array.length; i++) {
        if (array[i] === req.params.id) {
            array.splice(i, 1);
        }
    }
    cso.save();
    console.log("deleted query====", query);
});

app.post('/closureupdate/:id', async(req, res) => {
    const info = req.body;
    const id = req.params.id;
    //console.log("Changed fields" + JSON.stringify(info) + "Added to Document ID: " + id);
    const com = await recordDocumentModel.findOneAndUpdate({ _id: id }, {
        ...com,
        ...info,
    });
    res.statusCode = 200;
});

app.post('/safetyupdate/:id', async(req, res) => {
    const info = req.body;
    const id = req.params.id;
    //console.log("Changed fields" + JSON.stringify(info) + "Added to Document ID: " + id);
    const com = await recordDocumentModel.findOneAndUpdate({ _id: id }, {
        ...com,
        ...info,
    });
    res.statusCode = 200;
});

app.post('/analyseupdate/:id', async(req, res) => {
    //console.log('------------- request received at endpoint /analyseupdate/:id');
    const info = req.body;
    const id = req.params.id;
    //console.log("Changed fields" + JSON.stringify(info) + "Added to Document ID: " + JSON.stringify(id));
    const com = await recordDocumentModel.findOneAndUpdate({ _id: id }, {
        ...com,
        ...info,
    });
    res.statusCode = 200;
});

app.post('/todo_endpoint/:sso', async(req, res) => {
  //console.log('------------- request received at endpoint /analyseupdate/:id');
  const info = req.body;
  let user = await usersDocumentModel.findOne({ sso: req.params.sso }).exec();
  
  res.statusCode = 200;
});

app.post('/comcsolist/:id', async(req, res) => {
    const info = req.body;
    const id = req.params.id;
    //console.log("Changed fields" + JSON.stringify(info) + "Added to Document ID: " + JSON.stringify(id));
    const com = await recordDocumentModel.findOneAndUpdate({ _id: id }, {
        ...com,
        ...info,
    });
    res.statusCode = 200;
});

app.post('/savetodbmeeting/:sso/:meetingid', async(req, res) => {
    const info = req.body;
    const sso = req.params.sso;
    const meetingid = req.params.meetingid;
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
    const tag_next_step = ` </strong><span class="dx-variable" data-var-start-esc-char="[" data-var-end-esc-char="]" data-var-value="Next Step"><span contenteditable="false">[Next Steps]</span></span> `
    const tag_Alert_Escalation = ` </strong><span class="dx-variable" data-var-start-esc-char="[" data-var-end-esc-char="]" data-var-value="Alert Escalation"><span contenteditable="false">[Alert Escalation]</span></span> `
    const tag_comment = ` </strong><span class="dx-variable" data-var-start-esc-char="[" data-var-end-esc-char="]" data-var-value="Comment"><span contenteditable="false">[Comment]</span></span> `
    const text = fiscal + ' [' + info.meetingTitle + ']: ';
    if (info["Registration_Format"] == "External") {
        if (info.Type == "CSO") {
            for (let i = 0; i < info.RecordIDs.length; i++) {
                console.log(info.RecordIDs[i])
                const query = await recordDocumentModel.findOne({ _id: info.RecordIDs[i] }).exec();
                const record = await recordDocumentModel.findOneAndUpdate({ _id: info.RecordIDs[i] }, {
                    "Previous action": query["Next_Action"],
                    "Next_Action": "",
                    "History": `<p> <b> ${text} </b> ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} ${tag_Alert_Escalation} ${query["Alert Escalation"]}</p> ${query["History"]} `,
                    "External_History": `<p><b> ${text} </b> ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} ${tag_Alert_Escalation} ${query["Alert Escalation"]}</p> ${query["External_History"]} `,
                    "Comments": "",
                    "Alert Escalation": "",
                });
            }
        }
        if (info.Type == "Complaint") {
            for (let i = 0; i < info.RecordIDs.length; i++) {
                const query = await recordDocumentModel.findOne({ _id: info.RecordIDs[i] }).exec();
                if (query["Associated_to_CSO"] == "Yes") {
                    const cso = await recordDocumentModel.findOne({ 'Case Number': query['Case Number'], "ID": null }).exec();
                    cso["History"] = `<p> <b> ${text} </b> ${query["ID"]}: ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} </p> ${cso["History"]} `;
                    cso["External_History"] = `<p> <b> ${text} </b> ${query["ID"]}: ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} </p> ${cso["External_History"]} `;
                    cso.save();
                    const record = await recordDocumentModel.findOneAndUpdate({ _id: info.RecordIDs[i] }, {
                        "Previous action": query["Next_Action"],
                        "Next_Action": "",
                        "Comments": "",
                        "Alert Escalation": "",
                    });
                } else {
                    const record = await recordDocumentModel.findOneAndUpdate({ _id: info.RecordIDs[i] }, {
                        "Previous action": query["Next_Action"],
                        "Next_Action": "",
                        "History": `<p> <b> ${text} </b> ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} </p> ${query["History"]} `,
                        "External_History": `<p> <b> ${text} </b> ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} </p> ${query["External_History"]} `,
                        "Comments": "",
                        "Alert Escalation": "",
                    });
                }

            }
        }

    }
    if (info["Registration_Format"] == "Internal") {

        if (info.Type == "CSO") {
            for (let i = 0; i < info.RecordIDs.length; i++) {
                console.log(info.RecordIDs[i])
                const query = await recordDocumentModel.findOne({ _id: info.RecordIDs[i] }).exec();
                const record = await recordDocumentModel.findOneAndUpdate({ _id: info.RecordIDs[i] }, {
                    "Previous action": query["Next_Action"],
                    "Next_Action": "",
                    "Internal_History": `<p> <b> ${text} </b> ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} ${tag_Alert_Escalation} ${query["Alert Escalation"]}</p> ${query["Internal_History"]} `,
                    "History": `<p> <b> ${text} </b> ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} ${tag_Alert_Escalation} ${query["Alert Escalation"]}</p> ${query["History"]} `,
                    "Comments": "",
                    "Alert Escalation": "",
                });
            }
        }
        if (info.Type == "Complaint") {
            for (let i = 0; i < info.RecordIDs.length; i++) {
                const query = await recordDocumentModel.findOne({ _id: info.RecordIDs[i] }).exec();
                if (query["Associated_to_CSO"] == "Yes") {
                    const cso = await recordDocumentModel.findOne({ 'Case Number': query['Case Number'], "ID": null }).exec();
                    cso["History"] = `<p> <b> ${text} </b> ${query["ID"]}: ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} </p> ${cso["History"]} `,
                        cso["Internal_History"] = `<p> <b> ${text} </b> ${query["ID"]}: ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} </p> ${cso["Internal_History"]} `,
                        cso.save();
                    const record = await recordDocumentModel.findOneAndUpdate({ _id: info.RecordIDs[i] }, {
                        "Previous action": query["Next_Action"],
                        "Next_Action": "",
                        "Comments": "",
                        "Alert Escalation": "",
                    });
                } else {
                    const record = await recordDocumentModel.findOneAndUpdate({ _id: info.RecordIDs[i] }, {
                        "Previous action": query["Next_Action"],
                        "Next_Action": "",
                        "History": `<p> <b> ${text} </b> ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} </p> ${query["History"]} `,
                        "Internal_History": `<p> <b> ${text} </b> ${tag_next_step} ${query["Next_Action"]} ${tag_comment} ${query["Comments"]} </p> ${query["Internal_History"]} `,
                        "Comments": "",
                        "Alert Escalation": "",
                    });
                }

            }
        }
        
    }

    res.statusCode = 200;
});

app.post('/internalhistory/:id', async(req, res) => {
    const info = req.body;
    const id = req.params.id;
    //console.log("new internal hisotry" + JSON.stringify(info) + "\nAdded to Document ID: " + JSON.stringify(id));   
    const com = await recordDocumentModel.findOne({ _id: id }).exec();
    //console.log('---- com to update: ', com);
    if (com["Internal_History"] == null) {
        com["Internal_History"] = `${info.Internal_History}\n`;

        if (com["History"] == null) {
            com["History"] = `${info.Internal_History}\n`;
             }
        else {
            com["History"] = `${info.Internal_History}\n${com["History"]}`;
            }

    } else {
        com["Internal_History"] = `${info.Internal_History}\n${com["Internal_History"]}`;
        if (com["History"] == null) {
            com["History"] = `${info.Internal_History}\n`;
             }
        else {
            com["History"] = `${info.Internal_History}\n${com["History"]}`;
            }
    }

    await com.save();
    res.json(com["Internal_History"]);
    res.statusCode = 200;
});

app.post('/externalhistory/:id', async(req, res) => {
    const info = req.body;
    const id = req.params.id;
    const com = await recordDocumentModel.findOne({ _id: id }).exec();
    console.log('---- com to update: ', com);
    if (com["External_History"] == null) {
        com["External_History"] = `${info.External_History}\n`;
        if (com["History"] == null) {
            com["History"] = `${info.External_History}\n`;
             }
        else {
            com["History"] = `${info.External_History}\n${com["History"]}`;
            }
    } else {
        com["External_History"] = `${info.External_History}\n${com["External_History"]}`;
        if (com["History"] == null) {
            com["History"] = `${info.External_History}\n`;
             }
        else {
            com["History"] = `${info.External_History}\n${com["History"]}`;
            }
    }
    await com.save();
    res.json(com["External_History"]);
    res.statusCode = 200;
});

app.post('/editinternalhistory/:id', async(req, res) => {
    const info = req.body;
    const id = req.params.id;
    console.log("Changed fields" + JSON.stringify(info) + "Added to Document ID: " + JSON.stringify(id));
    const com = await recordDocumentModel.findOneAndUpdate({ _id: id }, {
        ...com,
        ...info,
    });
    res.statusCode = 200;
});

app.post('/shared', async(req, res) => {
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const key = req.body.key;
    const value = req.body.value;
    var query = {
        key,
    };
    const update = {
        key,
        value,
    };
    console.log('query: ', query);
    console.log('update: ', update);
    // Find the document
    sharedDataDocumentModel.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) {
            res.status = 400;
            res.json({msg: "Failed"});
            console.log('Insert failed');
        }
        else {
          res.status = 200;
          res.json({msg: "Success"});
          console.log('new key value added: ', result);
        }
    });

});

app.get('/readlastimport/:key', async(req, res) => {
    const queryResult = await sharedDataDocumentModel.findOne({ key: req.params.key }).exec();
    res.status = 200;
    res.json(queryResult);
});

app.get('/getMyAnalysis/:username', cache.route({ expire: 60 }), async (req, res) => {
  const username = req.params.username;
  const nameArray = username.split(' ');
  const firstName = nameArray[0];
  const lastName = nameArray[1];

  try {
      const userinfo = await usersDocumentModel.find({
          $and: [
              { firstName: { $eq: firstName } },
              { lastName: { $eq: lastName } }
          ]
      });

      if (userinfo.length === 0) {
          return res.status(404).json({ error: "User not found" });
      }

      if (userinfo[0].AccessLevel === "Engineering") {
          if (userinfo[0].TeamName) {
              const TeamName = userinfo[0].TeamName;
              const queryResult = await recordDocumentModel.find({ "Analysis Status": { $nin: ["Closed", "Cancelled", "Not Assigned", "Transferred", "Duplicate"] }, "Team Name": TeamName }).exec();
              res.set('Cache-Control', 'public, max-age=60');
              return res.status(200).json(queryResult);
          } else {
            const queryResult = await recordDocumentModel.find({ "Analysis Status": { $nin: ["Closed", "Cancelled", "Not Assigned", "Transferred", "Duplicate"] }, "PO Review": username }).exec();
            res.set('Cache-Control', 'public, max-age=60');
            return res.status(200).json(queryResult);
          }
      } else if (userinfo[0].AccessLevel === "Marketing") {
          const queryResult = await recordDocumentModel.find({ "Analysis Status": { $nin: ["Closed", "Cancelled", "Not Assigned", "Transferred", "Duplicate"] }, "marketing": username }).exec();
          res.set('Cache-Control', 'public, max-age=60');
          return res.status(200).json(queryResult);
      } else {
          const queryResult = await recordDocumentModel.find({ "Analysis Status": { $nin: ["Closed", "Cancelled", "Not Assigned", "Transferred", "Duplicate"] }, "Analysis Owner": username }).exec();
          res.set('Cache-Control', 'public, max-age=60');
          return res.status(200).json(queryResult);
      }
  } catch (error) {
      console.error("Error occurred while processing request:", error);
      return res.status(500).send("Internal server error");
  }
});


app.get('/getCOMCSOList', cache.route({ expire: 60 }), async(req, res) => {
    console.log('------ request received at endpoint /getCOMCSOList');
    // only com
    const queryResult1 = await recordDocumentModel.find({
      "Case Number": null, 
      "ID": {$ne: null}, 
      "Analysis Status": { 
        $nin: ["Closed", "Cancelled", "Not Assigned", "Transferred", "Duplicate"]},
      associated_complaints: [],
    }).exec();
    // only cso
    const queryResult2 = await recordDocumentModel.find({
      "Case Number": {$ne: null}, 
      "ID": null, 
      "CSO_Status": {$nin: ["CLOSED", "CANCELLED"]},
      associated_complaints: [],
    }).exec();    
    // com + cso
    const queryResult3 = await recordDocumentModel.find({ $or:[{  "Case Number": {$ne: null}, 
    "ID": {$ne: null}, 
    "CSO_Status": {$nin: ["CLOSED", "CANCELLED"]},
    //"Type": "CSO",
    associated_complaints: [],},{"Case Number": {$ne: null}, 
    "ID": {$ne: null}, 
    //"Type": "Complaint",
    "Analysis Status": { 
      $nin: ["Closed", "Cancelled", "Not Assigned", "Transferred", "Duplicate"]},
   associated_complaints: [],}]
    
    }).exec();


    const queryResult5 = await recordDocumentModel.find({
      "Case Number": {$ne: null}, 
      "ID": null, 
      "CSO_Status": ["CLOSED", "CANCELLED"],
      "Analysis Status": { 
        $nin: ["Closed", "Cancelled", "Not Assigned", "Transferred", "Duplicate"]},
      associated_complaints: [],
    }).exec(); 

    const result = [
      ...queryResult1,
      ...queryResult2,
      ...queryResult3,
      ...queryResult5,
    ];

    res.set('Cache-Control', 'public', 'max-age=60');
    res.status = 200;
    res.json(result);
});

app.get('/getMeetingList', cache.route({ expire: 60 }), async(req, res) => {
  console.log('------ request received at endpoint /getMeetingList');
  // only com
  const queryResult1 = await recordDocumentModel.find({
    "Type": "Complaint",
    "Analysis Status": { 
      $nin: ["Closed", "Cancelled", "Not Assigned", "Transferred", "Duplicate"]},
  }).exec();
  
  const queryResult2 = await recordDocumentModel.find({
    "Type": "CSO",
      "CSO_Status": {$nin: ["CLOSED", "CANCELLED"]},
  }).exec();

  const result = [
    ...queryResult1,
    ...queryResult2,
  ];
  res.set('Cache-Control', 'public', 'max-age=60');
  res.status = 200;
  res.json(result);
});


app.get('/getAllRecords', cache.route({ expire: 60 }), async(req, res) => {
    console.log('------ request received at endpoint /getAllRecords');
    const queryResult = await recordDocumentModel.find({ associated_complaints: [] }).exec();
    res.set('Cache-Control', 'public', 'max-age=60');
    res.status = 200;
    res.json(queryResult);
});
app.post('/search', cache.route({ expire: 60 }), async(req, res) => {
  console.log('------ request received at endpoint /search');
  
  const text = req.body.text;
  const comRegex = new RegExp('^COM-[0-9]{8}$');
  const digitRegex = new RegExp('^0\d{7}$');
  let queryResult;
  
  if (comRegex.test(text)) {
      queryResult = await recordDocumentModel.find({"ID": text}).exec();
  } else if (digitRegex.test(text)) {
      queryResult = await recordDocumentModel.find({"Case Number": text}).exec();
  } else {
      queryResult = await recordDocumentModel.find({ $text: { $search: req.body.text } }).exec();
  }
  res.status = 200;
  res.json(queryResult);
});

app.get('/getNotAssignedCSO', cache.route({ expire: 60 }), async(req, res) => {
    console.log('------ request received at endpoint /getNotAssignedCSO');
    const queryResult = await recordDocumentModel.find({ "CSO_Status": "NOT ASSIGNED" }).exec();
    res.set('Cache-Control', 'public', 'max-age=60');
    res.status = 200;
    res.json(queryResult);
});

app.get('/getNotAssignedCOM', cache.route({ expire: 60 }), async(req, res) => {
    console.log('------ request received at endpoint /getNotAssignedCOM');
    const queryResult = await recordDocumentModel.find({ "Analysis Status": "Not Assigned", "Type": "Complaint" }).exec();
    res.set('Cache-Control', 'public', 'max-age=60');
    res.status = 200;
    res.json(queryResult);
});

app.get('/readCOMDetails/:com_id', cache.route({ expire: 60 }), async(req, res) => {
    const com = req.params.com_id;
    const queryResult = await recordDocumentModel.findOne({ ID: req.params.com_id }).exec();
    res.set('Cache-Control', 'public', 'max-age=60');
    res.status = 200;
    res.json(queryResult);
});

app.get('/records/:recordIds', cache.route({ expire: 60 }), async(req, res) => {
    const recordIds = req.params.recordIds.split(',');
    const t = recordIds.map(r => mongoose.Types.ObjectId(r));
    const queryResult = await recordDocumentModel.find({ _id: { $in: t } }).exec();
    res.set('Cache-Control', 'public', 'max-age=60');
    res.status = 200;
    res.json(queryResult);
});

app.get('/readCSODetails/:cso_id', cache.route({ expire: 60 }), async(req, res) => {
    const cso = req.params.cso_id;
    const queryResult = await recordDocumentModel.findOne({ 'Case Number': req.params.cso_id, 'ID': null }).exec();
    res.set('Cache-Control', 'public', 'max-age=60');
    res.status = 200;
    res.json(queryResult);
});


app.post('/deletemeeting/:sso/:meetingid', async(req, res) => {
    console.log('------ request received at endpoint /deletemeeting');
    let user = await usersDocumentModel.findOne({ sso: req.params.sso }).exec();
    let userMeetings = user.meetings;
    userMeetings = userMeetings.filter(m => m._id.toString() !== req.params.meetingid);
    user.meetings = userMeetings;
    await user.save();
    console.log("deleted meeting with key", req.params.meetingid);
});

app.post('/meetingupdate/:sso/:meetingid', async(req, res) => {
    let user = await usersDocumentModel.findOne({ sso: req.params.sso }).exec();
    /* const com = await usersDocumentModel.findOneAndUpdate({ sso: req.params.sso }, {
        ...com,
        ...info,
    }); */
    for (let i = 0; i < user.meetings.length; i++) {
        if (user.meetings[i]._id == req.params.meetingid) {
            //console.log(user.meetings[i], "body: ", req.body)
            const array = {
                ...user.meetings[i],
                ...req.body
            }
            console.log("user.meetings: ", array)
        }
    }
});

app.post('/refreshmeeting/:sso/:rowindex', async(req, res) => {
    let user = await usersDocumentModel.findOne({ sso: req.params.sso }).exec();
    /* const com = await usersDocumentModel.findOneAndUpdate({ sso: req.params.sso }, {
        ...com,
        ...info,
    }); */
    const rowindex = req.params.rowindex;
    user.meetings[rowindex]["DateCreated"] = new Date().toLocaleString();
    user.meetings[rowindex]["RecordIDs"] = req.body;
    await user.save();
    console.log(user.meetings[rowindex]["DateCreated"]);
});



app.post("/auth/login", loginController);
app.post("/auth/signup", signUpController);
app.post("/auth/requestResetPassword", resetPasswordRequestController);
app.post("/auth/resetPassword", resetPasswordController);

app.get('/export', cache.route({ expire: 60 }), async function(req, res) {
    console.log('----- request received at endpoint /export');
    const data = await recordDocumentModel.find({}).exec();
    const fields = Object.keys(recordCollectionFields);
    const json2csv = new Parser({ fields: fields });
    try {
        const csv = json2csv.parse(data)
        res.set('Cache-Control', 'public', 'max-age=60');
        res.attachment('data.csv')
        res.status(200).send(csv)
    } catch (error) {
        console.log('error:', error.message)
        res.status(500).send(error.message)
    }
});

app.post('/addValidSSO', function(req, res) {
    const receivedSSOs = req.body;
    if (Array.isArray(receivedSSOs)) {
        const ssoDocs = [];
        receivedSSOs.forEach(s => {
            ssoDocs.push({
                sso: s,
            });
        });
        validSSODocumentModel.insertMany(ssoDocs, { ordered: false }, function(error, docs) {
            if (error) {
                console.log('--- error: ', error);
            }
        });
        res.status(200).send('valid sso list updated');
    }
});

app.get('/getValidSSO', async function(req, res) {
    const ssoList = await validSSODocumentModel.find({}).exec();
    res.status(200).json(ssoList);
});

app.get('/appData', cache.route({ expire: 60 }), async function(req, res) {
  const appData = await appDataDocumentModel.find({}).exec();
  res.status(200).json(appData);
});

const PORT = 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
});