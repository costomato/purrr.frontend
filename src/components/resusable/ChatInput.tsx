import AttachmentIcon from "@/assets/icons/attachment";
import CloseIcon from "@/assets/icons/close";
import SmileyIcon from "@/assets/icons/smiley";
import SendIcon from "@/assets/icons/send";
import { Message } from "@/types/messages";
import { truncate } from "@/utils";
import Image from "next/image";
import { ChangeEventHandler, FormEvent, FormEventHandler, KeyboardEventHandler, RefObject, useRef, useState } from "react";
import EmojiPicker from "../layout/EmojiPicker";

type ChatInputProps = {
    replyingTo: number | null;
    attachment: string;
    messages: Message[];
    fileinput: RefObject<HTMLInputElement>;
    chatInput: RefObject<HTMLFormElement>;
    message: RefObject<HTMLTextAreaElement>;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onFileChange: ChangeEventHandler<HTMLInputElement>;
    onMessageChange: KeyboardEventHandler<HTMLTextAreaElement>;
    clearAttachment(): void;
    replyTo(messageId: number | null): void;
}

export default function ChatInput({
    onSubmit, replyingTo, attachment, clearAttachment, chatInput,
    messages, replyTo, fileinput, message, onFileChange, onMessageChange
}: ChatInputProps) {

    function adjustInputHeight(): void {
        if (message.current) {
            message.current.style.height = "auto";
            message.current.style.height = message.current.scrollHeight + "px";
        }
    }

    const emojiRef = useRef<HTMLDivElement>(null);
    const [showEmoji, setShowEmoji] = useState<boolean>(false);

    function handleShowEmoji() {
        setShowEmoji(!showEmoji);
        message.current?.focus();
    }

    function onEmojiChoose(emoji: string) {
        if (message.current) message.current.value += emoji;
    }

    function onSubmitWithSideEffect(e: FormEvent<HTMLFormElement>) {
        setShowEmoji(false);
        onSubmit(e);
    }

    function onAttachmentWithSideEffect() {
        setShowEmoji(false);
        fileinput.current?.click();
    }

    return (
        <form ref={chatInput} onSubmit={onSubmitWithSideEffect} className="w-full rounded-b-[28px] bg-[#00000033] backdrop-blur-lg border border-white/20" style={{
            border: replyingTo === null ? "none" : "",
        }}>
            {attachment.length > 0 && <div className="absolute -top-24 border-[1px] border-foreground rounded-lg">
                <button type="button" onClick={clearAttachment} className="bg-foreground font-[800] font-mono text-background text-[0.8em] w-5 h-5 flex justify-center items-center rounded-[50%] absolute -top-2 -right-2">
                    <CloseIcon width="18" fill="background" />
                </button>
                <Image src={decodeURIComponent(attachment)} alt="Image" width="0" height="0" sizes="100vw" className="w-[5em] h-[5em] rounded-lg object-cover" />
            </div>}

            {showEmoji && <div ref={emojiRef} tabIndex={0}
                className="absolute z-50 bottom-[calc(100%+10px)] left-0 sm:left-2 w-[calc(100vw-20px)] sm:w-[350px] h-[400px] max-h-[60vh]">
                <EmojiPicker onChoose={onEmojiChoose} />
            </div>}

            {replyingTo !== null &&
                <div className="w-full h-16 border-foreground border-t-2 px-2 relative">
                    <button type="button" onClick={() => replyTo(null)} className="bg-foreground font-[800] font-mono text-background text-[0.8em] w-5 h-5 flex justify-center items-center rounded-[50%] absolute -top-2 -right-2">
                        <CloseIcon width="18" fill="background" />
                    </button>
                    <p className="text-[0.8em] font-[300] pt-1">Replying to <span className="font-bold">{messages[replyingTo].from}</span></p>
                    <h3>{messages[replyingTo].image && "(Attachment)"} {truncate(messages[replyingTo].body)}</h3>
                </div>}
            <div className="flex items-center rounded-[50px] p-2 bg-[#121212] backdrop-blur-lg border border-white/10">
                <button onClick={handleShowEmoji} type="button" className="mr-2 w-[34px] h-[34px] flex justify-center items-center rounded-md text-gray-400 hover:text-white transition-colors">
                    <SmileyIcon width="28" />
                </button>
                <button onClick={onAttachmentWithSideEffect} type="button" className="mr-2 w-[34px] h-[34px] flex justify-center items-center rounded-md text-gray-400 hover:text-white transition-colors">
                    <input accept="image/*" onChange={onFileChange} ref={fileinput} type="file" className="hidden" />
                    <AttachmentIcon width="28" />
                </button>
                <textarea rows={1} maxLength={5000} ref={message} onKeyDown={onMessageChange} onKeyUp={adjustInputHeight} autoFocus className="bg-transparent flex-1 outline-none text-sm resize-none max-h-[10em] text-white placeholder:text-gray-500 py-1" placeholder="Type Something..." />
                <button className="text-gray-400 hover:text-white transition-colors px-3 flex items-center justify-center rounded-md" type="submit">
                    <SendIcon width="24" />
                </button>
            </div>
        </form>
    )
}
