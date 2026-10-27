import { Router } from 'express';
import { createCase, deleteOneCase, getEvidence, getOneCase, getSuspect, listCases, submitAccusation } from '../controllers/caseController.js';

const router = Router();
router.route('/').get(listCases).post(createCase);
router.get('/:caseId/suspects/:suspectId', getSuspect);
router.get('/:caseId/evidence/:evidenceId', getEvidence);
router.post('/:caseId/accusation', submitAccusation);
router.route('/:caseId').get(getOneCase).delete(deleteOneCase);
export default router;
