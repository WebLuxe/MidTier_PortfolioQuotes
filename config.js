/* ==========================================================================
   config.js: EVERYTHING ABOUT THE CLIENT LIVES IN THIS FILE.
   Change the values below and save. index.html, the other pages, css/ and
   js/ never need editing.

   Rules of thumb:
   - Text that changes with the language is written { en: "...", fr: "..." }.
   - Leave a value empty ("") or delete a list item to hide it. Set
     enabled: false on a section to remove the whole section.
   - Photos: paste an Unsplash link, or put your own file in /assets and
     write its path, e.g. "assets/work/kitchen-moka.jpg".
     A photo can also be { src: "...", alt: { en: "...", fr: "..." } } so blind
     visitors and Google know what it shows.
   ========================================================================== */
const U = (id, alt) => ({ src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70`, alt }); // shortcut for Unsplash photos

window.SITE = {

  /* ---------- 1. The business ---------- */
  name: "Atelier Lagon",
  legalName: "Atelier Lagon Ltd",
  tagline: { en: "Made-to-measure kitchens, wardrobes and interiors, designed and built in our Moka workshop.", fr: "Cuisines, dressings et intérieurs sur mesure, dessinés et fabriqués dans notre atelier de Moka." },
  logo: { image: "", mark: "A", text: "Atelier Lagon" },

  /* ---------- 2. Brand colours and fonts ---------- */
  colors: {
    primary: "#1F3A34",  // deep green: buttons, headers of cards, the quote band
    accent:  "#C08A4B",  // brass: "Get a quote" buttons, icons, highlights
    dark:    "#121E1B",  // footer and dark mode
    light:   "#F4EEE6",  // warm background of alternate sections
  },
  fonts: { heading: "Fraunces", headingWeights: "500;600;700", headingFallback: "Georgia, serif", body: "Inter", bodyWeights: "400;500;600;700" },
  darkMode: true,
  languages: ["en", "fr"],
  defaultLanguage: "en",
  timeZone: "Indian/Mauritius",
  currency: "Rs", currencyCode: "MUR",

  /* ---------- 3. Contact details ---------- */
  contact: {
    phone: "+230 5123 4567",
    whatsapp: "23051234567",
    whatsappMessage: { en: "Hello Atelier Lagon, I would like a quote for my project.", fr: "Bonjour Atelier Lagon, je voudrais un devis pour mon projet." },
    email: "studio@atelierlagon.mu",
    street: "12 Royal Road",
    city: "Moka",
    region: "",
    postalCode: "80813",
    country: { en: "Mauritius", fr: "Maurice" },
    countryCode: "MU",
    lat: -20.2189, lng: 57.4960,
    mapEmbed: "https://www.google.com/maps?q=Moka+Mauritius&z=14&output=embed",
    mapsLink: "",
  },
  hours: { mon: "08:30-17:00", tue: "08:30-17:00", wed: "08:30-17:00", thu: "08:30-17:00", fri: "08:30-17:00", sat: "09:00-13:00", sun: "" },
  social: { facebook: "https://facebook.com", instagram: "https://instagram.com", tiktok: "", linkedin: "", youtube: "" },

  /* Shown in the hero, on the testimonials and to Google. Leave rating empty to hide. */
  reviewsSummary: { rating: 4.9, count: 127, source: "Google" },

  /* ---------- 4. Google and link previews ---------- */
  seo: {
    title: { en: "Atelier Lagon | Made-to-measure kitchens & interiors in Mauritius", fr: "Atelier Lagon | Cuisines et intérieurs sur mesure à Maurice" },
    description: { en: "Kitchens, wardrobes, bathroom and living room furniture made to measure in Moka. Free home visit and quote within 5 days.", fr: "Cuisines, dressings, salles de bain et meubles de salon sur mesure à Moka. Visite gratuite et devis sous 5 jours." },
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=70",
    favicon: "assets/favicon.svg",
    schemaType: "HomeAndConstructionBusiness", // e.g. "Dentist", "GeneralContractor", "RealEstateAgent"
    priceRange: "Rs 55,000 – Rs 1,500,000",
    siteUrl: "",
  },

  /* ---------- 5. Forms ---------- */
  form: {
    // A Formspree (or similar) link sends requests to your email, e.g. "https://formspree.io/f/abcdwxyz".
    // Photo uploads need a plan that accepts files. Empty = the form opens the visitor's email app.
    endpoint: "",
  },
  quote: {
    sendVia: "both",   // "both" (send + WhatsApp buttons), "endpoint" (send only) or "whatsapp" (WhatsApp only)
    eyebrow: { en: "Free quote", fr: "Devis gratuit" },
    title: { en: "Tell us about your project", fr: "Parlez-nous de votre projet" },
    text: { en: "Three short steps. We reply within one working day to book a free measuring visit.", fr: "Trois petites étapes. Nous répondons sous un jour ouvré pour une visite de mesure gratuite." },
    detailsHint: { en: "e.g. L-shaped kitchen, about 4 m, with an island and space for a double fridge", fr: "ex. cuisine en L d'environ 4 m, avec îlot et place pour un frigo américain" },
    photoUpload: true,
    budgets: [
      { en: "Under Rs 100,000", fr: "Moins de Rs 100 000" },
      { en: "Rs 100,000 – 300,000", fr: "Rs 100 000 – 300 000" },
      { en: "Rs 300,000 – 600,000", fr: "Rs 300 000 – 600 000" },
      { en: "Over Rs 600,000", fr: "Plus de Rs 600 000" },
    ],
  },

  /* ---------- 6. Content, section by section ---------- */
  sections: {
    hero: {
      eyebrow: { en: "Made to measure in Mauritius", fr: "Sur mesure à Maurice" },
      title: { en: "Kitchens and interiors built around the way you live.", fr: "Des cuisines et intérieurs pensés pour votre façon de vivre." },
      text: { en: "Designed with you, built in our Moka workshop and fitted by our own team. One price, one contact, no surprises.", fr: "Dessinés avec vous, fabriqués dans notre atelier de Moka et posés par notre équipe. Un prix, un contact, aucune surprise." },
      cta: { en: "Get a free quote", fr: "Devis gratuit" },
      trust: { en: "14 years · 850+ homes fitted · 10-year guarantee", fr: "14 ans · 850+ maisons équipées · garantie 10 ans" },
      badge: { en: "10-year workmanship guarantee", fr: "Garantie de fabrication 10 ans" },
      images: [
        U("1556911220-bff31c812dba", { en: "Modern white kitchen with a marble island", fr: "Cuisine blanche moderne avec îlot en marbre" }),
        U("1671197244266-73129c97c096", { en: "Kitchen with marble worktops and bar stools", fr: "Cuisine avec plans en marbre et tabourets" }),
      ],
    },

    services: {
      eyebrow: { en: "What we make", fr: "Ce que nous fabriquons" },
      title: { en: "One workshop, every room", fr: "Un atelier, toutes les pièces" },
      lead: { en: "Everything is drawn, cut and finished by our own craftsmen, so you can see your furniture being made.", fr: "Tout est dessiné, découpé et fini par nos artisans : vous pouvez voir vos meubles prendre forme." },
      // id: a short word used in links (no spaces). icon names: sparkle, home, tool, ruler, paint, leaf, award, key, wave, coffee, bed, users
      items: [
        { id: "kitchens", icon: "home", from: 285000, image: U("1617228069096-4638a7ffc906", { en: "Modern kitchen with an island", fr: "Cuisine moderne avec îlot" }),
          title: { en: "Kitchens", fr: "Cuisines" },
          short: { en: "Islands, pantries and worktops in quartz, granite or solid wood.", fr: "Îlots, garde-manger et plans en quartz, granit ou bois massif." },
          text: { en: "From a compact apartment kitchen to a family kitchen with an island, we plan every drawer around how you cook. Moisture-resistant boards made for the Mauritian climate as standard.", fr: "De la cuisine d'appartement compacte à la cuisine familiale avec îlot, nous pensons chaque tiroir selon votre façon de cuisiner. Panneaux résistants à l'humidité, adaptés au climat mauricien." },
          features: [{ en: "3D design before you commit", fr: "Plan 3D avant de vous engager" }, { en: "Soft-close Blum hardware", fr: "Quincaillerie Blum à fermeture douce" }, { en: "Fitted in 3 to 5 days", fr: "Posée en 3 à 5 jours" }],
          priceNote: { en: "for a 3 m kitchen, fitted", fr: "pour une cuisine de 3 m, posée" } },
        { id: "wardrobes", icon: "key", from: 95000, image: U("1672137233327-37b0c1049e77", { en: "Walk-in wardrobe with a full-length mirror", fr: "Dressing avec grand miroir" }),
          title: { en: "Wardrobes & dressing rooms", fr: "Placards et dressings" },
          short: { en: "Built-in and walk-in, with lighting, mirrors and shoe racks.", fr: "Encastrés ou en dressing, avec éclairage, miroirs et range-chaussures." },
          text: { en: "Floor-to-ceiling wardrobes that use every centimetre, with drawers, hanging space and shelves arranged for what you actually own.", fr: "Des placards du sol au plafond qui exploitent chaque centimètre, avec tiroirs, penderies et étagères organisés selon vos affaires." },
          features: [{ en: "LED lighting on a door sensor", fr: "Éclairage LED à détection" }, { en: "Sliding or hinged doors", fr: "Portes coulissantes ou battantes" }, { en: "Anti-humidity backs", fr: "Fonds anti-humidité" }],
          priceNote: { en: "for a 2.4 m built-in wardrobe", fr: "pour un placard encastré de 2,40 m" } },
        { id: "bathrooms", icon: "wave", from: 65000, image: U("1564540579594-0930edb6de43", { en: "Marble bathroom with two sinks", fr: "Salle de bain en marbre avec deux vasques" }),
          title: { en: "Bathroom vanities", fr: "Meubles de salle de bain" },
          short: { en: "Waterproof vanities, mirror cabinets and storage towers.", fr: "Meubles vasques étanches, armoires à miroir et colonnes." },
          text: { en: "Vanity units in marine-grade materials with stone or solid-surface tops, made to fit awkward walls and old plumbing.", fr: "Meubles vasques en matériaux marine avec plans en pierre ou solid surface, adaptés aux murs et à la plomberie existants." },
          features: [{ en: "Marine-grade, waterproof boards", fr: "Panneaux marine, étanches" }, { en: "Double or single basin", fr: "Simple ou double vasque" }],
          priceNote: { en: "for a 1.2 m vanity with top", fr: "pour un meuble de 1,20 m avec plan" } },
        { id: "living", icon: "sparkle", from: 55000, image: U("1794250346636-ea20b56e8528", { en: "TV wall unit above a wooden console", fr: "Meuble TV mural au-dessus d'une console en bois" }),
          title: { en: "Living room & TV units", fr: "Salons et meubles TV" },
          short: { en: "TV walls, bookcases and window seats with hidden cables.", fr: "Murs TV, bibliothèques et banquettes, câbles cachés." },
          text: { en: "Media walls, shelving and storage benches that hide the cables and the clutter, in wood veneers, lacquer or a mix of both.", fr: "Murs TV, étagères et banquettes de rangement qui cachent câbles et désordre, en placage bois, laque ou les deux." },
          features: [{ en: "Cables and routers hidden", fr: "Câbles et box cachés" }, { en: "Veneer, lacquer or melamine", fr: "Placage, laque ou mélaminé" }],
          priceNote: { en: "for a 2.5 m TV wall", fr: "pour un mur TV de 2,50 m" } },
      ],
    },

    portfolio: {
      eyebrow: { en: "Our work", fr: "Nos réalisations" },
      title: { en: "Recent homes we have fitted", fr: "Maisons récemment équipées" },
      lead: { en: "Tap any photo to see it full screen.", fr: "Touchez une photo pour l'afficher en plein écran." },
      homeCount: 6,   // how many photos the home page shows
      categories: [   // filters on the portfolio page; only used categories are shown
        { id: "kitchens", label: { en: "Kitchens", fr: "Cuisines" } },
        { id: "wardrobes", label: { en: "Wardrobes", fr: "Dressings" } },
        { id: "bathrooms", label: { en: "Bathrooms", fr: "Salles de bain" } },
        { id: "living", label: { en: "Living rooms", fr: "Salons" } },
      ],
      items: [
        { category: "kitchens", image: U("1785535573585-8f962fa3cda5", { en: "Kitchen with a large marble island", fr: "Cuisine avec grand îlot en marbre" }), title: { en: "Island kitchen", fr: "Cuisine avec îlot" }, place: "Floréal" },
        { category: "wardrobes", image: U("1649361811423-a55616f7ab11", { en: "Walk-in closet with hanging clothes", fr: "Dressing avec vêtements suspendus" }), title: { en: "Walk-in dressing room", fr: "Dressing" }, place: "Grand Baie" },
        { category: "bathrooms", image: U("1756079664354-34944e001f6d", { en: "Marble vanity with double sinks", fr: "Meuble vasque double en marbre" }), title: { en: "Double vanity", fr: "Double vasque" }, place: "Tamarin" },
        { category: "living", image: U("1772475329864-e30a2f1278c0", { en: "Living room with wood joinery", fr: "Salon avec menuiserie bois" }), title: { en: "Oak media wall", fr: "Mur TV en chêne" }, place: "Moka" },
        { category: "kitchens", image: U("1600489000022-c2086d79f9d4", { en: "White and wood kitchen with open shelves", fr: "Cuisine blanche et bois avec étagères ouvertes" }), title: { en: "Open-shelf kitchen", fr: "Cuisine à étagères ouvertes" }, place: "Quatre Bornes" },
        { category: "kitchens", image: U("1512916194211-3f2b7f5f7de3", { en: "Warm wooden kitchen cabinets", fr: "Cuisine en bois chaleureuse" }), title: { en: "Walnut apartment kitchen", fr: "Cuisine d'appartement en noyer" }, place: "Ébène" },
        { category: "wardrobes", image: U("1683181181300-44c0c991a2cf", { en: "White built-in wardrobe with shoe rack", fr: "Placard blanc avec range-chaussures" }), title: { en: "Built-in wardrobe", fr: "Placard encastré" }, place: "Curepipe" },
        { category: "bathrooms", image: U("1682888818696-906287d759f5", { en: "Bathroom with green cabinets", fr: "Salle de bain aux meubles verts" }), title: { en: "Green lacquer vanity", fr: "Meuble vasque laqué vert" }, place: "Flic en Flac" },
        { category: "living", image: U("1600210492493-0946911123ea", { en: "Living room with large windows", fr: "Salon avec grandes fenêtres" }), title: { en: "Family living room", fr: "Salon familial" }, place: "Pereybère" },
        { category: "kitchens", image: U("1671197244266-73129c97c096", { en: "Kitchen with marble worktops and stools", fr: "Cuisine avec plans en marbre et tabourets" }), title: { en: "Marble breakfast bar", fr: "Bar en marbre" }, place: "Black River" },
        { category: "wardrobes", image: U("1672137233327-37b0c1049e77", { en: "Walk-in wardrobe with mirror", fr: "Dressing avec miroir" }), title: { en: "Dressing with mirror wall", fr: "Dressing avec mur miroir" }, place: "Moka" },
        { category: "bathrooms", image: U("1564540579594-0930edb6de43", { en: "Marble bathroom with two sinks", fr: "Salle de bain en marbre à deux vasques" }), title: { en: "Hotel-style bathroom", fr: "Salle de bain style hôtel" }, place: "Trou aux Biches" },
      ],
    },

    beforeAfter: {
      eyebrow: { en: "Before & after", fr: "Avant / après" },
      title: { en: "Drag to see the difference", fr: "Faites glisser pour voir la différence" },
      lead: { en: "Same room, same walls. Six weeks apart.", fr: "Même pièce, mêmes murs. Six semaines d'écart." },
      items: [
        { before: U("1717331822162-74e5eaf4d038", { en: "The kitchen before: dated cabinets", fr: "La cuisine avant : meubles vieillots" }), after: U("1638886043487-72d203fa66b6", { en: "The kitchen after: white island kitchen", fr: "La cuisine après : cuisine blanche avec îlot" }), title: { en: "Family kitchen, Vacoas", fr: "Cuisine familiale, Vacoas" }, text: { en: "Wall removed, island added, fitted in 4 days", fr: "Mur supprimé, îlot ajouté, posée en 4 jours" } },
        { before: U("1639460942795-e6f65771998a", { en: "Before: worn cabinets and an old stove", fr: "Avant : meubles usés et vieille cuisinière" }), after: U("1610276173132-c47d148ab626", { en: "After: bright white cabinets", fr: "Après : meubles blancs lumineux" }), title: { en: "Apartment kitchen, Rose Hill", fr: "Cuisine d'appartement, Rose-Hill" }, text: { en: "Same layout, new everything", fr: "Même plan, tout est neuf" } },
      ],
    },

    process: {
      eyebrow: { en: "How it works", fr: "Comment ça se passe" },
      title: { en: "From first call to the last screw", fr: "Du premier appel à la dernière vis" },
      steps: [   // icon names as above, plus phone, calendar, ruler, doc, tool, check
        { icon: "phone", title: { en: "Contact", fr: "Contact" }, text: { en: "Send the form or a WhatsApp with a few photos.", fr: "Envoyez le formulaire ou un WhatsApp avec quelques photos." } },
        { icon: "ruler", title: { en: "Site visit", fr: "Visite" }, text: { en: "We measure at home, free, usually within the week.", fr: "Nous mesurons chez vous, gratuitement, en général dans la semaine." } },
        { icon: "doc", title: { en: "Design & quote", fr: "Plan et devis" }, text: { en: "A 3D drawing and a fixed price within 5 days.", fr: "Un plan 3D et un prix ferme sous 5 jours." } },
        { icon: "tool", title: { en: "Making & fitting", fr: "Fabrication et pose" }, text: { en: "Built in our workshop, fitted by our own team.", fr: "Fabriqué dans notre atelier, posé par notre équipe." } },
        { icon: "check", title: { en: "Done", fr: "Terminé" }, text: { en: "A final walk-through and a 10-year guarantee.", fr: "Une visite de fin de chantier et une garantie de 10 ans." } },
      ],
    },

    testimonials: {
      eyebrow: { en: "Reviews", fr: "Avis" },
      title: { en: "What our clients say", fr: "Ce que disent nos clients" },
      autoplay: true,
      items: [
        { name: "Anjali D.", place: "Floréal", project: { en: "Kitchen", fr: "Cuisine" }, rating: 5, text: { en: "They showed us the kitchen in 3D before anything was cut, and the finished one looks exactly like it. Fitted in four days, spotless when they left.", fr: "Ils nous ont montré la cuisine en 3D avant de découper quoi que ce soit, et le résultat est identique. Posée en quatre jours, impeccable à leur départ." } },
        { name: "Laurent M.", place: "Tamarin", project: { en: "Bathrooms", fr: "Salles de bain" }, rating: 5, text: { en: "Three bathrooms in a seaside villa, all waterproof and still perfect after two cyclone seasons.", fr: "Trois salles de bain dans une villa en bord de mer, toutes étanches et encore parfaites après deux saisons cycloniques." } },
        { name: "Priya & Kevin R.", place: "Moka", project: { en: "Wardrobes", fr: "Dressings" }, rating: 5, text: { en: "We visited the workshop and saw our wardrobes being made. The price on the quote was the price we paid.", fr: "Nous avons visité l'atelier et vu nos placards en fabrication. Le prix du devis est celui que nous avons payé." } },
        { name: "Sophie L.", place: "Grand Baie", project: { en: "Living room", fr: "Salon" }, rating: 5, text: { en: "Our TV wall hides every cable and the router. Friends always ask who made it.", fr: "Notre mur TV cache tous les câbles et la box. Nos amis demandent toujours qui l'a fait." } },
      ],
    },

    faq: {
      eyebrow: { en: "Questions", fr: "Questions" },
      title: { en: "Good to know", fr: "Bon à savoir" },
      lead: { en: "Anything else? Ask us on WhatsApp.", fr: "Une autre question ? Écrivez-nous sur WhatsApp." },
      items: [
        { q: { en: "Is the home visit really free?", fr: "La visite est-elle vraiment gratuite ?" }, a: { en: "Yes. We measure, listen and take photos at no cost and with no commitment, anywhere in Mauritius.", fr: "Oui. Nous mesurons, écoutons et prenons des photos gratuitement et sans engagement, partout à Maurice." } },
        { q: { en: "How long does a kitchen take?", fr: "Combien de temps pour une cuisine ?" }, a: { en: "About 4 to 6 weeks from the signed quote: 3 to 5 weeks in the workshop and 3 to 5 days of fitting.", fr: "Environ 4 à 6 semaines après signature : 3 à 5 semaines en atelier et 3 à 5 jours de pose." } },
        { q: { en: "Do you remove the old furniture?", fr: "Enlevez-vous les anciens meubles ?" }, a: { en: "Yes, removal and disposal of your old units is included in every quote.", fr: "Oui, la dépose et l'évacuation de vos anciens meubles sont comprises dans chaque devis." } },
        { q: { en: "What does the 10-year guarantee cover?", fr: "Que couvre la garantie de 10 ans ?" }, a: { en: "Carcasses, doors and fitting. Hinges and drawer runners are covered by the maker's lifetime guarantee.", fr: "Caissons, façades et pose. Charnières et coulisses sont couvertes par la garantie à vie du fabricant." } },
        { q: { en: "How do I pay?", fr: "Comment payer ?" }, a: { en: "40% when you sign, 50% before fitting and 10% when you are happy with the result.", fr: "40 % à la signature, 50 % avant la pose et 10 % quand vous êtes satisfait." } },
      ],
    },

    quoteBand: {
      title: { en: "Ready to start your project?", fr: "Prêt à lancer votre projet ?" },
      text: { en: "Tell us what you have in mind. We will come and measure for free.", fr: "Dites-nous ce que vous imaginez. Nous venons mesurer gratuitement." },
      image: U("1683115099860-5379ac101bce", { en: "Craftsman cutting timber in the workshop", fr: "Artisan découpant du bois à l'atelier" }),
    },

    about: {
      eyebrow: { en: "Our story", fr: "Notre histoire" },
      title: { en: "A family workshop, since 2011", fr: "Un atelier familial depuis 2011" },
      text: [
        { en: "Atelier Lagon started in a garage in Moka with one saw and one client. Fourteen years later, a team of 22 designers, cabinet makers and fitters works from a 1,200 m² workshop on Royal Road.", fr: "Atelier Lagon est né dans un garage de Moka avec une scie et un client. Quatorze ans plus tard, une équipe de 22 designers, ébénistes et poseurs travaille dans un atelier de 1 200 m² sur Royal Road." },
        { en: "We still do things the slow way where it matters: every piece is checked by hand before it leaves, and the person who measures your home is the person who fits it.", fr: "Nous prenons toujours le temps là où ça compte : chaque pièce est vérifiée à la main avant de partir, et la personne qui mesure chez vous est celle qui pose." },
      ],
      image: U("1687422810663-c316494f725a", { en: "Carpenter at work in the Atelier Lagon workshop", fr: "Ébéniste au travail dans l'atelier" }),
      quote: { en: "We build every kitchen as if it were going into our own home.", fr: "Nous fabriquons chaque cuisine comme si elle allait chez nous." },
      stats: [
        { value: 14, label: { en: "Years", fr: "Ans" } },
        { value: 850, suffix: "+", label: { en: "Homes fitted", fr: "Maisons équipées" } },
        { value: 22, label: { en: "Craftspeople", fr: "Artisans" } },
      ],
    },

    team: {
      eyebrow: { en: "The team", fr: "L'équipe" },
      title: { en: "The people behind your project", fr: "Les personnes derrière votre projet" },
      members: [
        { name: "Rajesh Lagon", role: { en: "Founder & head cabinet maker", fr: "Fondateur et chef ébéniste" }, photo: U("1765486599857-610a91ea1459", "Rajesh Lagon"), bio: { en: "Trained in Lyon, back home since 2011.", fr: "Formé à Lyon, de retour à Maurice depuis 2011." } },
        { name: "Nadia Lagon", role: { en: "Lead designer", fr: "Designer principale" }, photo: U("1710777932534-2a58edf3603d", "Nadia Lagon"), bio: { en: "Draws every kitchen in 3D with you.", fr: "Dessine chaque cuisine en 3D avec vous." } },
        { name: "Yannick Pierre", role: { en: "Fitting manager", fr: "Responsable de la pose" }, photo: U("1770452603217-89b4f03e8271", "Yannick Pierre"), bio: { en: "Leads our three fitting teams.", fr: "Dirige nos trois équipes de pose." } },
      ],
    },

    badges: {
      eyebrow: { en: "Certifications", fr: "Certifications" },
      title: { en: "Trusted, certified, insured", fr: "Fiables, certifiés, assurés" },
      items: [   // { title, text, image: "assets/badges/xyz.png" } or an icon name
        { icon: "award", title: { en: "10-year guarantee", fr: "Garantie 10 ans" }, text: { en: "On every piece we make", fr: "Sur chaque pièce fabriquée" } },
        { icon: "shield", title: { en: "Fully insured", fr: "Entièrement assurés" }, text: { en: "Public liability cover", fr: "Responsabilité civile" } },
        { icon: "leaf", title: { en: "FSC-certified wood", fr: "Bois certifié FSC" }, text: { en: "From managed forests", fr: "Issu de forêts gérées" } },
        { icon: "check", title: { en: "Blum partner", fr: "Partenaire Blum" }, text: { en: "Authorised hardware fitter", fr: "Installateur agréé" } },
      ],
    },

    pageHeads: {   // the banner at the top of each inner page
      services: { title: { en: "Our services", fr: "Nos services" }, text: { en: "Every piece is designed with you and made in our own workshop.", fr: "Chaque meuble est dessiné avec vous et fabriqué dans notre atelier." }, image: U("1683115099860-5379ac101bce", "") },
      portfolio: { title: { en: "Our work", fr: "Nos réalisations" }, text: { en: "A few of the 850+ homes we have fitted across Mauritius.", fr: "Quelques-unes des 850+ maisons équipées à travers Maurice." }, image: U("1785535573585-8f962fa3cda5", "") },
      about: { title: { en: "About Atelier Lagon", fr: "À propos d'Atelier Lagon" }, text: { en: "Fourteen years, one workshop, the same care.", fr: "Quatorze ans, un atelier, le même soin." }, image: U("1687422810663-c316494f725a", "") },
      contact: { title: { en: "Get a free quote", fr: "Devis gratuit" }, text: { en: "Tell us about your project, or visit our showroom in Moka.", fr: "Parlez-nous de votre projet, ou visitez notre showroom à Moka." } },
    },
  },

  credit: { name: "WebLuxe", url: "https://webluxe.github.io/WebLuxe/" },

  /* ---------- 7. Demo mode (WebLuxe sales demos). Set enabled: false for a real client ---------- */
  demo: {
    enabled: true,
    studioWhatsapp: "",
    tiers: [
      { label: { en: "Essentials", fr: "Essentiel" }, url: "https://webluxe.github.io/LowTier_BusinessEssentials/" },
      { label: { en: "Portfolio", fr: "Portfolio" }, url: "https://webluxe.github.io/MidTier_PortfolioQuotes/", current: true },
      { label: { en: "Bookings", fr: "Réservations" }, url: "https://webluxe.github.io/HighTier_Bookings/" },
    ],
  },

  /* ---------- 8. All the small words on buttons and labels ---------- */
  text: {
    en: {
      // ----- words used on every WebLuxe template (menus, buttons, messages) -----
      home: "Home", skip: "Skip to content", menu: "Menu", switchLang: "Voir le site en français", toggleTheme: "Switch light or dark mode",
      explore: "Explore", footerNav: "Footer links", contactTitle: "Contact", hoursTitle: "Opening hours", rights: "All rights reserved.", websiteBy: "Website by",
      whatsappUs: "Chat on WhatsApp", phone: "Phone", email: "Email", address: "Address", chatNow: "Chat with us now",
      closed: "Closed", today: "today", tomorrow: "tomorrow", openUntil: "Open now, until {time}", closedOpens: "Closed now. Opens {day} at {time}",
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      introSkip: "Skip", close: "Close", ok: "OK", prev: "Previous", next: "Next", slide: "Go to slide {n}", showMap: "Show the map", mapTitle: "Map showing our location",
      formSending: "Sending…", formSent: "Thank you. Your message has been sent and we will reply soon.", formError: "Sorry, the message could not be sent. Please call us on {phone}.",
      formMailto: "Your email app has opened with your message. Press send there to finish.", formDemoDone: "Demo: nothing was sent.",
      demoLabel: "About this demo", demoBadge: "Demo", demoNote: "Example website by WebLuxe. The business, prices and reviews are samples.",
      demoTitle: "This is a demo", demoWa: "On the real website, this opens WhatsApp with this message ready to send:", demoTel: "On the real website, this calls the business:",
      demoMail: "On the real website, this opens an email to the business.", demoForm: "On the real website, the business receives this:",
      demoStudio: "Get a site like this", demoStudioMsg: "Hello WebLuxe, I saw the {site} demo and would like a website like it.",
      // ----- this template -----
      navHome: "Home", navServices: "Services", navPortfolio: "Our work", navAbout: "About", navContact: "Contact", breadcrumb: "You are here",
      getQuote: "Get a quote", getFreeQuote: "Get a free quote", seeWork: "See our work", allServices: "All services", allProjects: "See all {n} projects",
      from: "From", startingFrom: "Starting from", quoteFor: "Get a quote for this", all: "All", filterLabel: "Filter the projects", viewPhoto: "View {title} full screen",
      before: "Before", after: "After", baSlider: "Slide to compare before and after", ratingOf: "{n} out of 5 stars", reviewsCount: "{n} reviews on {source}",
      showroom: "Showroom", optional: "(optional)", freeQuote: "Free quote", quoteTitle: "Tell us about your project",
      qStep1: "Project", qStep2: "Details", qStep3: "Your details", qWhich: "What can we make for you?", qOther: "Something else", qTell: "Tell us a little more",
      qDetails: "Your project", qLocation: "Town or village", qBudget: "Budget", qBudgetPick: "Choose a range", qPhotos: "Photos of the space", qPhotosHint: "Tap to add photos", qPhotosN: "{n} photo(s) added",
      qPhotosWa: "I will send {n} photo(s) in this chat.", qAbout: "How can we reach you?", qDate: "Best day for a visit", back: "Back", continue: "Continue",
      qSend: "Send my request", qSendWa: "Send on WhatsApp", qThanks: "Thank you!", qThanksText: "We have your request and will call you within one working day to book the visit.",
      waQuoteIntro: "Hello {name}, I would like a quote:", quoteSubject: "New quote request from the {name} website",
      fName: "Your name", fPhone: "Phone", fEmail: "Email", formPrivacy: "We only use your details to reply to you.",
      seeDetails: "See the details", orderNo: "Order no.",
    },
    fr: {
      // ----- mots utilisés sur tous les modèles WebLuxe (menus, boutons, messages) -----
      home: "Accueil", skip: "Aller au contenu", menu: "Menu", switchLang: "View the site in English", toggleTheme: "Passer en mode clair ou sombre",
      explore: "Explorer", footerNav: "Liens du pied de page", contactTitle: "Contact", hoursTitle: "Horaires", rights: "Tous droits réservés.", websiteBy: "Site web par",
      whatsappUs: "Écrire sur WhatsApp", phone: "Téléphone", email: "E-mail", address: "Adresse", chatNow: "Écrivez-nous maintenant",
      closed: "Fermé", today: "aujourd'hui", tomorrow: "demain", openUntil: "Ouvert, jusqu'à {time}", closedOpens: "Fermé. Ouvre {day} à {time}",
      days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      introSkip: "Passer", close: "Fermer", ok: "OK", prev: "Précédent", next: "Suivant", slide: "Aller à la diapositive {n}", showMap: "Afficher la carte", mapTitle: "Carte de notre adresse",
      formSending: "Envoi…", formSent: "Merci. Votre message a été envoyé et nous vous répondrons très vite.", formError: "Désolé, le message n'a pas pu être envoyé. Appelez-nous au {phone}.",
      formMailto: "Votre messagerie s'est ouverte avec votre message. Appuyez sur envoyer pour terminer.", formDemoDone: "Démo : rien n'a été envoyé.",
      demoLabel: "À propos de cette démo", demoBadge: "Démo", demoNote: "Exemple de site par WebLuxe. L'entreprise, les prix et les avis sont fictifs.",
      demoTitle: "Ceci est une démo", demoWa: "Sur le vrai site, ceci ouvre WhatsApp avec ce message prêt à envoyer :", demoTel: "Sur le vrai site, ceci appelle l'entreprise :",
      demoMail: "Sur le vrai site, ceci ouvre un e-mail vers l'entreprise.", demoForm: "Sur le vrai site, l'entreprise reçoit ceci :",
      demoStudio: "Je veux un site comme celui-ci", demoStudioMsg: "Bonjour WebLuxe, j'ai vu la démo {site} et je voudrais un site comme celui-ci.",
      // ----- ce modèle -----
      navHome: "Accueil", navServices: "Services", navPortfolio: "Réalisations", navAbout: "À propos", navContact: "Contact", breadcrumb: "Vous êtes ici",
      getQuote: "Devis", getFreeQuote: "Devis gratuit", seeWork: "Voir nos réalisations", allServices: "Tous les services", allProjects: "Voir les {n} projets",
      from: "Dès", startingFrom: "À partir de", quoteFor: "Demander un devis", all: "Tout", filterLabel: "Filtrer les projets", viewPhoto: "Voir {title} en plein écran",
      before: "Avant", after: "Après", baSlider: "Glissez pour comparer avant et après", ratingOf: "{n} étoiles sur 5", reviewsCount: "{n} avis sur {source}",
      showroom: "Showroom", optional: "(facultatif)", freeQuote: "Devis gratuit", quoteTitle: "Parlez-nous de votre projet",
      qStep1: "Projet", qStep2: "Détails", qStep3: "Vos coordonnées", qWhich: "Que pouvons-nous fabriquer pour vous ?", qOther: "Autre chose", qTell: "Dites-nous en un peu plus",
      qDetails: "Votre projet", qLocation: "Ville ou village", qBudget: "Budget", qBudgetPick: "Choisissez une fourchette", qPhotos: "Photos de l'espace", qPhotosHint: "Touchez pour ajouter des photos", qPhotosN: "{n} photo(s) ajoutée(s)",
      qPhotosWa: "J'envoie {n} photo(s) dans cette discussion.", qAbout: "Comment vous joindre ?", qDate: "Meilleur jour pour la visite", back: "Retour", continue: "Continuer",
      qSend: "Envoyer ma demande", qSendWa: "Envoyer sur WhatsApp", qThanks: "Merci !", qThanksText: "Nous avons bien reçu votre demande et vous appelons sous un jour ouvré pour fixer la visite.",
      waQuoteIntro: "Bonjour {name}, je voudrais un devis :", quoteSubject: "Nouvelle demande de devis depuis le site {name}",
      fName: "Votre nom", fPhone: "Téléphone", fEmail: "E-mail", formPrivacy: "Vos coordonnées servent uniquement à vous répondre.",
      seeDetails: "Voir le détail", orderNo: "Commande n°",
    },
  },
};
