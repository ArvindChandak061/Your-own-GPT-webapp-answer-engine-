import Thread from "../models/thread.model.js"
import getGroqAIAPIResponse from "../utils/groqAI.js"

async function testThreadController(req, res) {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "Testing New Thread2",
      user: req.user.id   // ✅
    })
    const response = await thread.save()
    res.send(response)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Failed to save in DB" })
  }
}

async function getAllThreadsController(req, res) {
  try {
    const threads = await Thread.find({ user: req.user.id })   // ✅ scoped
      .sort({ updatedAt: -1 })
    res.json(threads)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Failed to fetch threads" })
  }
}

async function getThreadByIdController(req, res) {
  const { threadId } = req.params
  try {
    const thread = await Thread.findOne({ threadId, user: req.user.id })   // ✅ scoped

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" })
    }

    res.json(thread.messages)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Failed to fetch chat" })
  }
}

async function deleteThreadController(req, res) {
  const { threadId } = req.params
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId, user: req.user.id })   // ✅ scoped

    if (!deletedThread) {
      return res.status(404).json({ message: "Thread not found" })
    }

    res.status(200).json({ message: "Thread deleted successfully" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Failed to delete thread" })
  }
}

async function chatWithThreadController(req, res) {
  const { threadId, message } = req.body

  if (!threadId || !message) {
    return res.status(400).json({ message: "missing required fields" })
  }

  try {
    let thread = await Thread.findOne({ threadId, user: req.user.id })   // ✅ scoped

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        user: req.user.id,   // ✅ associate new thread with logged-in user
        messages: [{ role: "user", content: message }]
      })
    } else {
      thread.messages.push({ role: "user", content: message })
    }

    const assistantReply = await getGroqAIAPIResponse(message)

    thread.messages.push({ role: "assistant", content: assistantReply })
    thread.updatedAt = new Date()

    await thread.save()
    res.json({ reply: assistantReply })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "something went wrong" })
  }
}

export default {
  testThreadController,
  getAllThreadsController,
  getThreadByIdController,
  deleteThreadController,
  chatWithThreadController
}