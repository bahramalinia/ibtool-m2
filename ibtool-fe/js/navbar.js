function highlightActiveNavbar() {
    const url = window.location.href;
    const index = url.lastIndexOf('/');
    let page = url.split('/');
    page = page[page.length - 1].split('.')[0];
    const pageNavbarMap = {
        'homepage': 'Dashboard',
        'my-analysis': 'My Analysis',
        'com-cso-list': 'COM/CSO List',
        'meeting': 'Meetings',
        'charts': 'Charts'
    }

    if (page !== undefined && pageNavbarMap[page] !== undefined) {
        const e = $(`.navbar-nav .nav-item span:contains(${pageNavbarMap[page]})`)
            .closest('.navbar-nav .nav-item');
        e.addClass('active');
    } else {
        $(".navbar-nav .nav-item").first().addClass('active')
    }
}