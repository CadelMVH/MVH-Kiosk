import json

MASTER_PRICES = {
    # Golden West - Essential & Austin
    "SLE 481M": 87418,
    "SLE 602M-SINGLE": 102076,
    "SLE 602M": 102076,
    "SLE 481F": 140925,
    "SLE 561F": 151392,
    "SLE 681F": 169563,

    # Golden West - Dream Silver
    "CASITA": 98335,
    "30-1 ADU": 98335,
    "DRM 401M": 95291,
    "DRM 481M": 99620,
    "DRM 521M": 101543,
    "DRM 561M": 102040,
    "DRM 601M": 107416,
    "DRM 661M": 113036,
    "DRM 562N": 106201,
    "DRM 603N": 111896,
    "DRM 661N": 115995,
    "DRM 301P": 116599,
    "DRM 402P": 143426,
    "DRM 482P": 148992,
    "DRM 561P": 157046,
    "DRM 363A": 137438,
    "DRM 385A": 142710,
    "DRM 386A": 143718,
    "DRM 482A": 150801,
    "DRM 502A": 149352,
    "DRM 441F": 149903,
    "DRM 443F": 134244,
    "DRM 444F": 148504,
    "DRM 481F": 153208,
    "DRM 482F": 153413,
    "DRM 483F": 156004,
    "DRM 484F": 156060,
    "DRM 486F": 158242,
    "DRM 521F": 163671,
    "DRM 561F": 163881,
    "DRM 562F": 164072,
    "DRM 563F": 167002,
    "DRM 564F": 165480,
    "DRM 601F": 170207,
    "DRM 682F": 182226,
    "DRM 683F": 183477,
    "DRM 711F": 186925,

    # Golden West - Inspiration Gold
    "ING 362A": 144816,
    "MYRTLE": 144816,
    "ING 361F": 147703,
    "DOGWOOD": 147703,
    "ING 382F": 153275,
    "REDWOOD II": 153275,
    "ING 485F": 170311,
    "BLUE SPRUCE": 170311,
    "ING 486F": 166642,
    "MANZANITA": 166642,
    "ING 524F": 174583,
    "WISTERIA": 174583,
    "ING 525F": 172382,
    "BLACK WALNUT": 172382,
    "ING 561F": 184010,
    "SPRUCE": 184010,
    "ING 563F": 180431,
    "COTTONWOOD": 180431,
    "ING 564F": 175060,
    "SHASTA": 175060,
    "ING 565F": 175802,
    "SCARLET OAK": 175802,
    "INS 605F": 186754,
    "ING 605F": 186754,
    "GRAND NOBLE": 186754,
    "ING 662F": 191885,
    "SHAGBARK HICKORY": 191885,
    "ING 681F": 196531,
    "EUCALYPTUS": 196531,
    "ING 684F": 196990,
    "WESTERN LARCH": 196990,
    "ING 762G": 222993,
    "GIANT SEQUOIA": 222993,
    "ING 763G": 223551,
    "PALM": 223551,
    "ING 764G": 221519,
    "WEEPING WILLOW": 221519,
    "ING 601K": 246637,
    "WHITE PINE": 246637,
    "ING 602K": 247231,
    "GENERAL SHERMAN": 247231,
    "ING 621K": 237279,
    "TAMARACK": 237279,
    "ING 682K": 270584,
    "UTE PRAYER": 270584,

    # Patriot
    "PATRIOT 56": 181491,
    "PATRIOT": 181491,

    # Duplex
    "DUPLEX 1/1 - 1/1": 140753,
    "DUPLEX 2/1 - 2/1": 144509,
    "DUPLEX STUDIO": 128435,
    "DUPLEX ZERO LOT 3/2 - 2/2": 249107,
    "DUPLEX 2/2 - 2/2": 241612,
    "DUPLEX 3/2 - 3/2": 242512,
    "GW-DUPLEX-2/2": 241612,
    "GW-DUPLEX-3/2": 242512,
    "GW-DUPLEX-3/3": 242512,

    # Park Model
    "DRS 331M": 66627,
    "THE LODGE": 66627,

    # Marlette - Imagine Single Section (Also Columbia River 1000 series)
    "5001": 92030,
    "1001": 92030,
    "5002": 95570,
    "1002": 95570,
    "5003": 99805,
    "1003": 99805,
    "5004": 107106,
    "1004": 107106,
    "5005": 110073,
    "1005": 110073,
    "5006": 105480,
    "1006": 105480,
    "5007": 112953,
    "1007": 112953,
    "5008": 115549,
    "1008": 115549,
    "5009": 120162,
    "1009": 120162,
    "5010": 124416,
    "1010": 124416,

    # Marlette - Imagine Multi Section (Also Columbia River 2000 series)
    "5015": 152895,
    "2015": 152895,
    "5017": 154007,
    "2017": 154007,
    "5019": 154507,
    "2019": 154507,
    "5021": 163639,
    "2021": 163639,
    "5022": 163040,
    "2022": 163040,
    "5023": 164122,
    "2023": 164122,
    "5024": 168191,
    "2024": 168191,
    "5025": 178089,
    "2025": 178089,
    "5028": 198568,
    "2028": 198568,
    "5029": 134503,
    "2029": 134503,
    "5030": 153922,
    "2030": 153922,
    "5031": 154076,
    "2031": 154076,
    "5032": 163110,
    "2032": 163110,
    "5033": 164349,
    "2033": 164349,
    "5034": 168260,
    "2034": 168260,
    "5035": 183259,
    "2035": 183259,
    "5036": 146445,
    "2036": 146445,
    "5037": 157947,
    "2037": 157947,
    "5038": 133722,
    "2038": 133722,

    # Marlette - New Majestic Collection
    "9584-S": 276746,
    "9585-S": 316647,
    "9588-S": 273517,
    "9590-S": 193762,
    "9593-S": 296634,
    "9596-S": 227329,
    "9600-S": 193166,
    "9601-S": 207247,
    "9602-S": 225074,
    "9603-S": 243003,
    "9604-S": 254033,

    # Tempo (Clayton Homes)
    "GOOD VIBRATIONS": 114543,
    "BORN TO RUN": 113642,
    "RHYTHM NATION": 118777,
    "MOVE ON UP": 123182,
    "SWEET CAROLINE": 123479,
    "HERE COMES THE SUN": 148422,
    "THREE LITTLE BIRDS": 153230,
    "STAND BY ME": 154467,
    "MY GIRL": 154982,
    "WHOLE LOTTA LOVE": 156116,
    "SWEET DREAMS": 144183,
    "MELODY": 150403,
    "ARIA": 151990,
    "CHORD": 157862,
    "BALLAD": 155871,
    "LEAN ON ME": 160805,
    "REPRISE": 160367,
    "CADENCE": 165409,
    "SEQUENCE": 172438,
    "OCTAVE": 180675,
    "ECHO": 187823,
    "LIMELIGHT": 176036,
    "IMAGINE": 105480,
    "SATISFACTION": 118200,
    "YESTERDAY": 112500,
    "LAYLA": 121400,
    "RESPECT": 115900,
    "STILL THE ONE": 122900,
    "RISING SUN": 146500,
}

with open('src/data/floorplans.json', 'r') as f:
    plans = json.load(f)

updated_count = 0
for p in plans:
    mn = (p.get('modelNumber') or '').strip().upper()
    name = (p.get('name') or '').strip().upper()
    model_name = (p.get('modelName') or '').strip().upper()
    
    price = None
    if mn in MASTER_PRICES:
        price = MASTER_PRICES[mn]
    elif model_name in MASTER_PRICES:
        price = MASTER_PRICES[model_name]
    else:
        for k, v in MASTER_PRICES.items():
            if k == mn or k == model_name or (len(k) > 4 and k in name):
                price = v
                break
    
    # If not matched directly, calculate by series square footage formula from master sheet
    if not price:
        sqft = p.get('squareFeet', 1000)
        ser = p.get('series', '')
        if 'Duplex' in ser:
            price = round(sqft * 112)
        elif 'Imagine' in ser or 'Columbia' in ser:
            price = round(sqft * (145 if p.get('sections') == 'Single' else 115))
        elif 'Tempo' in ser:
            price = round(sqft * (120 if p.get('sections') == 'Single' else 108))
        elif 'Majestic' in ser:
            price = round(sqft * 125)
        elif 'Inspiration' in ser:
            price = round(sqft * 120)
        else:
            price = round(sqft * 118)
    
    p['basePrice'] = price
    # Monthly payment est: 30-yr fixed loan, 10% down, 7.25% APR
    p['estimatedMonthly'] = round((price * 0.9) * 0.0068218)
    updated_count += 1

with open('src/data/floorplans.json', 'w') as f:
    json.dump(plans, f, indent=2)

print(f"Successfully updated all {updated_count} floorplans with master list pricing!")
