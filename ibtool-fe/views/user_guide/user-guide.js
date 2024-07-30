$(() => {
    $('#longtabs > .tabs-container').dxTabs({
        items: [
            { text: "Import" },
            { text: "Assignment" },
            { text: "Analysis" },
            { text: "Export" },
            { text: "Meetings" },
            //{ text: "CSO Information" },
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
                        //$('#container-cso-information').get(0).style.display = 'none';
                        break;
                    }
                case (1):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'block';
                        $('#container-Safety-Regulatory').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        //$('#container-cso-information').get(0).style.display = 'none';
                        break;
                    }
                case (2):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-Safety-Regulatory').get(0).style.display = 'block';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        //$('#container-cso-information').get(0).style.display = 'none';
                        break;
                    }
                case (3):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-Safety-Regulatory').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'block';
                        $('#container-com-cso-association').get(0).style.display = 'none';
                        //$('#container-cso-information').get(0).style.display = 'none';
                        break;
                    }
                case (4):
                    {
                        $('#container-analysis-management').get(0).style.display = 'none';
                        $('#container-closure-information').get(0).style.display = 'none';
                        $('#container-Safety-Regulatory').get(0).style.display = 'none';
                        $('#container-other-information').get(0).style.display = 'none';
                        $('#container-com-cso-association').get(0).style.display = 'block';
                        //$('#container-cso-information').get(0).style.display = 'none';
                        break;
                    }
                default:
                    console.log("nothing to display");
            }
        },
    }).dxTabs('instance');
});