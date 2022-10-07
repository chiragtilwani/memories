const express = require('express')
const router = express.Router()

const dummyPlace = [
    {
        id: 'p1', name: 'Mysore Palace', postedBy: 'chirag', description: 'Indo-Saracenic palace, completed in 1912, with a grand durbar hall and weekly illuminations.', address: 'Sayyaji Rao Rd, Agrahara, Chamrajpura, Mysuru, Karnataka 570001', url: "https://lh5.googleusercontent.com/p/AF1QipOxM9k1RkWMiEPLGKjZFhMXu6YSkenS0KtlyZLn=w408-h306-k-no", liked: false, n_likes: 0, location: {
            lng: 12.3051682,
            lat: 76.6529862
        }, creatorID: 'u1', postDate: 'sun jul 03 2022'
    }
]

router.get('/:pid',(req,res,next)=>{
    const {pid} = req.params;
    const foundPlace=dummyPlace.find(p=>p.id===pid);
    res.json(foundPlace)
})

module.exports = router