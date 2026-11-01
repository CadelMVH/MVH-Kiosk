export interface BuiltHomeSlide {
  id: string;
  floorplanId: string;
  name: string;
  series: string;
  manufacturer: string;
  location: string;
  primaryImage: string;
  allPhotos: string[];
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  dimensions: string;
  sections: string;
  basePrice: number;
  priceFormatted: string;
  hasTour: boolean;
  tourUrl?: string;
  buildHighlights: string;
  customerStory?: string;
  yearBuilt: string;
}

export const BUILT_HOMES_GALLERY: BuiltHomeSlide[] = [
  {
    id: 'built-eucalyptus-kitsap',
    floorplanId: 'gw-inspiration-gold-681f',
    name: 'Eucalyptus (ING 681F)',
    series: 'Inspiration Gold Series',
    manufacturer: 'Golden West Albany',
    location: 'Custom Build · Kitsap County Acreage, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_c39eaa6bd99a45649f99387daa9f0934~mv2.webp',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_c39eaa6bd99a45649f99387daa9f0934~mv2.webp',
      'https://static.wixstatic.com/media/866235_6fe37461e3ed4cfdb4e08d96bbd9d582~mv2.webp',
      'https://static.wixstatic.com/media/866235_4fa48de861474903b9a4a22ee3843b26~mv2.png',
      'https://static.wixstatic.com/media/866235_f221529f084d481899b4df4566a45ea2~mv2.png'
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1836,
    dimensions: '27\' x 68\'',
    sections: 'Double-Wide',
    basePrice: 196531,
    priceFormatted: '$196,531',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/67a9992d9f4a4340be7cb137f6d4d1e2',
    buildHighlights: 'Custom cedar prow exterior, craftsman covered deck, vaulted 9-foot ceilings, chef island kitchen with solid surface quartz, and Energy Star high-efficiency insulation.',
    customerStory: 'Delivered to a 5-acre wooded parcel in Kitsap County with turnkey site foundation, septic integration, and custom cedar deck.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-majestic-9590-sequim',
    floorplanId: 'mar-majestic-9590',
    name: 'Majestic 9590-S Alpine Prow',
    series: 'Majestic Series',
    manufacturer: 'Marlette Homes',
    location: 'Installed with Mountain Views · Sequim, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_66e4f54faaae4659aaea738f2432cbfd~mv2.webp',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_66e4f54faaae4659aaea738f2432cbfd~mv2.webp',
      'https://static.wixstatic.com/media/866235_04d3e537dc1b409190d542df33f8cbe9~mv2.webp'
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1387,
    dimensions: '27\' x 52\'',
    sections: 'Double-Wide',
    basePrice: 193762,
    priceFormatted: '$193,762',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/935ebdfdc94e43f59e9a5fb23a5477b7',
    buildHighlights: 'Signature vaulted prow front with trapezoid panoramic view windows, architectural pine timber beams, and wrap-around viewing porch.',
    customerStory: 'Engineered specifically for the homeowner\'s Olympic Mountain view corridor with daylight crawlspace foundation and heat pump package.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-casita-bremerton',
    floorplanId: 'gw-dream-silver-casita',
    name: 'Dream Silver Casita ADU (30-1)',
    series: 'Dream Silver ADU',
    manufacturer: 'Golden West Albany',
    location: 'Turnkey Backyard ADU Installation · Bremerton, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_9c8d2709b61a478ebb1b659915750f8b~mv2.webp',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_9c8d2709b61a478ebb1b659915750f8b~mv2.webp',
      'https://static.wixstatic.com/media/866235_180ed77e6d0c4e489699bf325119ba07~mv2.webp'
    ],
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 409,
    dimensions: '14\' x 30\'',
    sections: 'Single-Wide / ADU',
    basePrice: 98335,
    priceFormatted: '$98,335',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/dcc793a4ecd5443eab27501b640cf53b',
    buildHighlights: 'Ultra-efficient compact living footprint with full residential kitchen, stainless steel appliance suite, stackable washer/dryer hookup, and custom front porch.',
    customerStory: 'Permitted and installed in the city of Bremerton as an independent accessory dwelling unit for family living.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-staying-alive-belfair',
    floorplanId: 'cl-tempo-stayingaliveporch',
    name: 'Tempo — Stayin\' Alive (Craftsman Porch)',
    series: 'Tempo Series',
    manufacturer: 'Clayton Homes',
    location: 'Turnkey Home on Acreage · Belfair, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_ddc7797e5f9d497395378c93caae1867~mv2.jpg',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_ddc7797e5f9d497395378c93caae1867~mv2.jpg',
      'https://static.wixstatic.com/media/866235_cdc3f6249fa44323b21c8922779bd045~mv2.png'
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1414,
    dimensions: '28\' x 56\'',
    sections: 'Double-Wide',
    basePrice: 152712,
    priceFormatted: '$152,712',
    hasTour: true,
    tourUrl: 'https://my.matterport.com/show/?m=9bY9k3sZkQ2',
    buildHighlights: 'Built-in 8-foot covered craftsman rocking-chair front porch, farmhouse apron sink, expansive entertainment kitchen island, and walk-in pantry.',
    customerStory: 'Built on a cleared Belfair lot near North Mason with high-efficiency ductless heating and custom concrete pathway.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-columbia-river-port-orchard',
    floorplanId: 'mar-columbia-river-2022',
    name: 'Columbia River 2022 Prairie Ranch',
    series: 'Columbia River Series',
    manufacturer: 'Marlette Homes',
    location: 'Wooded Parcel Build · Port Orchard, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_a0af73381d814e1fa345a1edd31b072d~mv2.jpg',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_a0af73381d814e1fa345a1edd31b072d~mv2.jpg',
      'https://static.wixstatic.com/media/866235_8d925304a7c547868c017bd64c756fe3~mv2.webp'
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1493,
    dimensions: '27\' x 56\'',
    sections: 'Double-Wide',
    basePrice: 163040,
    priceFormatted: '$163,040',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/67e23730e66649f7823f66c0ce394c86',
    buildHighlights: 'Architectural gable facade with fiber-cement lap siding, split-bedroom privacy layout, open great room, and luxury spa bathroom retreat.',
    customerStory: 'Delivered and set on continuous concrete foundation with detached two-car garage coordination.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-redwood-silverdale',
    floorplanId: 'gw-inspiration-gold-382f',
    name: 'Redwood II (ING 382F)',
    series: 'Inspiration Gold Series',
    manufacturer: 'Golden West Albany',
    location: 'Residential Lot Build · Silverdale, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_b9b96ad7179e4b3db4d34fc637c234ff~mv2.webp',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_b9b96ad7179e4b3db4d34fc637c234ff~mv2.webp',
      'https://static.wixstatic.com/media/866235_ccccf9834dca451bb699228810be1cd2~mv2.webp'
    ],
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1026,
    dimensions: '27\' x 38\'',
    sections: 'Double-Wide',
    basePrice: 153275,
    priceFormatted: '$153,275',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/2bb1b489d81648a3b50c0bbd603a1fc6',
    buildHighlights: 'Compact double-wide craftsman styling with tall picture windows, breakfast bar island, and primary suite walk-in shower.',
    customerStory: 'Custom ordered with modern cool-palette interior décor package and upgraded 40-gallon heat pump water heater.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-majestic-9588-hood-canal',
    floorplanId: 'mar-majestic-9588',
    name: 'Majestic 9588-S Grand Estate',
    series: 'Majestic Series',
    manufacturer: 'Marlette Homes',
    location: 'Waterfront Acreage · Hood Canal, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_79c68540999e49e98cae9e41cfc868e0~mv2.webp',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_79c68540999e49e98cae9e41cfc868e0~mv2.webp',
      'https://static.wixstatic.com/media/866235_300cef3fb5fa4968af19a2bbe73759aa~mv2.webp'
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2240,
    dimensions: '40\' x 56\'',
    sections: 'Triple-Wide',
    basePrice: 273517,
    priceFormatted: '$273,517',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/fec9eaee3cba477c92b23a595bf41047',
    buildHighlights: '2,240 square-foot triple-section estate with dramatic cathedral ceilings, expansive formal dining, butler pantry, and dual primary walk-in closets.',
    customerStory: 'Delivered in three sections and set onto an engineered daylight basement with scenic sound view deck.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-imagine-5038-poulsbo',
    floorplanId: 'mar-imagine-5038',
    name: 'Imagine 5038 Northwest Cottage',
    series: 'Imagine Series',
    manufacturer: 'Marlette Homes',
    location: 'Coastal Cottage Setup · Poulsbo, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_60e25bc3cc2d47b8bf57f4ce10aed808~mv2.webp',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_60e25bc3cc2d47b8bf57f4ce10aed808~mv2.webp',
      'https://static.wixstatic.com/media/866235_c46cc1a5d60745d794e1851419402f2d~mv2.webp'
    ],
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 839,
    dimensions: '27\' x 32\'',
    sections: 'Double-Wide',
    basePrice: 133722,
    priceFormatted: '$133,722',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/61e89cf082164f9cb907e852920c7847',
    buildHighlights: 'Charming Scandinavian craftsman cottage layout with gabled entry porch, durable fiber cement siding, and high energy efficiency.',
    customerStory: 'Built for retirement living on a quiet Poulsbo residential lot with zero-step entry and wide doorways.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-lodge-park-model',
    floorplanId: 'gw-gwp-1',
    name: 'Dream Park Model — The Lodge',
    series: 'Dream Park Model',
    manufacturer: 'Golden West Albany',
    location: 'Vacation Cabin Placement · Mason County, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_71f71ad02d05411e9a6ce4a0882834e3~mv2.jpg',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_71f71ad02d05411e9a6ce4a0882834e3~mv2.jpg',
      'https://static.wixstatic.com/media/866235_c67d02f9967046b4bf25e6a81fd2e449~mv2.jpg'
    ],
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 396,
    dimensions: '11\' x 36\'',
    sections: 'Park Model',
    basePrice: 66627,
    priceFormatted: '$66,627',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/60b64be1bc5f49df9c4d9bc0262102fe',
    buildHighlights: 'Cedar log-cabin siding styling, interior tongue-and-groove cedar ceiling, sleeping loft, and covered front cedar deck overlooking the woods.',
    customerStory: 'Delivered to a private recreational parcel along the Skokomish River as a turnkey weekend cabin.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-columbia-river-2029-gigharbor',
    floorplanId: 'mar-columbia-river-2029',
    name: 'Columbia River 2029 Ranch',
    series: 'Columbia River Series',
    manufacturer: 'Marlette Homes',
    location: 'Residential Placement · Gig Harbor, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_df89e1f8e2004531a8d10ab1a0a7bc17~mv2.webp',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_df89e1f8e2004531a8d10ab1a0a7bc17~mv2.webp',
      'https://static.wixstatic.com/media/866235_459ac2a33bf44e9eba12e59f6c0d4c29~mv2.webp'
    ],
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 864,
    dimensions: '27\' x 32\'',
    sections: 'Double-Wide',
    basePrice: 134503,
    priceFormatted: '$134,503',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/86591703e23049b49386d388f8dff870',
    buildHighlights: 'Open-concept great room, dual-suite split layout, insulated low-E argon windows, and solid wood face-frame cabinetry.',
    customerStory: 'Set up with custom stamped concrete patio and landscaping in south Kitsap/Gig Harbor.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-dogwood-port-townsend',
    floorplanId: 'gw-inspiration-gold-361f',
    name: 'Dogwood (ING 361F)',
    series: 'Inspiration Gold Series',
    manufacturer: 'Golden West Albany',
    location: 'Custom Build · Port Townsend, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_eb597facee6a48f391fcee3004f470f9~mv2.webp',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_eb597facee6a48f391fcee3004f470f9~mv2.webp',
      'https://static.wixstatic.com/media/866235_f8e0baea230641a995307c72eff0f3b0~mv2.webp'
    ],
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 958,
    dimensions: '27\' x 36\'',
    sections: 'Double-Wide',
    basePrice: 147703,
    priceFormatted: '$147,703',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/6fc6d5b072ef428784d1c16260907d72',
    buildHighlights: 'Pacific Northwest craftsman roofline with covered front entry, open kitchen peninsula with bar seating, and Energy Star thermal package.',
    customerStory: 'Turnkey site setup with Olympic rain shadow engineering and custom porch railing.',
    yearBuilt: 'Completed'
  },
  {
    id: 'built-dream-silver-482f-shelton',
    floorplanId: 'gw-dream-silver-482f',
    name: 'Dream Silver 482F Family Ranch',
    series: 'Dream Silver Series',
    manufacturer: 'Golden West Albany',
    location: 'Turnkey Family Home · Shelton, WA',
    primaryImage: 'https://static.wixstatic.com/media/866235_c8fa507510714c96b93c9a7d4974b211~mv2.png',
    allPhotos: [
      'https://static.wixstatic.com/media/866235_c8fa507510714c96b93c9a7d4974b211~mv2.png',
      'https://static.wixstatic.com/media/866235_36dab4a7a84e42419166e96f7ae8db55~mv2.webp'
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1296,
    dimensions: '27\' x 48\'',
    sections: 'Double-Wide',
    basePrice: 153413,
    priceFormatted: '$153,413',
    hasTour: true,
    tourUrl: 'https://momento360.com/e/uc/b4eb34399bdf4754ab359f13ebc96fa0',
    buildHighlights: 'Spacious 3-bedroom layout with oversized living room, primary en-suite with soaking tub and separate shower, and full utility mudroom.',
    customerStory: 'Installed on family land in Mason County with complete utility connections and concrete driveway.',
    yearBuilt: 'Completed'
  }
];
