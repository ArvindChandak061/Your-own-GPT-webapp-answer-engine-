import { Router } from 'express'
import threadController from "../controllers/chat.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const threadRouter = Router()

/**
 * @route POST /api/test
 * @description create a test thread to verify DB connectivity
 * @access Public
 */
threadRouter.post("/test", threadController.testThreadController)


/**
 * @route GET /api/thread
 * @description fetch all threads, sorted by most recently updated first
 * @access Public
 */
threadRouter.get("/thread", authMiddleware.authUser, threadController.getAllThreadsController)


/**
 * @route GET /api/thread/:threadId
 * @description fetch a single thread's messages by threadId
 * @access Public
 */
threadRouter.get("/thread/:threadId", authMiddleware.authUser, threadController.getThreadByIdController)


/**
 * @route DELETE /api/thread/:threadId
 * @description delete a thread by threadId
 * @access Public
 */
threadRouter.delete("/thread/:threadId", authMiddleware.authUser, threadController.deleteThreadController)


/**
 * @route POST /api/chat
 * @description send a message to a thread, creating the thread if it doesn't exist,
 * and get back the AI assistant's reply
 * @access Public
 */
threadRouter.post("/chat", authMiddleware.authUser, threadController.chatWithThreadController)


export default threadRouter