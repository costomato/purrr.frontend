import ActivitiesIcon from "@/assets/icons/emoji-groups/activities"
import AnimalNatureIcon from "@/assets/icons/emoji-groups/animals_nature"
import FlagsIcon from "@/assets/icons/emoji-groups/flags"
import FoodDrinkIcon from "@/assets/icons/emoji-groups/food_drink"
import ObjectsIcon from "@/assets/icons/emoji-groups/objects"
import PeopleBodyIcon from "@/assets/icons/emoji-groups/people_body"
import SmileyEmotionIcon from "@/assets/icons/emoji-groups/smiley_emotion"
import SymbolsIcon from "@/assets/icons/emoji-groups/symbols"
import TravelPlacesIcon from "@/assets/icons/emoji-groups/travel_places"
import { useState } from "react"
import data from "unicode-emoji-json/data-by-group.json"

const grouptoicon: {
    [key: string]: React.FC<{ width?: string, fill?: string }>
} = {
    "smileys_emotion": SmileyEmotionIcon,
    "people_body": PeopleBodyIcon,
    "animals_nature": AnimalNatureIcon,
    "food_drink": FoodDrinkIcon,
    "travel_places": TravelPlacesIcon,
    "activities": ActivitiesIcon,
    "objects": ObjectsIcon,
    "symbols": SymbolsIcon,
    "flags": FlagsIcon,
}

type EmojiPickerProps = {
    onChoose(emoji: string): void,
}

export default function EmojiPicker({ onChoose }: EmojiPickerProps) {

    const [group, setGroup] = useState<number>(0);

    return (
        <div className="bg-[#121212] backdrop-blur-xl border border-white/10 rounded-[20px] shadow-2xl w-full h-full flex flex-col overflow-hidden">
            <div className="flex gap-1 w-full overflow-x-auto p-2 pb-1 flex-shrink-0 border-b border-white/5 scrollbar-hide">
                {data.map((entry, i) => {
                    const Elem = grouptoicon[entry.slug];
                    return (
                        <div key={i} onClick={() => setGroup(i)}
                            className={`p-2 cursor-pointer rounded-lg transition-colors flex-shrink-0 flex items-center justify-center
                            ${group === i ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                            <Elem width="22" />
                        </div>
                    )
                })}
            </div>
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] p-3 gap-1 content-start">
                    {data[group].emojis.map((emoji, i) => {
                        return (
                            <div onClick={() => onChoose(emoji.emoji)} key={i} className="text-2xl p-2 cursor-pointer rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center">{emoji.emoji}</div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}