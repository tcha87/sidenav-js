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
            'chialab/gestures': './node_modules/chialab-gestures/dist/gestures.js',
            'dna/components': './node_modules/dna-components/lib/dna.js',
        },
    });
}());
