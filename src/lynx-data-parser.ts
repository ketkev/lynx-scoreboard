import {
    LynxResults,
    LynxDirective,
    LynxEvent,
    LynxResult,
} from "./lynx-data.interface";

function parseDirective(message: string): LynxDirective {
    const data = message.substr(1).split("|");
    return {
        title: data.shift() || "",
        data: data.map((val) => val.trim()),
    };
}

function parseEvent(line: string): LynxEvent {
    const data = line.split("|");
    return {
        status: data[0],
        eventName: data[1],
        wind: null,
        eventNo: parseInt(data[3]),
        roundNo: parseInt(data[4]),
        heatNo: parseInt(data[5]),
        eventRoundHeat: data[6],
        startType: data[7],
    };
}

function parseResult(line: string): LynxResult {
    const data = line.split("|");
    return {
        place: data[0] ? data[0].trim() : null,
        lane: data[1] ? parseInt(data[1].trim()) : null,
        id: data[2] ? parseInt(data[2].trim()) : null,
        name: data[3].trim(),
        team: data[4].trim(),
        time: data[5].trim(),
        delta: data[6].trim(),
        cumulativeSplitTime: data[7] ? data[7].trim() : null,
        lastSplitTime: data[8] ? data[8].trim() : null,
        lapsToGo: data[9] ? parseInt(data[9].trim()) : null,
        license: data[10] ? data[10].trim() : null,
        reactionTime: data[11] ? data[11].trim() : null,
        speed: data[12] ? data[12].trim() : null,
        pace: data[13] ? data[13].trim() : null,
        bestSplit: data[14] ? data[14].trim() : null,
    };
}

function parseResults(message: string): LynxResults {
    // Remove trailer
    message = message.replace(/;\*COMPLETE/, "");

    const lines = message.split(";");
    const firstLine = lines.shift();
    if (!firstLine) {
        throw "Invalid packet.";
    }
    return {
        event: parseEvent(firstLine),
        results: lines
            // Remove empty lines
            .filter((line) => line.replace("|", "").length > 0)
            .map((line) => parseResult(line)),
    };
}

export function parseLynxPacket(
    message: string
): { isDirective: boolean; data: LynxResults | LynxDirective } {
    const isDirective = message.startsWith("*");
    return {
        isDirective: isDirective,
        data: isDirective ? parseDirective(message) : parseResults(message),
    };
}
