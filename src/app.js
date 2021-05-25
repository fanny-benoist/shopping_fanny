
// Replace with your own values
const app_id = 'ITP4GM7PGU';
const search_only_api_key = '98ec2925946deee046bb35ddd77bef30'; // search only API key, not admin API key

const searchClient = algoliasearch(
  app_id,
  search_only_api_key
);

const search = instantsearch({
  indexName: 'shopping',
  searchClient,
  routing: true,
});

search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#searchbox',
    }),
    instantsearch.widgets.clearRefinements({
        container: '#clear-refinements',
      }),
      instantsearch.widgets.panel({
        hidden(options) {
          const facetValues = options.results.getFacetValues('colour');
          return Array.isArray(facetValues) ? facetValues.length <= 1 : false;
        },
      })(instantsearch.widgets.refinementList)({
        container: '#color',
        attribute: 'colour',
      }),      
    instantsearch.widgets.refinementList({
        container: document.querySelector('#fit'),
        attribute: 'fit',
        searchable: true,
        limit: 5,
        sortBy: ['name:asc'],
        showMore: true
    }),
    instantsearch.widgets.hierarchicalMenu({
      container: '#categories-menu',
      attributes: [
        'hierarchical_categories.lvl0',
        'hierarchical_categories.lvl1',
        'hierarchical_categories.lvl2',
      ],
    }),
    instantsearch.widgets.rangeSlider({
      container: '#price-range',
      attribute: 'price',
    }),
    instantsearch.widgets.stats({
    container: "#stats",
    templates: {
        body(hit) {
        return `<p> &#128073 <b>${hit.nbHits}</b> results found ${
            hit.query != "" ? `for <b>"${hit.query}"</b>` : ``
        } in <b>${hit.processingTimeMS}ms</b></p>`;
        }
    }
    }),
    instantsearch.widgets.hits({
        container: '#hits',
        templates: {
          item: `
            <div>
              <img src="{{image_link}}" align="center"  alt="{{name}}" />
              <div class="hit-name">
                {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
              </div>
              <div class="hit-price">\${{price}}</div>
            </div>
          `,
        },
      }),
    instantsearch.widgets.hitsPerPage({
      container: '#hits-per-page',
      items: [
        { label: '16 contacts per page', value: 16, default: true },
        { label: '24 contacts per page', value: 24 },
      ]
    }),
    instantsearch.widgets.pagination({
      container: "#pagination"
    })
]);

search.start();