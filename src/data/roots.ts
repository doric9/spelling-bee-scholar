export interface Root {
    id: string;
    root: string;
    meaning: string;
    examples: string[];
}

export const greekRoots: Root[] = [
    { id: 'g1', root: 'acr', meaning: 'height, tip', examples: ['acral', 'acrogeria', 'acropachy', 'acrostic'] },
    { id: 'g2', root: 'aer', meaning: 'air', examples: ['aerobics', 'aerocele', 'aerophilatelic'] },
    { id: 'g3', root: 'allo', meaning: 'other', examples: ['parallax', 'allochroous', 'allonym'] },
    { id: 'g4', root: 'ana', meaning: 'up, back', examples: ['anabathmoi', 'anabolic', 'anachronism', 'anaglyphy'] },
    { id: 'g5', root: 'apo', meaning: 'away from, off, separate', examples: ['apocryphal', 'apology', 'apophyge'] },
    { id: 'g6', root: 'cata', meaning: 'down, against', examples: ['catachresis', 'catadromous', 'catalepsy'] },
    { id: 'g7', root: 'chrom', meaning: 'color', examples: ['monochrome', 'achromatic'] },
    { id: 'g8', root: 'derm', meaning: 'skin', examples: ['epidermis', 'echinoderm'] },
    { id: 'g9', root: 'dia/di', meaning: 'through, across, apart', examples: ['diacritic', 'diadem', 'dialect'] },
    { id: 'g10', root: 'dys', meaning: 'bad, abnormal', examples: ['dysgraphia', 'dyspeptic', 'dysphasia'] },
    { id: 'g11', root: 'epi', meaning: 'upon, on, over', examples: ['epideictic', 'epidermis', 'epidural'] },
    { id: 'g12', root: 'eu', meaning: 'good', examples: ['eucalyptus', 'eucrasia', 'eudiometer'] },
    { id: 'g13', root: 'glyph', meaning: 'carve', examples: ['anaglyphy', 'xyloglyphy'] },
    { id: 'g14', root: 'gnos', meaning: 'knowledge', examples: ['telegnosis', 'anosognosia', 'agnostic'] },
    { id: 'g15', root: 'graph', meaning: 'write', examples: ['demographics', 'dysgraphia', 'hagiographer'] }
];

export const latinRoots: Root[] = [
    { id: 'l1', root: 'ante', meaning: 'before', examples: ['ante', 'antenatus'] },
    { id: 'l2', root: 'anti', meaning: 'against, opposite', examples: ['antipathy', 'antiquarian', 'antithesis'] },
    { id: 'l4', root: 'cumb', meaning: 'to lie down', examples: ['recumbent', 'succumb'] },
    { id: 'l5', root: 'contra', meaning: 'against', examples: ['contrapposto', 'contradictory'] },
    { id: 'l6', root: 'dis', meaning: 'apart, not', examples: ['discombobulate', 'discountenance', 'discreetly'] },
    { id: 'l7', root: 'duc', meaning: 'to lead', examples: ['inducement', 'transducer'] },
    { id: 'l8', root: 'flor', meaning: 'flower, bloom', examples: ['floribunda', 'floruit'] },
    { id: 'l9', root: 'loq', meaning: 'to speak', examples: ['grandiloquence', 'somniloquy', 'loquitur'] },
    { id: 'l10', root: 'man', meaning: 'hand', examples: ['manacle', 'manuscript'] },
    { id: 'l11', root: 'mater/matr', meaning: 'mother', examples: ['maternity', 'alma mater'] },
    { id: 'l12', root: 'noct', meaning: 'night', examples: ['nocturnal', 'noctambulist'] },
    { id: 'l13', root: 'omni', meaning: 'all', examples: ['omnilegent', 'omniscient'] },
    { id: 'l14', root: 'ped', meaning: 'foot', examples: ['pinniped', 'anomaliped'] }
];
