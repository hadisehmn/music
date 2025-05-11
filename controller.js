const express = require('express')
const app = express()
app.use(express.json());
require('./middleware')
const JWT_SECRET = 'Hadis Kootoleh';
const service = require('./service')


app.get('/music/:search_term', async (req, res) => {
    try {
        const list = await service.Search_Between_Artists_Or_Music(req.params.search_term)
        return res.send(list)
    } catch (error) {
        console.log(error);
        res.statusCode = 400
        return res.end()    
    }
})

app.get('/playlist/:user_id', async (req, res, next) => {
    try {
        const list = await service.Playlist_By_Userid(req.params.user_id)
        return res.send(list)
    } catch (error) {
        console.log(error);
        res.statusCode = 400
        return res.end()    
    }
}, (req, res) => {
    console.log('after ware');
})      
console.log()


app.get('/playlistname/:search_term/:user_id/', async (req, res) => {
    try {
    
        const list = await service.Playlist_By_Playlist_Name_And_Song(req.params.search_term,req.params.user_id)
        return res.send(list)
    } catch (error) {
        console.log(error);
        res.statusCode = 400
        return res.end()    
    }
})

app.get('/playlistid/:playlist_id', async (req, res) => {
    try {
        const list = await service.Playlist(req.params.playlist_id)
        return res.send(list)
    } catch (error) {
        console.log(error);
        res.statusCode = 400
        return res.end()    
    }
})      


app.delete('/deletmusic/:music_id/:user_id', async (req, res) => {
   // console.log(music_id, user_id); 

    try {
        await service.Del_Music_From_Playlist(req.params.music_id,req.params.user_id)
        return res.send()
    } catch (error) {
        console.log(error);
        res.statusCode = 400
        return res.end()    
    }
})



app.delete('/deletmusicid/:music_id/:user_id', async (req, res) => { 
     try {
         await service.Del_Music_From_Music(req.params.music_id,req.params.user_id)
         return res.send()
     } catch (error) {
         console.log(error);
         res.statusCode = 400
         return res.end()    
     }
 })

app.delete('/deletplaylist/:playlist_id/:user_id', async (req, res) => { 
    try {
        await service.Del_Playlist(req.params.playlist_id,req.params.user_id)
        return res.send()
    } catch (error) {
        console.log(error);
        res.statusCode = 400
        return res.end()    
    }
})


app.patch('/updateplaylistN/:search_term/:playlist_id/:user_id/', async (req, res) => { 
    try {
        await service.Update_Playlist_name(req.params.search_term,req.params.playlist_id,req.params.user_id)
        return res.send()
    } catch (error) {
        console.log(error);
        res.statusCode = 400
        return res.end()    
    }
})

app.patch('/addmusic/:playlist_id/:music_id/:user_id', async (req, res) => { 
    try {
        await service.Update_Playlist_Add_Song(req.params.playlist_id,req.params.music_id,req.params.user_id)
        return res.send()
    } catch (error) {
        console.log(error);
        res.statusCode = 400
        return res.end()    
    }
})
app.post('/signup/', async (req, res) => { 
    try {
      const user = await service.Signup(req.params.username,req.params.email,req.params.password)
      return res.status(200).json({ message: 'Login successful', user});
    } catch (error) {
        console.log(error);
        res.statusCode = 400
        return res.status(400).json({ message:'User not found'});
    }
})

 

app.post('/login/', async (req, res) => { 
    try {
        console.log(req.body.username,req.body.email,req.body.password)
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const token = await service.Login(req.body.username,req.body.email,req.body.password);
        return res.status(200).json({ message: 'Login successful', token});
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message:'User or password maybe incorrect'});
    }
})

//this one is test
app.delete('/deletuserid/:user_id/', async (req, res) => { 
    try {
        await service.Del_User_From_User(req.params.user_id)
        return res.send()
    } catch (error) {
        console.log(error);
        res.statusCode = 400
        return res.end()    
    }
})
console.log()



app.listen(9090, () => {
    console.log('Started Server');
})  
