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
    buyin: string,
    cashout: string,
    start_time: string,
    end_time: string,
    time_played?: number,
    net_result?: number,
    id?: number,
}

export interface TournamentSession {
    game_type: string,
    location: string,
    buyin: string,
    cashout: string,
    placement: string,
    start_date: string,
    net_result?: number,
    id?: number
}

export interface FormProps {
    userId: string;
    locations: Array<{ location: string }>;
    stakes: Array<{ stake: string }>;
    game_types: Array<{ game_type: string }>;
    currentSession?: Session
}

export interface TournamentFormProps {
    userId: string;
    locations: Array<{ location: string }>;
    game_types: Array<{ game_type: string }>;
    currentSession?: TournamentSession
}