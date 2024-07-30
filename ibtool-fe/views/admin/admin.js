$(async() => {
    // Navigation bar
    $('#longtabs > .tabs-container').dxTabs({
        items: [
            { text: "Import From OBIEE & SFDC" },
            /* { text: "Add Data Manually" },
            { text: "Delete Records" }, */
        ],
        selectedIndex: 0,
        onItemClick(e) {
            switch (e.itemIndex) {
                case (0):
                    {
                        $('#pqm').get(0).style.display = 'block';
                        $('#manual').get(0).style.display = 'none';
                        $('#delete').get(0).style.display = 'none';
                        break;
                    }
                case (1):
                    {
                        $('#pqm').get(0).style.display = 'none';
                        $('#manual').get(0).style.display = 'block';
                        $('#delete').get(0).style.display = 'none';
                        break;
                    }
                case (2):
                    {
                        /* $('#pqm').get(0).style.display = 'none';
                        $('#manual').get(0).style.display = 'none';
                        $('#delete').get(0).style.display = 'block';
                        break; */
                    }
                default:
                    console.log("Nothing to display");
            }
        },
    }).dxTabs('instance');

    //File uploader form for OBIEE
    $('#file-uploader-obiee').dxFileUploader({
        multiple: false,
        name: 'file',
        uploadMode: 'useButtons',
        uploadUrl: `${localStorage.getItem('backEndIP')}/uploadCSV`,
        allowedFileExtensions: ['.csv'],
        dropZone: undefined,
        onUploadStarted: async function() {
            const currentDate = new Date();
            console.log(currentDate);
            const body = {
                key: 'LastComUpdate',
                value: new Date().toLocaleString(),
            }
            fetch(`${localStorage.getItem('backEndIP')}/shared/`, {
                    // mode: 'no-cors' // 'cors' by default
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body),
                })
                .then(response => {
                    console.log('---- fetch response: ', response.json());
                });
        }
    });

    //File uploader form for SFDC
    $('#file-uploader-sfdc').dxFileUploader({
        multiple: false,
        name: 'file',
        uploadMode: 'useButtons',
        uploadUrl: `${localStorage.getItem('backEndIP')}/uploadCSO`,
        allowedFileExtensions: ['.csv'],
        dropZone: undefined,
        //Add time and date of last import to the Dashboard
        onUploadStarted: async function() {
            const currentDate = new Date();
            console.log(currentDate);
            const body = {
                key: 'LastCsoUpdate',
                value: new Date().toLocaleString(),
            }
            fetch(`${localStorage.getItem('backEndIP')}/shared/`, {
                    // mode: 'no-cors' // 'cors' by default
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body),
                })
                .then(response => {
                    console.log('---- fetch response: ', response.json());
                });
        }
    });
});