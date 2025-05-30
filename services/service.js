
const data = require('../data/data');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../logger');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

class service {
  constructor(data) {
    this.data = data;
  }

  async hashPassword(password) {
    logger.debug('Hashing password');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async SearchBetweenArtistsorMusic(search_term) {
    try {
      logger.info(`Searching artists/music with term: "${search_term}"`);
      return await this.data.SearchBetweenArtistsorMusic(search_term);
    } catch (error) {
      logger.error(`Error searching music: ${error.message}`, { error });
      throw error;
    }
  }

  async PlaylistByUserid(user_id) {
    try {
      logger.info(`Fetching playlists for user: ${user_id}`);
      return await this.data.PlaylistByUserid(user_id);
    } catch (error) {
      logger.error(`Failed to get playlists by user ID ${user_id}: ${error.message}`, { error });
      throw error;
    }
  };

  async PlaylistByPlaylistNameAndSong(search_term, user_id) {
    try {
      logger.info(`Searching playlists with term "${search_term}" for user: ${user_id}`);
      const list = await this.data.PlaylistByPlaylistNameAndSong(search_term, user_id);
      return list;
    } catch (error) {
      logger.error(`Failed to search playlists by name or song with term "${search_term}" for user ${user_id}: ${error.message}`, { error });
      throw error;
    }
  };
  async Playlist(playlist_id) {
    try {
      logger.info(`Fetching playlist with ID: ${playlist_id}`);
      const list = await this.data.Playlist(playlist_id);
      return list;
    } catch (error) {
      logger.error(`Failed to fetch playlist with ID ${playlist_id}: ${error.message}`, { error });
      throw error;
    }
  }
  
  async DelMusicFromPlaylist(music_id, user_id) {
    try {
      logger.info(`Deleting music ID ${music_id} from user ${user_id}'s playlist`);
      const result = await this.data.DelMusicFromPlaylist(music_id, user_id);
      return result;
    } catch (error) {
      logger.error(`Failed to delete music ID ${music_id} from playlist for user ${user_id}: ${error.message}`, { error });
      throw error;
    }
  }
  
  async DelMusicFromMusic(music_id, user_id) {
    try {
      logger.info(`Deleting music ID ${music_id} for user ${user_id}`);
      const result = await this.data.DelMusicFromMusic(music_id, user_id);
      return result;
    } catch (error) {
      logger.error(`Failed to delete music ID ${music_id} for user ${user_id}: ${error.message}`, { error });
      throw error;
    }
  }


  async DelPlaylist(playlist_id, user_id) {
    try {
      logger.info(`Deleting playlist ${playlist_id} for user ${user_id}`);
      return await this.data.DelPlaylist(playlist_id, user_id);
    } catch (error) {
      logger.error(`Failed to delete playlist: ${error.message}`, { playlist_id, user_id });
      throw error;
    }
  };

  async UpdatePlaylistname(searchTerm, playlistId, userId) {
    try {
      logger.info(`Updating playlist name to "${searchTerm}" for playlist ${playlistId}, user ${userId}`);
      const result = await this.data.UpdatePlaylistname(searchTerm, userId, playlistId);
      return result;
    } catch (error) {
      logger.error(`Failed to update playlist name for playlist ${playlistId}, user ${userId}: ${error.message}`, { error });
      throw error;
    }
  }
  
  async UpdatePlaylistAddSong(playlistId, musicId, userId) {
    try {
      logger.info(`Adding music ID ${musicId} to playlist ${playlistId} for user ${userId}`);
      const result = await this.data.UpdatePlaylistAddSong(musicId, userId, playlistId);
      return result;
    } catch (error) {
      logger.error(`Failed to add music ID ${musicId} to playlist ${playlistId} for user ${userId}: ${error.message}`, { error });
      throw error;
    }
  };

 async Signup(username, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 8);
      const newUser = await this.data.Signup(username, email, hashedPassword);
      logger.info(`New user created: ${newUser.id}`);
      return newUser;
    } catch (error) {
      logger.error(`Signup failed: ${error.message}`);
      throw error;
    }
  };


  async Login(username, email, password) {
    logger.info(`Login attempt for user: ${username || email}`);
    const user = await this.data.Login(username, email, password);
    if (!user) {
      logger.warn(`Login failed: user not found for ${username || email}`);
      throw new Error(`user not found`);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.warn(`Login failed: password mismatch for user ${username || email}`);
      throw new Error(`password not match`);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    logger.info(`User ${user.id} logged in successfully`);
    return token;
  }


//   async login(username, email, password) {
//     logger.info(`Login attempt for user: ${username || email}`);
  
//     // Fetch user by username or email
//     const user = await this.data.findUser(username, email); // example
  
//     if (!user) {
//       logger.warn(`User not found for username: ${username}, email: ${email}`);
  
//       // Check if username/email exists (duplicate data)
//       const duplicateUser = await this.data.FindByUsernameOrEmail(username, email);
  
//       if (duplicateUser) {
//         const err = new Error('User with this username or email already exists. Please sign up.');
//         err.code = 'DUPLICATE_DATA';
//         throw err;
//       }
  
//       const err = new Error('User not found');
//       err.code = 'USER_NOT_FOUND';
//       throw err;
//     }
  
//     // Compare password with bcrypt
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       logger.warn(`Login failed: password mismatch for user ${username || email}`);
//       const err = new Error('Password does not match');
//       err.code = 'INVALID_CREDENTIALS';
//       throw err;
//     }
//     const token = jwt.sign(
//       { id: user.id, username: user.username, email: user.email },
//       JWT_SECRET,
//       { expiresIn: '1h' }
//     );
  
//     logger.info(`User ${user.id} logged in successfully`);
  
//     // Generate token or return user info here
//     return token;
//   }

};
module.exports = service;