import { useEffect, useState } from "react";
import SendButton from "./icons/SendButton";
import ChatBotIcon from "./icons/ChatBotIcon";
import UserIcon from "./icons/UserIcon";
import ChatManager from "../services/ChatManager";
import ChatterType from "../services/entity/ChatterType";
import ChatElement from "../services/entity/ChatElement";
import ChatDetails from "../services/entity/ChatDetails";

function ChatView() {
  const [prompt, setPrompt] = useState("");
  const [promptLock, setPromptLock] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [title, setTitle] = useState("");
  const [chatDetails, setChatDetails] = useState<ChatDetails[]>([]);
  const [activeChatElements, setActiveChatElements] = useState<ChatElement[]>(
    []
  );
  const [inputLock, setInputLock] = useState(false);

  const onSend = async () => {
    if (prompt.length > 0) {
      setInputLock(true);
      setActiveChatElements((x) => [
        ...x,
        {
          id: crypto.randomUUID(),
          chatter: ChatterType.USER,
          chat: prompt,
        },
      ]);
      setPromptLock(true);
    }
  };

  useEffect(() => {
    if (promptLock) {
      ChatManager.chat(prompt).then(
        (res) =>
          res &&
          setActiveChatElements((x) => [
            ...x,
            {
              id: crypto.randomUUID(),
              chatter: ChatterType.CHAT_BOT,
              chat: res,
            },
          ])
      );
      setPrompt("");
    }
  }, [prompt, promptLock]);

  useEffect(() => {
    ChatManager.saveConversation({
      conversationId: crypto.randomUUID(),
      chatDetails: activeChatElements,
      title: title,
    });
  }, [activeChatElements, title]);

  useEffect(() => {
    if (prompt.length === 0) {
      setInputLock(false);
    }
  }, [prompt]);

  useEffect(() => {
    if (conversationId.length === 0) {
      setConversationId(crypto.randomUUID());
      ChatManager.registerConversation(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (title.length === 0 && activeChatElements.length > 0) {
      ChatManager.chat(
        "Determine an appropriate title for the prompt: " +
          activeChatElements[0].chat
      ).then((res) => res && setTitle(res));
    }
  }, [activeChatElements, title.length]);

  useEffect(() => {
    if (chatDetails.length === 0) {
      ChatManager.retrieveConversations().then(
        (res) => res && setChatDetails(res)
      );
    }
  }, [chatDetails]);

  return (
    <div>
      <div className="flex items-center space-x-4 p-4">
        <input
          className="block p-2 border-2 w-full rounded-lg"
          placeholder="ask me something..."
          autoComplete="id"
          value={prompt}
          disabled={inputLock}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <SendButton onClick={onSend}></SendButton>
      </div>
      {activeChatElements.length > 0 && (
        <ul className="p-2 block">
          {activeChatElements.map((a: ChatElement) => (
            <li
              id={a.id}
              key={a.id}
              className={`p-4 w-full text-gray-600 ${
                a.chatter === ChatterType.USER && "text-right"
              } font-sans font-semibold`}
            >
              {a.chatter === ChatterType.USER ? UserIcon() : ChatBotIcon()}
              {a.chat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatView;
