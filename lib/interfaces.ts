export interface Location {
    location: string;
}

export interface Stakes {
    stake: string;
}

export interface GameTypes {
    game_type: string;
}

export interface AddDetailFormProps {
    detail: string;
    locations: string[],
    stakes: string[],
    game_types: string[],
    user_id: string
}

export interface Session {
    game_type: string,
    stake: string,
    location: string,
    buyin: number,
    cashout: number,
    start_time: string,
    end_time: string,
    time_played: number,
    net_result: number
}