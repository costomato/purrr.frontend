import ExitIcon from "@/assets/icons/exit";
// import MenuIcon from "@/assets/icons/menu";
import RefreshIcon from "@/assets/icons/refresh";
import ReplyIcon from "@/assets/icons/reply";
import ScrollDown from "@/assets/icons/scrollDown";
import { Message } from "@/types/messages";
import { setEmojiSize, truncate } from "@/utils";
import Image from "next/image";
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import ChatInput from "../resusable/ChatInput";

type ChatProps = {
    partner: string,
    messages: Message[],
    readIndex: number | null,
    partnerTyping: boolean,
    onMessage: (message: string | null, image: string | null, reply: number | null) => void,
    onStop: () => void,
    onReconnect: () => void,
    readMessage: (messageId: number) => void,
    startTyping: () => void,
    stopTyping: () => void,
}

export default function Chat({ 
    partner, messages, readIndex, partnerTyping, onMessage, onStop,
    onReconnect, readMessage, startTyping, stopTyping }: ChatProps
) {

    const message = useRef<HTMLInputElement>(null);
    const fileinput = useRef<HTMLInputElement>(null);
    const chatBottom = useRef<HTMLDivElement>(null);
    const timer = useRef<number>();

    const TYPINGTIMEOUT = 500;

    const [attachment, setAttachment] = useState<string>("");
    const [unread, setUnread] = useState<number>(0);
    const [typing, setTyping] = useState<boolean>(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    const scrollToBottom = useCallback(() => {
        if (!document.hidden) {
            setUnread(0);
            readMessage(messages.length - 1);
        }
        chatBottom.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, readMessage])

    function isScrolledToBottom(offsetBefore = 60, offsetAfter = 350) {
        const rect = chatBottom.current?.getBoundingClientRect();
        return (rect && rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) - offsetBefore
            && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offsetAfter);
    }

    function isScrollAvailable(offset = 60) {
        const rect = chatBottom.current?.getBoundingClientRect();
        return (rect && !(rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - offset))
    }

    useEffect(() => {
        if (messages.length > 0) {
            const last_message = messages[messages.length - 1];
            if (!isScrollAvailable()) {
                if (!document.hidden) {
                    readMessage(messages.length - 1);
                } else {
                    setUnread(n => n + 1);
                }
            } else {
                if (isScrolledToBottom() || last_message.from === "You") {
                    scrollToBottom();
                    if (document.hidden) setUnread(n => n + 1);
                } else if (last_message.from !== "You") {
                    setUnread(n => n + 1);
                }
            }
        }
    }, [messages, readMessage, scrollToBottom]);

    const markReadIfViewed = useCallback(() => {
        if (isScrolledToBottom() || !isScrollAvailable()) {
            setUnread(0);
            if (!document.hidden) readMessage(messages.length - 1);
        }
    }, [messages.length, readMessage])

    useEffect(() => {
        if (unread > 0) {
            document.title = `${partner}: ${unread} New Message(s) | On Purrr.chat`
            window.addEventListener('scroll', markReadIfViewed);
        } else {
            document.title = `Connected with ${partner} | On Purrr.chat`
            window.removeEventListener('scroll', markReadIfViewed);
        }

        return () => {
            window.removeEventListener('scroll', markReadIfViewed);
        }
    }, [markReadIfViewed, partner, unread])

    useEffect(() => {
        document.addEventListener("visibilitychange", markReadIfViewed);

        return () => {
            document.removeEventListener("visibilitychange", markReadIfViewed);
        }
    }, [markReadIfViewed])

    useEffect(() => {
        if(isScrolledToBottom(115)) scrollToBottom();
    }, [replyingTo, scrollToBottom])

    const onMessageChange = () => {
        window.clearTimeout(timer.current);
        if (!typing) {
            startTyping();
            setTyping(true);
        }
        timer.current = window.setTimeout(() => {
            stopTyping();
            setTyping(false);
        }, TYPINGTIMEOUT)
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();

        let msg: string | null = null, img: string | null = null, reply: number | null = null;

        if (message.current) {
            if (message.current.value.trim() !== "") msg = message.current.value;
            message.current.value = "";
            message.current.focus();
        }

        if (attachment.length !== 0) {
            img = attachment;
            setAttachment("");
        }

        if(replyingTo !== null) {
            reply = replyingTo;
            setReplyingTo(null);
        }

        if (msg || img) onMessage(msg, img, reply);
        stopTyping();
        setTyping(false);
    }

    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            // Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target?.result as string;
                // setAttachments(attachs => [...attachs, base64Image]);
                setAttachment(base64Image);
                event.target.value = "";
            };
            reader.readAsDataURL(file);
            // })
        }
        message.current?.focus();
    }

    function onRefresh() {
        onStop();
        onReconnect();
    }

    function clearAttachment() {
        setAttachment("");
        if(fileinput.current) fileinput.current.value = "";
        message.current?.focus();
    }

    function replyTo(messageId: number | null) {
        setReplyingTo(messageId);
        message.current?.focus();
    }

    return (
        <section className={"w-full flex justify-center items-end relative font-text"}>

            <div className="flex flex-col justify-end w-[1080px] max-w-full min-h-full pt-[5em]" style={{
                paddingBottom: replyingTo === null ? "5em": "9em"
            }}>
                {messages.map((message, i) => (
                    (message.body || message.image) &&
                    <div key={i} className="group flex flex-col px-4" style={{
                        alignItems: message.from === "You" ? "end" : "start"
                    }}>
                        {(i === 0 || message.from !== messages[i - 1].from) &&
                            <h5 className="text-[0.8em] pt-4">{message.from}</h5>}
                        {message.reply !== null && 
                            <div className="flex flex-col border-foreground px-2" style={{
                                alignItems: message.from === "You"? "end": "start",
                                borderRightWidth: message.from === "You"? "3px": "0",
                                borderLeftWidth: message.from === "You"? "0": "3px",
                            }}>
                                <h3 className="text-[0.7em]">Replying to {messages[message.reply].from}</h3>
                                <p className="text-[0.8em]">{messages[message.reply].image && "(Attachment)"}{truncate(messages[message.reply].body)}</p>
                            </div>}
                        {message.image &&
                            <div className="flex items-center gap-4" style={{ flexDirection: message.from === "You" ? "row-reverse" : "row" }}>
                                <Image src={decodeURIComponent(message.image)} alt="Image" width="0" height="0" sizes="100vw" className="w-[10em] h-auto max-h-[20em]" />
                                <div className="hidden group-hover:flex items-center gap-2">
                                    <button onClick={() => replyTo(i)}><ReplyIcon width="18" /></button>
                                    {/* <button><MenuIcon width="20" /></button> */}
                                </div>
                            </div>}
                        {message.body && message.body.trim() !== "" &&
                            <div className="flex items-center gap-4" style={{ flexDirection: message.from === "You" ? "row-reverse" : "row" }}>
                                <h3 className="max-w-[20em] break-words" style={{ fontSize: setEmojiSize(message.body) }}>{message.body}</h3>
                                {!message.image && <div className="hidden group-hover:flex items-center gap-2">
                                    <button onClick={() => replyTo(i)}><ReplyIcon width="18" /></button>
                                    {/* <button><MenuIcon width="20" /></button> */}
                                </div>}
                            </div>}
                        {i === readIndex && (message.from === "You" ?
                            <p className="text-[0.7em] self-end">Read by {partner}</p> :
                            <div className="h-[1em]" />)}
                    </div>
                ))}
                <div ref={chatBottom}></div>
            </div>

            {unread > 0 && <button onClick={scrollToBottom} className="fixed bottom-[5em]">
                <div className="bg-foreground font-[800] font-mono text-background text-[0.8em] w-5 h-5 flex justify-center items-center rounded-[50%] absolute right-0">{unread}</div>
                <ScrollDown />
            </button>}

            <header className="fixed top-0 left-0 w-full bg-background font-display">
                <div className="w-[1080px] max-w-full p-4 m-auto flex justify-between items-end">
                    <div className="">
                        <h4 className="text-[0.8em]">You&apos;re connected to</h4>
                        <h2>{partner} {partnerTyping && <small className="font-text">Typing...</small>}</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onRefresh}><RefreshIcon /></button>
                        <button onClick={onStop}><ExitIcon /></button>
                    </div>
                </div>
            </header>

            <ChatInput
                replyingTo={replyingTo} onSubmit={onSubmit}
                attachment={attachment} messages={messages}
                fileinput={fileinput} message={message}
                onFileChange={onFileChange} onMessageChange={onMessageChange}
                clearAttachment={clearAttachment} replyTo={replyTo}
            />

        </section>
    )
}
