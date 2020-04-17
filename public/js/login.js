const login = async (email,password) =>{
    //console.log(email,password);
  try{const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/user/login',
              
        data: {
            email,
            password
        }
    });


if(res.data.status === 'success'){
    window.setTimeout(()=> {
        location.assign('/home');
    }, 500);
}

    console.log(res);
}catch(err){
    console.log(err, 'This is err in 21 in login.js');
}
};


document.querySelector('.login').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    console.log('This is the email and password: ', email ,' ', password);
    login(email,password);
});

