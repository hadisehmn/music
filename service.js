const data = require('./data')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Hadis Kootoleh';



async function hashPassword(password) {
    const saltRounds = 10;  // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);  // Generate the hashed password
    return hashedPassword;
}


async function Search_Between_Artists_Or_Music(search_term) {
    try {
        const list = await data.Search_Between_Artists_Or_Music(search_term)
        return list
    } catch (error) {
        throw error
    }
}


async function Playlist_By_Userid(user_id) {
    try {
        const list = await data.Playlist_By_Userid(user_id)
        return list;
    } catch (error) {
        throw error
    }
}

async function Playlist_By_Playlist_Name_And_Song(search_term,user_id) {
    try {
        const list = await data.Playlist_By_Playlist_Name_And_Song(search_term,user_id)
        return list;
    } catch (error) {
        throw error
    }
}

async function Playlist(playlist_id) {
    try {
        const list = await data.Playlist(playlist_id)
        return list;
    } catch (error) {
        throw error
    }
}

async function Del_Music_From_Playlist(music_id,user_id) {
    try {
        const list = await data.Del_Music_From_Playlist(music_id,user_id)
        return list;
    } catch (error) {
        throw error
    }
}

async function Del_Music_From_Music(music_id,user_id) {
    try {
        const list = await data.Del_Music_From_Music(music_id,user_id)
        return list;
    } catch (error) {
        throw error
    }
}

async function Del_Playlist(playlist_id,user_id) {
    try {
        const list = await data.Del_Playlist(playlist_id,user_id)
        return list;
    } catch (error) {
        throw error
    }
}

async function Update_Playlist_name(search_term,playlist_id,user_id) {
    try {
        const list = await data.Update_Playlist_name(search_term,user_id,playlist_id)
        return list;
    } catch (error) {
        throw error
    }
}

async function Update_Playlist_Add_Song(playlist_id,music_id,user_id) {
    try {
        const list = await data.Update_Playlist_Add_Song(music_id,user_id,playlist_id)
        return list;
    } catch (error) {
        throw error
    }
}


async function Signup(username,email,password) {
    try {

        const hashedPassword = await bcrypt.hash(password,8);  // Generate the hashed password
       const user = await data.Signup(username,email,hashedPassword)
        
        return user;
    } catch (error) {
        throw error
    }
}



async function Login(username,email,password) {
    // const hashedPassword = await bcrypt.hash(password,8);
    const user = await data.Login(username,email,password) 
    if (!user) {  
        throw new Error(`user not found`)
    }
    const Machpass = await bcrypt.compare(password, user.password);
    if (!Machpass) {  
        throw new Error(`password not match`)
    }
    const token = jwt.sign(
       { id: user.id, username: user.username, email: user.email },
        JWT_SECRET, 
       { expiresIn: '1h' } //???  
    );
    return token;
  
};
//this one is test 
async function Del_User(playlist_id,user_id) {

    try {
        const list = await data.Del_Playlist(user_id)
        return list;
    } catch (error) {
        throw error
    }
}
console.log()

module.exports = {  
    Search_Between_Artists_Or_Music,
    Playlist_By_Userid,
    Playlist_By_Playlist_Name_And_Song,
    Playlist,
    Del_Music_From_Playlist,
    Del_Music_From_Music,
    Del_Playlist,
    Update_Playlist_name,
    Update_Playlist_Add_Song,
    Del_User,
    Signup,
    Login,



}
