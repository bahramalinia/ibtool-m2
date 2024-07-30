// Calendar in Dashboard 
$(() => {
    const zoomLevels = ['month', 'year', 'decade', 'century'];
    const date = new Date().getTime();
    const today = new Date().toDateString();

    const calendar = $('#calendar-container').dxCalendar({
        value: new Date(),
        disabled: false,
        firstDayOfWeek: 1,
        showWeekNumbers: true,
        zoomLevel: zoomLevels[0],
        onValueChanged(data) {
            selectedDate.option('value', data.value);
        },
        onOptionChanged(data) {
            if (data.name === 'zoomLevel') {
                calendar.option('zoomLevel', data.value);
            }
        },
    }).dxCalendar('instance');
    $('#dateCalendar').append(today);

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

    $('#fiscalWeek').append(getTwodigitYear + "_" + "FW" + weekNr + "." + dayNr);
});