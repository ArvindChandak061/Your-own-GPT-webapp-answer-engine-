import "../styles/ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "../MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from "react-spinners";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { useNavigate } from "react-router";
import api from "../../auth/services/auth.api.js";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { handleLogout , user } = useAuth();
    const navigate = useNavigate();
    const onLogoutClick = async () => {
        await handleLogout();       // clears token + sets user to null in context
        navigate("/login");          // redirect to login page
      };
    const getReply = async () => {
        setLoading(true);
        setNewChat(false);
        console.log("message ", prompt, " threadId ", currThreadId);
        try {
            const response = await api.post("/api/chat", {
                message: prompt,
                threadId: currThreadId
            });
            console.log(response.data);
            setReply(response.data.reply);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }
    //Append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }
        setPrompt("");
    }, [reply]);
    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }
    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>{`${user.username}'s GPT` || "Arvind'sGPT"} <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={onLogoutClick}><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>
            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>
            
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                           
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    Your GPT webapp can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}
export default ChatWindow;
