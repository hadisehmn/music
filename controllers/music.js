const express = require('express');
const AuthMiddleware = require('./middlewares/Authentication');

const logger = require('../logger');

module.exports = (service) => {
  const router = express.Router();

  router.get('/', AuthMiddleware.middleware, async (req, res) => {
    try {
      const searchterm = req.query.search_term || '';
      logger.info(`GET /music with search_term="${searchterm}"`);
  
      const music = await service.SearchBetweenArtistsorMusic(searchterm);
      return res.status(200).json(music);
    } catch (error) {
      logger.error(`GET /music failed: ${error.message}`, { error });
      return res.status(400).json({ error: 'Failed to find artists or music' });
    }
  });

  // DELETE /music/playlist/:music_id
  router.delete('/playlist/:music_id', AuthMiddleware.middleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const { music_id } = req.params;

      if (!music_id) {
        logger.warn('DELETE /music/playlist missing music_id');
        return res.status(400).json({ error: 'music_id is required' });
      }

      logger.info(`DELETE /music/playlist/${music_id} by user ${userId}`);
      await service.DelMusicFromPlaylist(music_id, userId);
      return res.status(204).send();
    } catch (error) {
      logger.error(`DELETE /music/playlist failed: ${error.message}`, { error });
      return res.status(400).json({ error: 'Failed to delete music from playlist' });
    }
  });

  // DELETE /music/music/:music_id
  router.delete('/music/:music_id', AuthMiddleware.middleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const { music_id } = req.params;

      if (!music_id) {
        logger.warn('DELETE /music/music missing music_id');
        return res.status(400).json({ error: 'music_id is required' });
      }

      logger.info(`DELETE /music/music/${music_id} by user ${userId}`);
      await service.DelMusicFromMusic(music_id, userId);
      return res.status(204).send();
    } catch (error) {
      logger.error(`DELETE /music/music failed: ${error.message}`, { error });
      return res.status(400).json({ error: 'Failed to delete music from collection' });
    }
  });

  return router;
};