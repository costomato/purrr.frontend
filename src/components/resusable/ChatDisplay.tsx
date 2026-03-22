import ReplyIcon from "@/assets/icons/reply";
import { Message } from "@/types/messages";
import { setEmojiSize, truncate } from "@/utils";
import Image from "next/image";
import { RefObject } from "react";

type ChatDisplayProps = {
    chatHeightOffset: number;
    messages: Message[];
    replyTo(messageId: number | null): void;
    partner: string;
    readIndex: number | null;
    chatBottom: RefObject<HTMLDivElement>;
    partnerAvatar: string;
}

export function ChatDisplay({ chatHeightOffset, messages, replyTo, partner, readIndex, chatBottom, partnerAvatar }: ChatDisplayProps) {
    return (
        <div className="flex flex-col justify-end max-w-full min-h-full pt-[5em]" style={{
            paddingBottom: chatHeightOffset + "px",
        }}>
            {messages.map((message, i) => {
                const isMe = message.from === "You";
                const showHeader = i === 0 || message.from !== messages[i - 1].from;
                const hasContent = message.body || message.image;

                if (!hasContent) return null;

                const hasText = message.body && message.body.trim() !== "";
                const isEmojiOnly = hasText && setEmojiSize(message.body || "") !== "1em";
                const isMediaOnly = message.image && !hasText;
                const noBubble = isMediaOnly || isEmojiOnly;

                return (
                    <div key={i} className={`group flex w-full ${isMe ? "justify-end" : "justify-start"} mb-2 px-4 ${showHeader ? "mt-4" : ""}`}>
                        {/* Avatar for partner */}
                        {!isMe && (
                            <div className="w-12 h-full rounded-[5px] overflow-hidden m-2 shrink-0 flex-none mt-1">
                                {showHeader ? (
                                    <Image className="object-cover w-full h-12 " src={partnerAvatar} alt="avatar" width={50} height={50} />
                                ) : (
                                    <div className="w-full h-full" />
                                )}
                            </div>
                        )}

                        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
                            {showHeader && (
                                <h5 className={`text-[0.75em] text-gray-600 dark:text-gray-300 mb-1 ${isMe ? "mr-1" : "ml-1"}`}>{message.from}</h5>
                            )}

                            {message.reply !== null && (
                                <div className="flex flex-col px-3 py-1 mb-1 rounded-md bg-white/5 border-l-2 border-white/20" style={{
                                    alignItems: isMe ? "end" : "start",
                                    borderRightWidth: isMe ? "2px" : "0",
                                    borderLeftWidth: isMe ? "0" : "2px",
                                }}>
                                    <h3 className="text-[0.7em] text-gray-500 dark:text-gray-400">Replying to {messages[message.reply].from}</h3>
                                    <p className="text-[0.8em] text-gray-600 dark:text-gray-300">{messages[message.reply].image && "(Attachment) "}{truncate(messages[message.reply].body)}</p>
                                </div>
                            )}

                            <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`${noBubble ? "" : `px-3 py-1 ${isMe ? "bg-[#b026ff]" : "bg-[#18181b] border border-white/10"} text-white rounded-[0.6rem]`}`}>
                                    {message.image && (
                                        <Image src={decodeURIComponent(message.image)} alt="Image" width={300} height={300} className={`w-[10em] h-auto max-h-[20em] rounded-lg ${hasText ? "mb-2" : ""}`} />
                                    )}
                                    {hasText && (
                                        <h3 className="break-words whitespace-pre-line leading-relaxed" style={{ fontSize: setEmojiSize(message.body || "") }}>
                                            {message.body}
                                        </h3>
                                    )}
                                </div>
                                <div className="hidden group-hover:flex items-center gap-2 mb-1">
                                    <button onClick={() => replyTo(i)} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                                        <ReplyIcon width="16" />
                                    </button>
                                </div>
                            </div>

                            {i === readIndex && (isMe ?
                                <p className="text-[0.65em] text-gray-500 dark:text-gray-400 mt-1">Read by {partner}</p> :
                                <div className="h-[1em]" />)}
                        </div>
                    </div>
                );
            })}
            <div ref={chatBottom}></div>
        </div>
    )
}