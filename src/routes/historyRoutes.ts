import { Router } from 'express';
import { getHistory, addToHistory, clearHistory } from '../controllers/historyController';
import historyService from '../services/historyService';

const router = Router();

router.get('/:userId', getHistory);
router.post('/:userId', addToHistory);
router.delete('/:userId', clearHistory);


export default router;
