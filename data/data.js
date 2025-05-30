const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')
const filePath = './music_list.db'

class data {
    constructor(filePath) {
      this.filePath = filePath;
      this.connection = null;
    }

    async getDb() {
        if (this.connection) {
          return this.connection;
        }
        try {
          this.connection = await sqlite.open({
            filename: this.filePath,
            driver: sqlite3.Database,
          });

          await this.connection.exec((`CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, username text, email text, password TEXT , follower INT, following INT ,likes INT)`));
          await this.connection.exec(('CREATE TABLE IF NOT EXISTS artist(id INTEGER PRIMARY KEY, artistname TEXT, number_of_follower INT)'))
          await this.connection.exec((`CREATE TABLE IF NOT EXISTS  music (id INTEGER PRIMARY KEY, musicname TEXT, musictime INT,artist_id INT,  artistname TEXT,number_of_likes INT , FOREIGN KEY (artist_id)REFERENCES artist(id))`))
          await this.connection.exec((`CREATE TABLE IF NOT EXISTS Playlist (id INT , playlist_name TEXT, user_id INT, Foreign Key(user_id)REFERENCES user(id))`))
          await this.connection.exec((`CREATE TABLE IF NOT EXISTS playlist_music(playlist_id INT , music_id INT,Foreign Key(music_id)REFERENCES music(id),Foreign Key(playlist_id)REFERENCES playlist(id))`))
          //await connection.exec((`CREATE TABLE IF NOT EXISTS userdata (id INTEGER PRIMARY KEY, password TEXT, user_name TEXT, foreign key(user_name)REFERENCES user(username))`))
      
          
      } catch (error) {
          console.log('error');
          console.error(error);
        } finally {
          return this.connection;
        }
      }


async  SearchBetweenArtistsorMusic(search_term) {
    try {
        const db = await this.getDb();
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

async  PlaylistByUserid(user_id) {
    try {
        const db = await this.getDb();
        const result = await db.all(`SELECT id , playlist_name FROM playlist WHERE user_id =${user_id}`)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}

async  PlaylistByPlaylistNameAndSong(search_term,user_id) {
    try {
        const db = await this.getDb();
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


async  Playlist(playlist_id) {
    try {
        const db = await this.getDb();
        const result = await db.all(`SELECT music.id ,music.musicname , music.musictime , artist.artistname ,playlist.playlist_name
            FROM playlist 
            JOIN playlist_music ON playlist.id=playlist_music.playlist_id
            JOIN music ON playlist_music.music_id=music.id
            JOIN artist ON artist.id = music.artist_id
            WHERE playlist.id = ${playlist_id}`)

        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}

async DelMusicFromPlaylist(music_id, user_id) {
    try {
      const db = await this.getDb();
    const query = `DELETE FROM playlist_music WHERE music_id = ?
    AND playlist_id IN (SELECT id FROM playlist WHERE user_id = ?)`;
      const result = await db.run(query, [music_id, user_id]);
      console.log('Deleted rows from playlist_music:', result.changes);
      return result;
    } catch (error) {
      console.error('Error deleting music from user playlist:', error);
      throw error;
    }
  }


async DelMusicFromMusic(music_id, user_id) {
    try {
      const db = await this.getDb();
      console.log('Deleting music:', music_id);
      const query = `DELETE FROM music WHERE id = ?`;
      const result = await db.run(query, [music_id]);
      console.log('Deleted rows from music:', result.changes);
      return result;
    } catch (error) {
      console.error('Error deleting music:', error);
      throw error;
    }
  }


async  DelPlaylist(playlist_id,user_id) {
    try {
        const db = await this.getDb();
        const result = await db.run(`DELETE FROM playlist WHERE id=${playlist_id} AND 
            id IN(SELECT playlist_id FROM playlist_music
             WHERE playlist_id IN( SELECT id FROM playlist WHERE user_id=${user_id}))`)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
};


async  UpdatePlaylistname(search_term,playlist_id,user_id) {
    try {
        const db = await this.getDb();
        const result = await db.run(`UPDATE playlist  SET playlist_name = '${search_term}' 
            WHERE id = ${playlist_id} AND id IN (SELECT playlist_id FROM playlist_music WHERE user_id = ${user_id})`)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}


async  UpdatePlaylistAddSong(playlist_id,music_id,user_id) {
    try {
        const db = await this.getDb();
        const result = await db.run(`INSERT INTO playlist_music (playlist_id, music_id)SELECT ${playlist_id}, ${music_id}
            WHERE EXISTS (SELECT *FROM playlist
            WHERE id = ${playlist_id} AND user_id = ${user_id})AND NOT EXISTS (SELECT *FROM playlist_music WHERE playlist_id = ${playlist_id} AND music_id = ${music_id});`)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}

// async  Signup(username,email,hashedPassword) {
//     try {

//         const db = await this.getDb();
//         const result = await db.run(`INSERT INTO user (username, email, password) VALUES ('${username}' ,'${email}','${hashedPassword}')`)
      
//         return result
//     } catch (error) {
//         console.log(error);
//         return [];
//     }
// }

// async  Login(username,email) {
//     const db = await this.getDb();
//     const result = await db.get(`SELECT id, username, email, password FROM user WHERE username = '${username}' OR email='${email}'`)
//     const sql = `SELECT id, username, email, password FROM user WHERE username = '${username}' OR email='${email}'`
//     console.log(sql);
    
//     return result
// }

//this one is test 
async  DelUser(user_id) {
    try {
        const db = await this.getDb();
        const result = await db.run(`DELETE FROM playlist_music AND user WHERE user_id = ${user_id})`)
           console.log(result)
        return result
    } catch (error) {
        console.log(error);
        return [];
    }
}

async findUser(username, email) {
    const db = await this.getDb();
    const sql = `SELECT id, username, email, password FROM user WHERE username = ? OR email = ? LIMIT 1`;
    const user = await db.get(sql, [username, email]);
    return user;
  }

 };
 module.exports=data;


