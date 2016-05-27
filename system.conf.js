(function() {
    System.config({
        meta: {
            'chialab/gestures': {
                build: false,
                format: 'global',
            },
            'dna/components': {
                build: false,
                format: 'global',
            },
        },
        paths: {
            'chialab/*': './node_modules/chialab-*',
            'dna/components': './node_modules/dna-components/lib/dna.js',
        },
    });
}());
