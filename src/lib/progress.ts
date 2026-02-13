import { Word } from "@/data/words";

export interface TierStats {
    mastered: number;
    learning: number;
    untouched: number;
    total: number;
    masteredPercentage: number;
    learningPercentage: number;
    label: string;
    color: string;
    secondaryColor: string;
}

/**
 * Calculates tiered statistics from the raw progress map.
 */
export const calculateTieredStats = (words: Word[], progressMap: Record<string, string>): Record<string, TierStats> => {
    const tiers = ['OneBee', 'TwoBee', 'ThreeBee'];
    const results: Record<string, TierStats> = {};

    tiers.forEach(tier => {
        const tierWords = words.filter(w => w.difficulty === tier);
        const masteredInTier = tierWords.filter(w => progressMap[w.id] === 'mastered').length;
        const learningInTier = tierWords.filter(w => progressMap[w.id] && progressMap[w.id] !== 'mastered').length;
        const untouchedInTier = tierWords.length - masteredInTier - learningInTier;

        results[tier] = {
            mastered: masteredInTier,
            learning: learningInTier,
            untouched: untouchedInTier,
            total: tierWords.length,
            masteredPercentage: tierWords.length > 0 ? (masteredInTier / tierWords.length) * 100 : 0,
            learningPercentage: tierWords.length > 0 ? (learningInTier / tierWords.length) * 100 : 0,
            label: formatTierLabel(tier),
            color: getTierColor(tier, 'primary'),
            secondaryColor: getTierColor(tier, 'secondary')
        };
    });

    return results;
};

/**
 * Formats a tier ID into a human-readable label.
 */
export const formatTierLabel = (tier: string): string => {
    switch (tier) {
        case 'OneBee': return 'One Bee (Easy)';
        case 'TwoBee': return 'Two Bee (Medium)';
        case 'ThreeBee': return 'Three Bee (Hard)';
        default: return tier;
    }
};

/**
 * Returns the theme color for a specific tier.
 */
export const getTierColor = (tier: string, type: 'primary' | 'secondary' = 'primary'): string => {
    const colors: Record<string, { primary: string, secondary: string }> = {
        'OneBee': { primary: '#16a34a', secondary: '#86efac' },   // Green / Light Green
        'TwoBee': { primary: '#ca8a04', secondary: '#fde047' },   // Gold / Yellow
        'ThreeBee': { primary: '#dc2626', secondary: '#fca5a5' }  // Red / Rose
    };

    return colors[tier]?.[type] || (type === 'primary' ? 'var(--primary)' : 'var(--secondary)');
};
