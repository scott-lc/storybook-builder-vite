const inject =
    require('@storybook/source-loader/dist/cjs/abstract-syntax-tree/inject-decorator').default;

const { sanitizeSource } = require('@storybook/source-loader/dist/cjs/abstract-syntax-tree/generate-helpers');

module.exports.sourceLoaderPlugin = function () {
    return {
        name: 'storybook-vite-source-loader-plugin',
        enforce: 'pre',
        transform(src, id) {
            if (id.match(/\.stories\.[jt]sx?$/)) {
                const result = inject(src, id);

                const sourceJson = sanitizeSource(result.storySource || src);
                const addsMap = result.addsMap || {};
                const source = result.source;

                if (!source || source.length === 0) {
                  return src;
                }

                const preamble = `
                    /* eslint-disable */
                    // @ts-nocheck
                    // @ts-ignore
                    var __STORY__ = ${sourceJson};
                    // @ts-ignore
                    var __LOCATIONS_MAP__ = ${JSON.stringify(addsMap)};
                `;

                return {
                    code: `${preamble}\n${source}`,
                    map: { mappings: '' },
                };
            }
        },
    };
};
