export default function ExpandMore({ width = "24", fill = "foreground" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} viewBox="0 -960 960 960">
            <path d="M480-371.92 267.69-584.23 296-612.54l184 184 184-184 28.31 28.31L480-371.92Z" className={"fill-" + fill} />
        </svg>
    )
}
