const express = require('express');
const AuthMiddleware = require('./middlewares/Authentication');

const logger = require('../logger');

module.exports = (service) => {
  const router = express.Router();

  router.get('/', AuthMiddleware.middleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const search = req.query.search || null;
      logger.info(`GET /playlists by user ${userId}${search ? ` with search "${search}"` : ''}`);

      let playlists;

      if (search) {
        playlists = await service.PlaylistByPlaylistNameAndSong(userId, search);
      } else {
        playlists = await service.Playlist(userId);
      }

      res.status(200).json(playlists);
    } catch (error) {
      logger.error(`GET /playlists failed: ${error.message}`, { error });
      res.status(500).json({ error: 'Failed to get playlists' });
    }
  });

  router.get('/playlist/:user_id', AuthMiddleware.middleware, async (req, res) => {
    const userId = req.params.user_id;
    logger.info(`GET /playlist/${userId} requested`);
  
    try {
      const playlists = await service.PlaylistByUserid(userId);
      res.status(200).json(playlists);
    } catch (error) {
      logger.error(`GET /playlist/${userId} failed: ${error.message}`, { error });
      res.status(400).json({ error: 'Failed to get playlists' });
    }
  });


  router.delete('/:playlist_id', AuthMiddleware.middleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const { playlist_id } = req.params;
  
      if (!playlist_id) {
        logger.warn(`DELETE /playlists missing playlist_id`);
        return res.status(400).json({ error: 'playlist_id is required' });
      }
  
      logger.info(`DELETE /playlists/${playlist_id} by user ${userId}`);
  
      await service.DelPlaylist(playlist_id, userId);
      return res.status(204).send(); 
    } catch (error) {
      logger.error(`DELETE /playlists failed: ${error.message}`, { error });
      res.status(400).json({ error: 'Failed to delete playlist' });
    }
  });
  

  router.patch('/', AuthMiddleware.middleware, async (req, res) => {
    try {
      const userId = req.user.id; 
      const { playlist_id, new_name } = req.body;

      if (!playlist_id || !new_name) {

        logger.warn(`PATCH /playlists missing playlist_id or new_name`);
        return res.status(400).json({ error: 'playlist_id and new_name are required' });
      }
      logger.info(`PATCH /playlists rename ${playlist_id} to "${new_name}" by user ${userId}`);

      await service.UpdatePlaylistname(new_name, playlist_id, userId);
      return res.status(200).json({ message: 'Playlist name updated' });

    } catch (error) {
      logger.error(`PATCH /playlists failed: ${error.message}`, { error });

      return res.status(400).json({ error: 'Failed to update playlist name' });
    }
  });

  



  router.patch('/add-music', AuthMiddleware.middleware, async (req, res) => {
    try {
      const userId = req.user.id; 
      const { playlist_id, music_id } = req.body;

      if (!playlist_id || !music_id) {
        logger.warn(`PATCH /playlists/add-music missing playlist_id or music_id`);

        return res.status(400).json({ error: 'playlist_id and music_id are required' });
      }

      logger.info(`PATCH /playlists/add-music: Add music ${music_id} to playlist ${playlist_id} by user ${userId}`);

      await service.UpdatePlaylistAddSong(playlist_id, music_id, userId);
      return res.status(200).json({ message: 'Music added to playlist' });
      
    } catch (error) {
      logger.error(`PATCH /playlists/add-music failed: ${error.message}`, { error });
  
      return res.status(400).json({ error: 'Failed to add music to playlist' });
    }
  });

  return router;
};
