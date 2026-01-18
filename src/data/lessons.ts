export interface Lesson {
    id: string;
    title: string;
    content: string;
    tip: string;
}

export const lessons: Lesson[] = [
    {
        id: 'l1',
        title: 'The Mystery of Silent Letters',
        content: 'Many English words have "sneaky" silent letters that aren’t pronounced. For example, "debt" comes from the Latin "debitum". The French dropped the "b", but English scholars later added it back to emphasize its classical roots!',
        tip: 'Silent letters often tell a story about where a word came from. If a word feels "fancy", check for hidden silent letters.'
    },
    {
        id: 'l2',
        title: 'All About the Schwa',
        content: 'The "schwa" (/ə/) is the most common vowel sound in English. It is the "chillest" sound—totally unstressed—and can be spelled with any vowel: a, e, i, o, u, or y!',
        tip: 'If a word is derived from Greek and has a schwa sound, try spelling it with an "o" (like in "bacteriolytic").'
    },
    {
        id: 'l3',
        title: 'Adjectives vs. Nouns (/us/ sound)',
        content: 'Having trouble deciding between "-us" and "-ous" at the end of a word? Check the part of speech!',
        tip: 'Nouns (people, places, things) usually end in "-us". Adjectives (describing words) usually end in "-ous" (e.g., "generous").'
    },
    {
        id: 'l4',
        title: 'Double Trouble Consonants',
        content: 'When adding a suffix to a word, the final consonant is often doubled if the preceding vowel sound is short.',
        tip: 'Think: "hop" -> "hopped", "plod" -> "plodded", "chug" -> "chugged". If the vowel is short, double the consonant!'
    },
    {
        id: 'l5',
        title: 'The Hodgepodge of English',
        content: 'English is built from many other languages (Latin, Greek, French, etc.). We have 26 letters but around 44 different sounds!',
        tip: 'Understanding the "Language of Origin" is your secret weapon. It helps you decide which spelling rules to apply.'
    }
];
