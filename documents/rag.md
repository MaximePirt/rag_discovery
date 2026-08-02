

Wikipédial'encyclopédie libre
Rechercher sur Wikipédia
Rechercher
Faire un don
Créer un compte
Se connecter
Sommaire masquer
Début
Limites du RAG et des LLM
Processus

Étapes clés du RAG
Améliorations

Encodage (embeddings / vecteurs)
Méthodes centrées sur le moteur de récupération (retriever)
Modèle de langage
Découpage en segments (chunking)
Recherche hybride
Évaluation et tests de référence (benchmarks)
Défis

Empoisonnement du RAG
Notes et références
Voir aussi

Liens externes
Bibliographie
Génération à enrichissement contextuel

Article
Discussion
Lire
Modifier
Modifier le code
Voir l’historique

Apparence masquer
Taille du texte

Petite

Standard

Grande
Largeur

Standard

Large
Couleur (bêta)

Automatique

Clair

Sombre
La génération à enrichissement contextuel ou génération augmentée par récupération (anglais : retrieval-augmented generation) ou RAG est une technique d'optimisation de réponses de modèle de langage en intelligence artificielle générative (IAg). Cette méthode permet notamment d'améliorer la qualité de réponses aux requêtes en permettant aux grands modèles de langage (en anglais : large language models, LLM) d'exploiter des ressources de données supplémentaires sans ré-entraînement[1].

Les cas d'utilisation incluent l'accès via un chatbot aux données internes de l'entreprise ou la diffusion d'informations vérifiées provenant exclusivement de sources fiables et reconnues[2].

Avec la RAG, les LLM ne répondent pas aux requêtes des utilisateurs tant qu'ils n'ont pas consulté un ensemble spécifique de documents. Ces documents complètent les informations provenant des données d'entraînement préexistantes du LLM[3]. Cela permet aux LLM d'utiliser des informations spécifiques à un domaine qui ne sont pas disponibles dans les données d'entraînement[3].

La RAG améliore les grands modèles de langage (LLM) en intégrant la recherche d'informations avant de générer des réponses[4]. Contrairement aux LLM qui s'appuient sur des données d'entraînement statiques, la RAG extrait des textes pertinents à partir de bases de données, de documents téléchargés ou de sources web[5]. Selon Ars Technica, « la RAG est un moyen d'améliorer les performances des LLM, essentiellement en combinant le processus LLM avec une recherche sur le web ou un autre processus de recherche de documents afin d'aider les LLM à s'en tenir aux faits». Cette méthode permet de réduire les hallucinations des IA génératives de textes[4], qui ont conduit des chatbots à décrire des politiques inexistantes ou à recommander des affaires juridiques inexistantes à des avocats à la recherche de citations pour étayer leurs arguments[6].

La RAG réduit également la nécessité de réentraîner les LLM avec de nouvelles données[5], ce qui permet de réaliser des économies de ressources informatiques et financières. Au-delà des gains d'efficacité, la RAG permet également aux LLM d'inclure des sources dans leurs réponses, afin que les utilisateurs puissent vérifier les sources citées. Cela offre une plus grande transparence, car les utilisateurs peuvent recouper les contenus récupérés afin de s'assurer de leur exactitude et de leur pertinence.

Le terme RAG a été introduit pour la première fois dans un article de recherche publié en 2020[4].

Limites du RAG et des LLM
Les LLM peuvent fournir des informations incorrectes. Par exemple, lorsque Google a présenté pour la première fois son chatbot Google Bard (rebaptisé par la suite Gemini), le LLM a fourni des informations incorrectes sur le télescope spatial James Webb. Cette erreur a contribué à une baisse de 100 milliards de dollars de la valeur boursière de l'entreprise[6]. Le RAG est utilisé pour éviter ces erreurs, mais il ne résout pas tous les problèmes. Par exemple, les LLM peuvent générer des informations erronées même lorsqu'ils s'appuient sur des sources factuellement correctes s'ils interprètent mal le contexte. La MIT Technology Review donne l'exemple d'une réponse générée par l'IA affirmant que «les États-Unis ont eu un président musulman, Barack Hussein Obama». Le modèle a extrait cette information d'un ouvrage universitaire intitulé de manière rhétorique «Barack Hussein Obama: le premier président musulman des États-Unis ? ». Le LLM ne «connaissait» ni ne «comprenait» le contexte du titre, générant ainsi une réponse fausse[3].

Les LLM avec RAG sont programmés pour donner la priorité aux nouvelles informations. Cette technique est appelée surcharge d’instruction générative, en anglais prompt stuffing. Sans cette technique, l'entrée du LLM est générée uniquement par l'utilisateur; avec cette technique, un contexte supplémentaire pertinent est ajouté à cette entrée pour guider la réponse du modèle. Cette approche fournit au LLM des informations clés dès le début du prompt, l'encourageant à donner la priorité aux données fournies par rapport aux connaissances acquises lors de la phase d'entraînement[7].

Processus
La génération à enrichissement contextuel (RAG) améliore les grands modèles de langage (LLM) en intégrant un mécanisme de récupération d'informations qui permet aux modèles d'accéder à des données supplémentaires au-delà de leur ensemble d'apprentissage initial et de les utiliser. Ars Technica note que « lorsque de nouvelles informations deviennent disponibles, plutôt que de devoir réentraîner le modèle, il suffit d'augmenter la base de connaissances externes du modèle avec les informations mises à jour »[6]. IBM indique que «dans la phase générative, le LLM s'appuie sur l'invite augmentée et sa représentation interne des données d'entraînement pour synthétiser une réponse adaptée à l'utilisateur»[5].

Étapes clés du RAG

Aperçu du fonctionnement du RAG : il combine des documents externes et la question de l’utilisateur dans un prompt envoyé à un modèle de langage (LLM) afin d’obtenir une réponse adaptée
En général, les données à référencer sont converties en embeddings, c’est-à-dire en représentations numériques sous forme de vecteurs dans un espace vectoriel de grande dimension. La RAG peut s’appliquer à des données non structurées (souvent du texte), semi-structurées ou structurées (par exemple des graphes de connaissances). Ces embeddings sont ensuite stockés dans une base de données vectorielle afin de permettre la recherche/récupération de documents.

À partir d’une requête utilisateur, on fait d’abord appel à un moteur de récupération (retriever) pour sélectionner les documents les plus pertinents qui serviront à enrichir la requête[3],[4]. Cette comparaison peut se faire par différentes méthodes, qui dépendent en partie du type d’indexation utilisé[5].

Le système injecte ensuite ces informations pertinentes récupérées dans le LLM via une construction du prompt à partir de la requête originale de l’utilisateur et du prompt système spécifique associé au RAG. Les implémentations plus récentes (à partir de 2023) peuvent aussi intégrer des modules d’augmentation spécifiques, capables par exemple d’étendre une requête à plusieurs domaines, ou d’utiliser la mémoire et l’auto-amélioration pour apprendre des récupérations précédentes.

Enfin, le LLM peut générer une réponse en se basant à la fois sur la requête et sur les documents récupérés[3],[8]. Certains modèles ajoutent des étapes supplémentaires pour améliorer le résultat, comme le reclassement des informations récupérées, la sélection du contexte, et le réglage fin (fine-tuning).

Améliorations
On peut améliorer le processus de base de la RAG à différentes étapes du flux.

Encodage (embeddings / vecteurs)
Ces méthodes portent sur la façon de transformer le texte en vecteurs ou matrice, soit dense, soit creuse. Les matrices creuses représentent surtout les mots eux-mêmes (l’identité des mots). Elles sont souvent de grande taille (taille proche d’un dictionnaire) et contiennent beaucoup de zéros. Les vecteurs denses représentent plutôt le sens. Ils sont plus compacts et contiennent **moins de zéros. Différentes améliorations peuvent aider à mieux calculer les similarités dans les bases vectorielles[9].

Les performances s’améliorent en optimisant le calcul des similarités entre vecteurs[10].
La précision peut augmenter avec des interactions tardives: le système compare les mots de manière plus fine après la première récupération. Ça aide à mieux classer les documents et à rendre la recherche plus pertinente[11].
On peut utiliser des approches hybrides qui combinent les différents types de vecteurs, en profitant du fait que les calculs sur des matrices creuses sont souvent plus efficaces que des opérations sur des vecteurs denses.
D’autres techniques visent surtout à mieux choisir les documents récupérés pour améliorer la précision de recherche[12].
Méthodes centrées sur le moteur de récupération (retriever)
Ces méthodes cherchent à améliorer la qualité de la récupération de documents dans des bases de données vectorielles:

Pré-entraîner le moteur de récupération avec l’Inverse Cloze Task (ICT): une technique qui aide le modèle à apprendre à retrouver les bons passages en lui demandant de prédire un texte masqué à l’intérieur de documents[13].
Optimisation supervisée du moteur de récupération: l’objectif est d’aligner ce que le retriever a tendance à récupérer avec ce qui aide vraiment le modèle génératif à produire une bonne réponse[14].
Techniques de reclassement (reranking): elles améliorent les résultats en reclassant les documents récupérés pour mettre en tête les plus pertinents, notamment pendant l’entraînement, afin de renforcer les performances du moteur de récupération[15].
Modèle de langage
En repensant le modèle de langage en tenant compte dès le départ du moteur de récupération, un modèle 25 fois plus petit peut obtenir un niveau de performance comparable à celui de modèles beaucoup plus grands[16]. Comme ce modèle est entraîné à partir de zéro, cette approche (appelée Retro) entraîne un coût d’entraînement élevé, contrairement au schéma RAG initial qui évite justement ces entraînements lourds. L’idée est que, si on apporte des connaissances de domaine pendant l’entraînement, Retro a moins besoin de “mémoriser” le domaine dans ses paramètres: il peut utiliser ses poids (sa capacité) plus efficacement et se concentrer davantage sur la compréhension du langage.

Des ajustements ont été faits pour rendre cette approche reproductible. La version la plus reproductible s’appelle Retro++ et inclut du RAG directement via le contexte fourni dans le prompt[17].

Découpage en segments (chunking)
Le découpage en segments consiste à découper les données en petits segments courts (chunks), qui seront ensuite transformés en vecteurs (embeddings). Ainsi, le moteur de récupération peut retrouver plus facilement les passages pertinents.


Les différents types de données ont des structures spécifiques dont un bon découpage peut tirer parti.
Voici trois stratégies de chunking courantes :

Taille fixe avec chevauchement. On découpe en segments d’une longueur identique. C’est simple et rapide. Le chevauchement entre deux segments successifs aide à garder le contexte (le sens) d’un segment à l’autre[18].
Découpage basé sur la syntaxe (phrases). On découpe le document par phrases (ou parfois par paragraphes)[19].
Découpage basé sur le format de fichier. Certains formats ont des “découpages naturels”, et il vaut mieux les respecter. Pour du code, on découpe souvent par fonction ou classe. Pour du HTML, on évite de casser des éléments comme les <table> ou des images encodées en base64 (<img>). Pour des PDF, il faut aussi faire attention à garder une structure cohérente. Des outils comme Unstructured ou LangChain peuvent aider pour cette approche[20].
Recherche hybride
Parfois, une recherche dans une base vectorielle peut passer à côté de faits importants nécessaires pour répondre à la question d’un utilisateur. Pour limiter ce problème, on peut faire en plus une recherche texte classique (par mots-clés), puis ajouter ces résultats aux morceaux de texte (chunks) associés aux documents retrouvés via la recherche vectorielle. Ensuite, on donne l’ensemble de ce texte (vectoriel + mots-clés) au modèle de langage pour qu’il génère la réponse[21].

Évaluation et tests de référence (benchmarks)
Les systèmes RAG sont souvent évalués avec des benchmarks conçus pour mesurer : la capacité à retrouver les bons documents, la précision de cette recherche, et la qualité du texte généré[22],[23]. Parmi les jeux de données souvent utilisés, on trouve BEIR, un ensemble de tâches de recherche d’information dans différents domaines[24].

Défis
La RAG n’empêche pas les hallucinations des LLM et selon Ars Technica, c'est plus une méthode d'atténuation du problème qu'une résolution de celui-ci[6].

Même si la RAG améliore la précision des LLM, il ne règle pas tout. L'une des limites est que la RAG réduit le besoin de réentraîner le modèle, mais ne le supprime pas complètement. Un LLM peut avoir du mal à reconnaître qu’il n’a pas assez d’informations pour répondre de façon fiable. Sans entraînement spécifique, il peut quand même produire une réponse au lieu de dire qu’il n’est pas sûr. IBM explique que ce problème peut venir du fait que le modèle n’a pas vraiment la capacité d’évaluer les limites de ce qu’il “sait”.

Empoisonnement du RAG
Un système RAG peut récupérer des sources factuellement correctes, mais trompeuses, ce qui entraîne des erreurs d’interprétation. Par exemple, le LLM peut reprendre une phrase d’une source sans tenir compte du contexte, et en tirer une conclusion fausse. De plus, quand plusieurs sources se contredisent, un modèle RAG peut avoir du mal à décider laquelle est la bonne. Dans le pire des cas, le modèle peut mélanger des détails venant de plusieurs sources et produire une réponse qui combine des informations anciennes et récentes de manière trompeuse. Selon la MIT Technology Review, ces problèmes surviennent parce que les systèmes RAG peuvent mal interpréter les données qu'ils récupèrent.

En septembre 2025, Israël aurait payé 6 millions de dollars pour influencer l’opinion publique, en s’appuyant sur ce type de limite[25].

Notes et références
(en) Cet article est partiellement ou en totalité issu de l’article de Wikipédia en anglais intitulé « Retrieval-augmented generation » (voir la liste des auteurs).
Guillaume Serries, « RAG : comment cette technique optimise l'IA générative [archive] », sur ZDNET, 4 juin 2024 (consulté le 5 mars 2025)
« Qu'est-ce que la génération à enrichissement contextuel (RAG) ? – Explication de l'IA de génération à enrichissement contextuel – AWS [archive] », sur Amazon Web Services, Inc. (consulté le 5 mars 2025)
 (en) Rhiannon Williamsarchive page, « Why Google’s AI Overviews gets things wrong [archive] », sur MIT Technology Review (consulté le 17 janvier 2026)
 Patrick Lewis, Ethan Perez, Aleksandra Piktus et Fabio Petroni, « Retrieval-augmented generation for knowledge-intensive NLP tasks », Proceedings of the 34th International Conference on Neural Information Processing Systems, Curran Associates Inc., nIPS '20,‎ 6 décembre 2020, p. 9459–9474 (ISBN 978-1-7138-2954-6, DOI 10.5555/3495724.3496517, lire en ligne [archive], consulté le 17 janvier 2026)
 (en-US) « What is retrieval-augmented generation (RAG)? [archive] », sur IBM Research, 9 février 2021 (consulté le 17 janvier 2026)
 (en) Ars Contributors, « Can a technology called RAG keep AI models from making stuff up? [archive] », sur Ars Technica, 6 juin 2024 (consulté le 17 janvier 2026)
(en-GB) « Mitigating LLM hallucinations in text summarisation [archive] », sur www.bbc.co.uk (consulté le 17 janvier 2026)
Patrick Lewis, Ethan Perez, Aleksandra Piktus et Fabio Petroni, « Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks », Advances in Neural Information Processing Systems, Curran Associates, Inc., vol. 33,‎ 2020, p. 9459–9474 (lire en ligne [archive], consulté le 17 janvier 2026)
(en) Yi Luan, Jacob Eisenstein, Kristina Toutanova et Michael Collins, « Sparse, Dense, and Attentional Representations for Text Retrieval », Transactions of the Association for Computational Linguistics, vol. 14,‎ 26 avril 2021 (lire en ligne [archive])
(en-US) claytonsiemens77, « Develop a RAG Solution—Information-Retrieval Phase - Azure Architecture Center [archive] », sur learn.microsoft.com (consulté le 17 janvier 2026)
Omar Khattab et Matei Zaharia, « ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT », Proceedings of the 43rd International ACM SIGIR Conference on Research and Development in Information Retrieval, Association for Computing Machinery, sIGIR '20,‎ 25 juillet 2020, p. 39–48 (ISBN 978-1-4503-8016-4, DOI 10.1145/3397271.3401075, lire en ligne [archive], consulté le 17 janvier 2026)
« Text REtrieval Conference (TREC) 2024 Proceedings [archive] », sur trec.nist.gov (consulté le 17 janvier 2026)
(en) Kenton Lee, Ming-Wei Chang et Kristina Toutanova, « Latent Retrieval for Weakly Supervised Open Domain Question Answering », Association for Computational Linguistics,‎ 2 août 20219 (lire en ligne [archive])
Weijia Shi, Sewon Min, Michihiro Yasunaga et Minjoon Seo, « REPLUG: Retrieval-Augmented Black-Box Language Models », Proceedings of the 2024 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies (Volume 1: Long Papers), Association for Computational Linguistics,‎ juin 2024, p. 8371–8384 (DOI 10.18653/v1/2024.naacl-long.463, lire en ligne [archive], consulté le 17 janvier 2026)
Ori Ram, Yoav Levine, Itay Dalmedigos et Dor Muhlgay, « In-Context Retrieval-Augmented Language Models », Transactions of the Association for Computational Linguistics, vol. 11,‎ 2023, p. 1316–1331 (DOI 10.1162/tacl_a_00605, lire en ligne [archive], consulté le 17 janvier 2026)
(en) Sebastian Borgeaud & al., « Improving Language Models by Retrieving from Trillions of Tokens », 39 th International Conference on Machine Learning, Baltimore, Maryland,‎ 2022 (lire en ligne [archive])
Boxin Wang, Wei Ping, Peng Xu et Lawrence McAfee, « Shall We Pretrain Autoregressive Language Models with Retrieval? A Comprehensive Study », Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing, Association for Computational Linguistics,‎ décembre 2023, p. 7763–7786 (DOI 10.18653/v1/2023.emnlp-main.482, lire en ligne [archive], consulté le 17 janvier 2026)
(en-US) claytonsiemens77, « Develop a RAG Solution - Chunking Phase - Azure Architecture Center [archive] », sur learn.microsoft.com (consulté le 17 janvier 2026)
(en) Ai Yun Shu, « Document Chunking for RAG: 9 Strategies Tested (70% Accuracy Boost 2025) [archive] », sur langcopilot.com, 11 octobre 2025 (consulté le 17 janvier 2026)
(en) « Chunking Strategies to Improve Your RAG Performance | Weaviate [archive] », sur weaviate.io, 4 septembre 2025 (consulté le 17 janvier 2026)
« De meilleurs résultats de recherche grâce aux bases de données vectorielles | Smals Research [archive] », sur www.smalsresearch.be (consulté le 17 janvier 2026)
« Évaluation d'un RAG : comment faire ? [archive] », sur Formation Tech et Data en ligne | Blent.ai (consulté le 17 janvier 2026)
« Évaluation RAG : Guide complet pour tester les systèmes de génération augmentée par récupération [archive] », sur latenode.com (consulté le 17 janvier 2026)
(en) « 7 RAG benchmarks [archive] », sur www.evidentlyai.com (consulté le 17 janvier 2026)
(en-US) Nour ITS, « Israel Pays $6 Million on GPT Training to Sway US Youth Opinion on Gaza [archive] », sur Inside Telecom, 30 septembre 2025 (consulté le 17 janvier 2026)
Voir aussi
Liens externes
« Génération augmentée par récupération (RAG) : guide pour exploiter les données de sa TPE PME avec l’IA générative [archive] », sur francenum.gouv.fr, 11 juillet 2025 (consulté le 18 mai 2026)
Bibliographie
(en) Patrick Lewis et al., « Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks », Advances in Neural Information Processing Systems (NeurIPS 2020),‎ 2020 (lire en ligne [archive])

 [masquer]
v · m
Intelligence artificielle (IA)
Concepts	
IA agentiqueEffet IAGrand modèle de langageHallucinationIA générativeTest de Turing
Techniques	
Analyse prédictiveApprentissage automatiqueApprentissage non superviséApprentissage profondApprentissage superviséGénération à enrichissement contextuelMachine d'apprentissage logiqueModèle de fondationModèle des croyances transférablesIA symboliqueRéseau bayésienRéseau de neurones artificiels Réseau de neurones récurrentsRéseau neuronal convolutifTransformeurTransformeur génératif préentraînéSystème expertApprentissage par renforcement à partir de rétroaction humaine
Applications	
Art créé par IAApple IntelligenceChatGPTConséquences économiques de l'intelligence artificielleDeepLDiagnosticÉcriture assistée par IAIA dans la santéIA dans le jeu vidéoModèle texte-imageModèle texte-vidéoPerception artificiellePlanificationRobotiqueSynthèse vocaleTraduction automatiqueTraitement automatique des languesVéhicule autonomeVision par ordinateur
Enjeux et philosophie	
Alignement des intelligences artificiellesChambre chinoiseConscience artificielleContrôle des capacités de l'IADétection de contenu généré par IAÉthique de l'IAIA digne de confiancePhilosophie de l'IASûreté des IA
Histoire et événements	
Logic Theorist (1955)Perceptron (1957)General Problem Solver (1959)Prolog (1972)Matchs Deep Blue contre Kasparov (1996-1997)Match AlphaGo - Lee Sedol (2016)Sommet pour l'action sur l'IA (2025)
Concepts prospectifs	
AnticipationIA-completIA généraleRisque existentiel posé par l'IASuperintelligence
Règlementation	
Réglementation de l'IARèglement sur l'IA
Organisations	
Agence francophone pour l'IAAnthropicGoogle DeepMindHugging FaceOpenAIPartenariat sur l'IA
Ouvrages	
Déclaration de Montréal pour un développement responsable de l'IAI.A. La Plus Grande Mutation de l'HistoireIntelligence artificielle : une approche moderneLettre ouverte sur l'IAPower and ProgressSuperintelligence : Paths, Dangers, Strategies
icône décorative Portail de l’intelligence artificielle icône décorative Portail de l’informatique
Catégorie : Traitement automatique du langage naturel[+]
La dernière modification de cette page a été faite le 2 août 2026 à 13:17. La page a été rendue avec Parsoid.
Droit d'auteur : les textes sont disponibles sous licence Creative Commons attribution, partage dans les mêmes conditions ; d’autres conditions peuvent s’appliquer. Voyez les conditions d’utilisation pour plus de détails, ainsi que les crédits graphiques. En cas de réutilisation des textes de cette page, voyez comment citer les auteurs et mentionner la licence.
Wikipedia® est une marque déposée de la Wikimedia Foundation, Inc., organisation de bienfaisance régie par le paragraphe 501(c)(3) du code fiscal des États-Unis.
Politique de confidentialitéÀ propos de WikipédiaAvertissementsContactContacts juridiques & sécuritéCode de conduiteDéveloppeursStatistiquesDéclaration sur les témoins (cookies)Version mobile
Wikimedia Foundation
Powered by MediaWiki
