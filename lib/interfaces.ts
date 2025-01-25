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