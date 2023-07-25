const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(cookieParser())
app.use(session({
    secret: "ThisIsMySecret"
}))

const Users = [{
    name: 'Nandhu Santhosh',
    email: "nandhusanthosh87@gmail.com",
    password: "$2b$10$8WR8VcMN.zRDjlsJjf97MONCooECVebam2Do2abZ1nywPlmOHm4LG"
}];

app.get('/', logged, (req, res)=>{
    // console.log(req.cookies.userName)
    res.render('home')
})

app.get('/logout', logged, (req, res)=>{
    req.session.destroy();
    res.redirect('/login')
})


app.get('/signin', logged, (req, res)=>{
    res.render('login-signin', {page : 'signin', error: req.cookies.error})
})

app.post('/signin',logged, async(req, res)=>{
    const {name, email, password} = req.body
    // if the user already logged in then return
    // console.log(name, email, password)
    if(!name || !email || !password){
        res.redirect('/signin')
        return;
    }

    // to check whether the email is already used or not
    if(isEmailAlreadyUsed(email)){
        res.cookie('error', "The email is already associated with an account!")
        res.redirect('/signin')
        return;
    }

    try{
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt)
        // console.log(hashPassword)
        const user = {name, email, password: hashPassword}
        Users.push(user)
        req.session.details = user
        res.cookie('userName', name);
        res.redirect('/')
    }
    catch(err){
        res.send(err.message)
    }
})

app.get('/login',logged, (req, res)=>{
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.render('login-signin', {page : "login", error: req.cookies.error})
})

app.post('/login',logged, async (req, res)=>{
    //N@ndhu!!87
    let userDetails = await checkUserDetails(req.body.email, req.body.password);
    if(userDetails){
        req.session.details = userDetails
        res.cookie('userName', userDetails.name)
        res.redirect('/')
    }
    else{
        res.cookie('error', "Incorrect email or password")
        res.redirect('/login')
    }
})

async function checkUserDetails(email, password){
    for(let i = 0; i<Users.length; i++){
        if(Users[i].email == email){
            // console.log(password)
            let result = await bcrypt.compare(password, Users[i].password)
            if(result){
                return Users[i];
            }
        }
    }
    return false;
}

function logged(req, res, next){
    if(req.session.details){
        if(req.url == '/signin' || req.url == '/login') {
            res.redirect('/')
            return;
        }
    }
    else if(req.url != '/signin' && req.url != '/login'){
         res.redirect('/login')
         return;
    }
    next();   
}

// this function checks whether the email is already associated with any account or not
function isEmailAlreadyUsed(email){
    for(let i = 0; i<Users.length; i++){
        if(Users[i].email == email)
        return true;
    }
    return false;
}

app.listen(3000, ()=>{
    console.log('Server up on port 3000')
})