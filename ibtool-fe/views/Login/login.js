$(async() => {
    const user_register = document.getElementById("user-register");
    const user_login = document.getElementById("user-login");
    const user_forget = document.getElementById("user-forget");
    $("#user-register").submit(async function(event) {
        const firstName = user_register.elements['firstName'].value;
        const lastName = user_register.elements['lastName'].value;
        const email = user_register.elements['email'].value;
        const sso = user_register.elements['sso'].value;
        const password = user_register.elements['password'].value;
        const repeatPassword = user_register.elements['repeatPassword'].value;
        const validPassword = (password == repeatPassword);
        var fail = false;
        event.preventDefault();
        console.log("Valid Password ", validPassword)
        if (!validPassword) {
            DevExpress.ui.notify({
                message: "The passwords entered don't match! Please, make sure you have the same value for both 'Password' and 'Repeat Password'",
                width: 800,
                position: {
                    my: 'center top',
                    at: 'center top',
                },
            }, 'error', 10000);
        } 
        else {
            async function getUserAccessLevel(sso) {
                let accessLevel;
                
                    await fetch(`${localStorage.getItem('backEndIP')}/getAccessLevel/${sso}`, {
                        // mode: 'no-cors' // 'cors' by default
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(response => response.json())
                    .then(result => { accessLevel = result }) 

                console.log("Look at access level ", accessLevel)
                
                return accessLevel;
              }
              
            const AccessLevel = await getUserAccessLevel(sso);
            const body = {
                firstName,
                lastName,
                email,
                sso,
                password,
                repeatPassword,
                AccessLevel,
            }
            await fetch(`${localStorage.getItem('backEndIP')}/auth/signup`, {
                    // mode: 'no-cors' // 'cors' by default
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body),
                })
                .then(response => {
                    if (response.status == 500) fail = true;
                    else fail = false;
                    //Even if a 422 error is thrown, nothing is returned. Thus, the response status is 500. 
                });
                
            if (fail) {
                DevExpress.ui.notify({
                    message: "Your SSO Number is not valid. Please contact administrator.",
                    width: 800,
                    position: {
                        my: 'center top',
                        at: 'center top',
                    },
                }, 'error', 10000);
            } else {
                DevExpress.ui.notify({
                    message: "You account has just been created. Thanks for signing up. Click on 'Already have an account? Login!' to login.",
                    width: 800,
                    position: {
                        my: 'center top',
                        at: 'center top',
                    },
                }, 'success', 10000);
            }

        }
    });
        
        

    $("#user-login").submit(async function(event) {
        const sso = user_login.elements['sso'].value;
        const password = user_login.elements['password'].value;

        const body = {
            sso,
            password,
        }
        event.preventDefault();
        let success = false;
        await fetch(`${localStorage.getItem('backEndIP')}/auth/login`, {
                // mode: 'no-cors' // 'cors' by default
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            })
            .then(response => {
                if (response.status == 200) success = true;
            });
        if (success) {
            console.log('---- login successful');
            // window.location.href = `/homepage.html?sso=${sso}`;
            async function getUserAccessLevel(sso) {
                let accessLevel;
                await fetch(`${localStorage.getItem('backEndIP')}/getAccessLevel/${sso}`, {
                        // mode: 'no-cors' // 'cors' by default
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(response => response.json())
                    .then(result => { accessLevel = result });
               
                return accessLevel;
              }
              
            const AccessLevel = await getUserAccessLevel(sso);
            console.log(AccessLevel);

            if (AccessLevel == 'IB'){
                window.location.href = '/homepage.html';
            }
            else {
                window.location.href = '/views/com-cso-list/com-cso-list.html';
            }
            
            localStorage.setItem('CURRENT_USER_SSO', sso);
        } else {
            console.log('---- login failed');
            DevExpress.ui.notify({
                message: "Either your SSO Number or password is incorrect. Please try again",
                width: 800,
                position: {
                    my: 'center top',
                    at: 'center top',
                },
            }, 'error', 10000);
        }
    });

    $("#user-forget").submit(async function(event) {
        const email = user_forget.elements['email'].value;
        console.log(
            "email : ", email,
        );
        const body = {
            email,
        }
        await fetch(`${localStorage.getItem('backEndIP')}/auth/requestResetPassword`, {
                // mode: 'no-cors' // 'cors' by default
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            })
            .then(response => {
                console.log('---- forgot password response: ', response.json());
            });
        event.preventDefault();
    });
})