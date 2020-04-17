const signup = async (name, email,password, passwordConfirm) =>{
    console.log(name,email,password,passwordConfirm);
  try{const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/user/signup',
              
        data: {
            name,
            email,
            password,
            passwordConfirm
        }
    });



    window.setTimeout(()=> {
        location.assign('/home');
    }, 500);


 //   console.log(res);
}catch(err){
   // console.log(err, 'This is err in 21 in signup.js');
}
};


document.querySelector('.signup').addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('Name').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    const passwordConfirm = document.getElementById('PasswordConfirm').value;
    console.log('This is the email and password: ', email ,' ', password);
    signup(name,email,password,passwordConfirm);
});

