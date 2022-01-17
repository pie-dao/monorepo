export interface Vote {
    id: string;
    voter: string;
    created: string;
    proposal: Proposal;
    choice: string;
    space: Space;
}

interface Proposal {
    id: string;
}

interface Space {
    id: string;
}