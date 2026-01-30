import { Word } from "@/data/words";

export interface TierStats {
    mastered: number;
    total: number;
    percentage: number;
    label: string;
    color: string;
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

        results[tier] = {
            mastered: masteredInTier,
            total: tierWords.length,
            percentage: tierWords.length > 0 ? (masteredInTier / tierWords.length) * 100 : 0,
            label: formatTierLabel(tier),
            color: getTierColor(tier)
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
export const getTierColor = (tier: string): string => {
    switch (tier) {
        case 'OneBee': return '#16a34a'; // Green
        case 'TwoBee': return '#ca8a04'; // Gold
        case 'ThreeBee': return '#dc2626'; // Red
        default: return 'var(--primary)';
    }
};
