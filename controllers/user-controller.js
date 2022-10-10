const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error')
const User = require('../models/users')

let dummyUsers = [{ id: 'u1', name: 'Chirag Tilwani', email: 'chiragtilwani08@gmail.com', posts: 3, url: "https://cdn.vox-cdn.com/thumbor/YcVLI8UM9mTyIlDQkodM8dPZ6A4=/0x86:706x557/1220x813/filters:focal(0x86:706x557):format(webp)/cdn.vox-cdn.com/assets/738480/stevejobs.png", coverURL: "https://www.technocrazed.com/wp-content/uploads/2013/04/l9.jpg", bio: 'i am MERN stack develop and this is dummmy bio', password: 'test' }, { id: 'u2', name: 'rahul', email: 'rahulrt@gmail.com', posts: 10, url: "https://pi.tedcdn.com/r/ted-conferences-speaker-photos-production.s3.amazonaws.com/yoa4pm3vyerco6hqbhjxly3bf41d?w=255", coverURL: "https://cdn.mos.cms.futurecdn.net/cbBmRGrZuf7s9JMsEtDs5S-1024-80.jpg.webp", bio: 'fkjajhfkaewbfbakerbggragragahthgahghgfhatethaattrathtakbaargagagarekrgbkajerbg', password: 'test2' }, { id: 'u3', name: 'sid', email: 'stilwani03@gmail.com', posts: 5, url: "https://upload.wikimedia.org/wikipedia/commons/6/69/Mukesh_Ambani.jpg", coverURL: "https://www.deccanherald.com/sites/dh/files/styles/article_detail/public/article_images/2020/05/19/2019-09-05T130129Z_141979623_RC19C06F4950_RTRMADP_3_RELIANCE-RETAIL-BRANDS-1569773604-605607076-1586337213.jpg?itok=dC2bju_T", bio: 'fkjajhfkaewbfbflfdgnhlnglhnlsfnghlgfkhjsjgfhjsgjfhljsfghjkgfjh;jsfghjlfgjhljfglshj', password: 'test3' }]

const getUsers =async (req, res, next) => {
    let foundUsers;
    try{
        foundUsers=await User.find({},'-password') 
    }catch(e){
        return next(new Error('Something went wrong!',500))
    }
    res.status(200).json(foundUsers)
}

const signupUser = async(req, res, next) => {
    const Result = validationResult(req)
    if (!Result.isEmpty()) {
        return next(new HttpError(Result.errors.map(err => err.msg, 422)))
    }
    const { name, email, bio, url, coverURL, password } = req.body
    let foundUser;
    try{
         foundUser =await User.findOne({email:email})
    }catch(err){
        return next(new HttpError("Something went wrong",500))
    }
    if (foundUser) {
        return next(new HttpError("Could not signup,email already exist!", 422))//422-invalid user i/p
    }
    const newUser =new User({name, email, posts: [], url, coverURL, bio, password })
    try{
        await newUser.save()
    }catch(err){
        return next(new HttpError("Could not sign,Please try again later!",500))
    }

    res.status(200).json(newUser)
}

const loginUser = async(req, res, next) => {
    const { email, password } = req.body
    let userFound;
    try{
        userFound =await User.findOne({ email: email})
    }catch(e){
        return next(new HttpError("Something went wrong",500))
    }
    if (!userFound || userFound.password !== password) {
        return next(new HttpError('Could not identify user,credentials seems to be wrong!', 401))//401-authentication failed
    }
    res.json({ message: "logged in successfully" })
}


exports.getUsers = getUsers
exports.loginUser = loginUser
exports.signupUser = signupUser