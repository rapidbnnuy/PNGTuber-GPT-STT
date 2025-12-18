export interface Character {
    name: string;
    id: string; // GUID
}

export const CHARACTERS: Character[] = [
    { name: "GPT Character 1", id: "fc638620-0d7e-4a75-a750-6d113087b226" },
    { name: "GPT Character 2", id: "2bb4de05-fa57-4ee3-a435-9ff72dd3f580" },
    { name: "GPT Character 3", id: "f25756db-2727-435d-b486-20864afa60cb" },
    { name: "GPT Character 4", id: "a0a9433d-7ad1-49e8-85b9-af313a0b78f1" },
    { name: "GPT Character 5", id: "b959e0c7-c751-46bc-a43e-2787682e65fe" },
];

export const CPH_ENDPOINT = "http://127.0.0.1:7474/DoAction";
