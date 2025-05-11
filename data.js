//const { sign } = require('jsonwebtoken');
const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')
const filePath = './music_list.db'

let connection;

async function getDb() {
  if (connection) {
    return connection;
  }

  try {
    connection = await sqlite.open({
      filename: filePath,
      driver: sqlite3.Database,
    })
    await connection.exec((`CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, username text, email text, password TEXT , follower INT, following INT ,likes INT)`));
    await connection.exec(('CREATE TABLE IF NOT EXISTS artist(id INTEGER PRIMARY KEY, artistname TEXT, number_of_follower INT)'))
    await connection.exec((`CREATE TABLE IF NOT EXISTS  music (id INTEGER PRIMARY KEY, musicname TEXT, musictime INT,artist_id INT,  artistname TEXT,number_of_likes INT , FOREIGN KEY (artist_id)REFERENCES artist(id))`))
    //music =>artist id (artist)
    await connection.exec((`CREATE TABLE IF NOT EXISTS Playlist (id INT , playlist_name TEXT, user_id INT, Foreign Key(user_id)REFERENCES user(id))`))
    //playlist=>user id (user)
    await connection.exec((`CREATE TABLE IF NOT EXISTS playlist_music(playlist_id INT , music_id INT,Foreign Key(music_id)REFERENCES music(id),Foreign Key(playlist_id)REFERENCES playlist(id))`))
    //playlist=>playlists id (playlists) and music id (music)
    //await connection.exec((`CREATE TABLE IF NOT EXISTS userdata (id INTEGER PRIMARY KEY, password TEXT, user_name TEXT, foreign key(user_name)REFERENCES user(username))`))

    
} catch (error) {
    console.log('error');
    console.error(error);
  } finally {
    return connection;
  }
}

  
async function Search_Between_Artists_Or_Music(search_term) {
    //search with srtist or music name
    try {
        const db = await getDb();
        const artistResult = await db.all(`SELECT artist.artistname FROM artist WHERE artist.artistname LIKE'%${search_term}%'`)
        const musicResult = await db.all(`SELECT artist.artistname,music.musicname FROM music JOIN artist ON artist.id=music.artist_id WHERE music.musicname LIKE'%${search_term}%'`)
        const mergedResults = artistResult.concat(musicResult);

        return mergedResults
    } catch (error) {
        console.log('testtt');
        console.error(error);
        return [];
    }
}
 
async function Playlist_By_Userid(user_id) {
    try {
        const db = await getDb();
        const result = await db.all(`SELECT id , playlist_name FROM playlist WHERE user_id =${user_id}`)
        // (`SELECT playlist.id , playlist_name, music.artistname FROM playlist JOIN music ON playlist_music.musicid=music.musicid
        //     WHERE user_id = '%${user_id}%' AND playlist.userid='%${user_id}%'`)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function Playlist_By_Playlist_Name_And_Song(search_term,user_id) {
    try {
        const db = await getDb();
        const result = await db.all(` SELECT playlist.playlist_name, music.musicname, artist.artistname
            FROM playlist
            JOIN playlist_music ON playlist.id = playlist_music.playlist_id
            JOIN music ON playlist_music.music_id = music.id
            JOIN artist ON music.artist_id = artist.id
            WHERE (playlist.playlist_name LIKE '%${search_term}%' OR music.musicname LIKE '%${search_term}%')
           AND playlist.user_id=${user_id}`)
        
    
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}


async function Playlist(playlist_id) {
    try {
        const db = await getDb();
        const result = await db.all(`SELECT music.id ,music.musicname , music.musictime , artist.artistname ,playlist.playlist_name
            FROM playlist 
            JOIN playlist_music ON playlist.id=playlist_music.playlist_id
            JOIN music ON playlist_music.music_id=music.id
            JOIN artist ON artist.id = music.artist_id
            WHERE playlist.id = ${playlist_id}`)
         //  (`SELECT music.music_id ,music.musicname , music.musictime , artist.artistname FROM music JOIN artist ON artist.id = music.artist_id`)

        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}


async function Del_Music_From_Playlist(music_id,user_id) {
    try {
        const db = await getDb();
        const result = await db.run(`DELETE FROM playlist_music 
            WHERE music_id = ${music_id} AND playlist_id IN (SELECT id FROM playlist WHERE user_id = ${user_id})`)
           // console.log(result)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function Del_Music_From_Music(music_id,user_id) {
    try {
        const db = await getDb();
        const result = await db.run(`DELETE FROM music WHERE id=${music_id} AND 
            id IN(SELECT music_id FROM playlist_music
             WHERE playlist_id IN( SELECT id FROM playlist WHERE user_id=${user_id}))`)
           // console.log(result)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function Del_Playlist(playlist_id,user_id) {
    try {
        const db = await getDb();
        const result = await db.run(`DELETE FROM playlist WHERE id=${playlist_id} AND 
            id IN(SELECT playlist_id FROM playlist_music
             WHERE playlist_id IN( SELECT id FROM playlist WHERE user_id=${user_id}))`)
           // console.log(result)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}


async function Update_Playlist_name(search_term,playlist_id,user_id) {
    try {
        const db = await getDb();
        const result = await db.run(`UPDATE playlist  SET playlist_name = '${search_term}' 
            WHERE id = ${playlist_id} AND id IN (SELECT playlist_id FROM playlist_music WHERE user_id = ${user_id})`)
           // console.log(result)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}


async function Update_Playlist_Add_Song(playlist_id,music_id,user_id) {
    try {
        const db = await getDb();
        const result = await db.run(`INSERT INTO playlist_music (playlist_id, music_id)SELECT ${playlist_id}, ${music_id}
            WHERE EXISTS (SELECT *FROM playlist
            WHERE id = ${playlist_id} AND user_id = ${user_id})AND NOT EXISTS (SELECT *FROM playlist_music WHERE playlist_id = ${playlist_id} AND music_id = ${music_id});`)
         //   console.log(result)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function Signup(username,email,hashedPassword) {
    try {

        const db = await getDb();
        const result = await db.run(`INSERT INTO user (username, email, password) VALUES ('${username}' ,'${email}','${hashedPassword}')`)
        // password_hash
        //   console.log(result)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function Login(username,email) {
    const db = await getDb();
    const result = await db.get(`SELECT id, username, email, password FROM user WHERE username = '${username}' OR email='${email}'`)
    // password_hash
    return result
}

//this one is test 
async function Del_User(user_id) {
    try {
        const db = await getDb();
        const result = await db.run(`DELETE FROM playlist_music AND user WHERE user_id = ${user_id})`)
           console.log(result)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}


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



