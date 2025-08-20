// Prix foncier :
----------------------
let
    // Fonction pour importer et décompresser un fichier CSV depuis une URL
    ImportCSV = (url as text) =>
        let
            Source = Web.Contents(url),
            Decompressed = Binary.Decompress(Source, Compression.GZip),
            CsvTable = Csv.Document(Decompressed, [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
            PromotedHeaders = Table.PromoteHeaders(CsvTable, [PromoteAllScalars=true])
        in
            PromotedHeaders,

    // Importation des fichiers des différentes années
    File2020 = ImportCSV("https://files.data.gouv.fr/geo-dvf/latest/csv/2020/full.csv.gz"),
    File2021 = ImportCSV("https://files.data.gouv.fr/geo-dvf/latest/csv/2021/full.csv.gz"),
    File2022 = ImportCSV("https://files.data.gouv.fr/geo-dvf/latest/csv/2022/full.csv.gz"),
    File2023 = ImportCSV("https://files.data.gouv.fr/geo-dvf/latest/csv/2023/full.csv.gz"),
    File2024 = ImportCSV("https://files.data.gouv.fr/geo-dvf/latest/csv/2024/full.csv.gz"),

    // Combinaison des données dans une seule table
    CombinedFiles = Table.Combine({File2020, File2021, File2022, File2023, File2024}),
    #"Replaced Value2" = Table.ReplaceValue(CombinedFiles,".",",",Replacer.ReplaceText,{"valeur_fonciere"}),

    // Application des transformations de la première requête
    #"Type modifié" = Table.TransformColumnTypes(#"Replaced Value2",{{"id_mutation", type text}, {"date_mutation", type date}, {"numero_disposition", Int64.Type}, {"nature_mutation", type text}, {"valeur_fonciere", Int64.Type}, {"adresse_numero", Int64.Type}, {"adresse_suffixe", type text}, {"adresse_nom_voie", type text}, {"adresse_code_voie", type text}, {"code_postal", Int64.Type}, {"code_commune", type text}, {"nom_commune", type text}, {"code_departement", type text}, {"ancien_code_commune", type any}, {"ancien_nom_commune", type any}, {"id_parcelle", type text}, {"ancien_id_parcelle", type any}, {"numero_volume", Int64.Type}, {"lot1_numero", Int64.Type}, {"lot1_surface_carrez", type text}, {"lot2_numero", Int64.Type}, {"lot2_surface_carrez", type text}, {"lot3_numero", Int64.Type}, {"lot3_surface_carrez", type text}, {"lot4_numero", type any}, {"lot4_surface_carrez", type any}, {"lot5_numero", type any}, {"lot5_surface_carrez", type any}, {"nombre_lots", Int64.Type}, {"code_type_local", Int64.Type}, {"type_local", type text}, {"surface_reelle_bati", Int64.Type}, {"nombre_pieces_principales", Int64.Type}, {"code_nature_culture", type text}, {"nature_culture", type text}, {"code_nature_culture_speciale", type text}, {"nature_culture_speciale", type text}, {"surface_terrain", Int64.Type}, {"longitude", type text}, {"latitude", type text}}),
    #"Replaced Value1" = Table.ReplaceValue(#"Type modifié",".",",",Replacer.ReplaceText,{"longitude", "latitude"}),
    #"Type modifié1" = Table.TransformColumnTypes(#"Replaced Value1",{{"longitude", type number}, {"latitude", type number}, {"valeur_fonciere", type text}}),
    #"Replaced Value" = Table.ReplaceValue(#"Type modifié1",".",",",Replacer.ReplaceText,{"valeur_fonciere"}),
    #"Changed Type" = Table.TransformColumnTypes(#"Replaced Value",{{"valeur_fonciere", type number}, {"code_departement", type text}, {"code_postal", type text}}),
    #"Removed Columns" = Table.RemoveColumns(#"Changed Type",{"numero_disposition", "ancien_code_commune", "ancien_nom_commune", "ancien_id_parcelle", "numero_volume", "lot1_numero", "lot1_surface_carrez", "lot2_numero", "lot2_surface_carrez", "lot3_numero", "lot3_surface_carrez", "lot4_numero", "lot4_surface_carrez", "lot5_numero", "lot5_surface_carrez", "nombre_lots"}),
    #"Replaced Value3" = Table.ReplaceValue(#"Removed Columns",null,4,Replacer.ReplaceValue,{"code_type_local"}),
    #"Replaced Value4" = Table.ReplaceValue(#"Replaced Value3","","Non renseigné",Replacer.ReplaceValue,{"type_local"}),
    #"Removed Columns1" = Table.RemoveColumns(#"Replaced Value4",{"code_nature_culture_speciale", "nature_culture_speciale"}),
    #"Changed Type1" = Table.TransformColumnTypes(#"Removed Columns1",{{"code_commune", type text}}),

    // Ajout de la colonne "Région"
    AddRegion = Table.AddColumn(#"Changed Type1", "Région", each if List.Contains({"75", "77", "78", "91", "92", "93", "94", "95"}, [code_departement]) then "Île-de-France"
else if List.Contains({"02", "59", "60", "62", "80"}, [code_departement]) then "Hauts-de-France"
else if List.Contains({"14", "27", "50", "61", "76"}, [code_departement]) then "Normandie"
else if List.Contains({"22", "29", "35", "56"}, [code_departement]) then "Bretagne, FR"
else if List.Contains({"44", "49", "53", "72", "85"}, [code_departement]) then "Pays de la Loire"
else if List.Contains({"16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"}, [code_departement]) then "Nouvelle-Aquitaine"
else if List.Contains({"01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "71", "73", "74"}, [code_departement]) then "Auvergne-Rhône-Alpes"
else if List.Contains({"04", "05", "06", "13", "83", "84"}, [code_departement]) then "Provence-Alpes-Côte d'Azur"
else if List.Contains({"2A", "2B"}, [code_departement]) then "Corse"
else if List.Contains({"21", "25", "39", "58", "70", "71", "89", "90"}, [code_departement]) then "Bourgogne-Franche-Comté"
else if List.Contains({"08", "10", "51", "52", "54", "55", "57", "67", "68", "88"}, [code_departement]) then "Grand Est"
else if List.Contains({"18", "28", "36", "37", "41", "45"}, [code_departement]) then "Centre-Val de Loire"
else if List.Contains({"09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"}, [code_departement]) then "Occitanie"
else if List.Contains({"971"}, [code_departement]) then "Guadeloupe"
else if List.Contains({"972"}, [code_departement]) then "Martinique"
else if List.Contains({"973"}, [code_departement]) then "Guyane"
else if List.Contains({"974"}, [code_departement]) then "La Réunion"
else if List.Contains({"976"}, [code_departement]) then "Mayotte"
else "Autre"),
    #"Type modifié2" = Table.TransformColumnTypes(AddRegion,{{"Région", type text}}),
    #"Lignes filtrées" = Table.SelectRows(#"Type modifié2", each ([type_local] <> "Dépendance" and [type_local] <> "Non renseigné")),
    #"Colonnes supprimées" = Table.RemoveColumns(#"Lignes filtrées",{"longitude", "latitude"}),
    #"Lignes filtrées1" = Table.SelectRows(#"Colonnes supprimées", each [code_postal] <> null and [code_postal] <> ""),
    #"Lignes filtrées2" = Table.SelectRows(#"Lignes filtrées1", each ([valeur_fonciere] <> null and [valeur_fonciere] <> 1 and [valeur_fonciere] <> 427 and [valeur_fonciere] <> 1000 and [valeur_fonciere] <> 5000 and [valeur_fonciere] <> ""))
in
    #"Lignes filtrées2"


// Correspondance Code insee code postal :
let
    Source = Csv.Document(Web.Contents("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/correspondance-code-insee-code-postal/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B"), [Delimiter=";", Columns=17, Encoding=65001, QuoteStyle=QuoteStyle.None]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{{"Code INSEE", type text}, {"Code Postal", type text}, {"Commune", type text}, {"Département", type text}, {"Région", type text}, {"Statut", type text}, {"Altitude Moyenne", type text}, {"Superficie", type text}, {"Population", type text}, {"geo_point_2d", type text}, {"geo_shape", type text}, {"ID Geofla", Int64.Type}, {"Code Commune", type text}, {"Code Canton", Int64.Type}, {"Code Arrondissement", Int64.Type}, {"Code Département", type text}, {"Code Région", type text}}),
    #"Added Custom" = Table.AddColumn(#"Changed Type", "Région.1", each if List.Contains({"75", "77", "78", "91", "92", "93", "94", "95"}, Text.From([Code Département])) then "Île-de-France" 
    else if List.Contains({"18", "28", "36", "37", "41", "45"}, Text.From([Code Département])) then "Centre-Val de Loire"
    else if List.Contains({"21", "58", "71", "89", "25", "39", "70", "90"}, Text.From([Code Département])) then "Bourgogne-Franche-Comté"
    else if List.Contains({"14", "27", "50", "61", "76"}, Text.From([Code Département])) then "Normandie"
    else if List.Contains({"02", "59", "60", "62", "80"}, Text.From([Code Département])) then "Hauts-de-France"
    else if List.Contains({"08", "10", "51", "52", "54", "55", "57", "67", "68", "88"}, Text.From([Code Département])) then "Grand Est"
    else if List.Contains({"44", "49", "53", "72", "85"}, Text.From([Code Département])) then "Pays de la Loire"
    else if List.Contains({"22", "29", "35", "56"}, Text.From([Code Département])) then "Bretagne"
    else if List.Contains({"16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"}, Text.From([Code Département])) then "Nouvelle-Aquitaine"
    else if List.Contains({"09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"}, Text.From([Code Département])) then "Occitanie"
    else if List.Contains({"01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"}, Text.From([Code Département])) then "Auvergne-Rhône-Alpes"
    else if List.Contains({"04", "05", "06", "13", "83", "84"}, Text.From([Code Département])) then "Provence-Alpes-Côte d'Azur"
    else if List.Contains({"2A", "2B"}, Text.From([Code Département])) then "Corse"
    else if Text.From([Code Département]) = "97" then "Outre-Mer"
    else "Autre"),
    #"Removed Columns" = Table.RemoveColumns(#"Added Custom",{"Région"}),
    #"Renamed Columns" = Table.RenameColumns(#"Removed Columns",{{"Région.1", "Région"}})
in
    #"Renamed Columns"


// Correspondance prix location :
let
    // Fonction pour charger et normaliser une source
    LoadAndNormalizeSource = (url as text, annee as number, type_bien as text) as table =>
        let
            Source = Csv.Document(Web.Contents(url), [Delimiter=";", Columns=13, Encoding=1252, QuoteStyle=QuoteStyle.None]),
            #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
            #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers", {
                {"id_zone", type text}, {"INSEE_C", type text}, {"LIBGEO", type text},
                {"EPCI", type text}, {"DEP", type text}, {"REG", type text},
                {"loypredm2", type number}, {"lwr.IPm2", type number}, {"upr.IPm2", type number},
                {"TYPPRED", type text}, {"nbobs_com", Int64.Type}, {"nbobs_mail", Int64.Type},
                {"R2_adj", type number}
            }),
            #"Added Annee" = Table.AddColumn(#"Changed Type", "annee", each annee, Int64.Type),
            #"Added Type Bien" = Table.AddColumn(#"Added Annee", "type_bien", each type_bien, type text)
        in
            #"Added Type Bien",

    // Sources 2024
    Source2024_Appartement = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/64c6e452-783a-4d71-95e6-22b1cdf96d37", 2024, "appartement"),
    Source2024_Appartement12 = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/89956da9-5b9b-41d7-8703-18dbec4d54a2", 2024, "appartement 1-2 pieces"),
    Source2024_Maison = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/b3ec6ed0-1cb7-477e-bfd4-2aa370333994", 2024, "maison"),
    Source2024_Appartement3Plus = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/b7f5522e-d7a9-4861-8b52-f0ed4c088944", 2024, "appartement 3 pieces ou plus"),

    // Sources 2023
    Source2023_Appartement = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/43618998-3b37-4a69-bb25-f321f1a93ed1", 2023, "appartement"),
    Source2023_Appartement12 = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/edadefbc-9707-45ef-a841-283608709e58", 2023, "appartement 1-2 pieces"),
    Source2023_Maison = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/34434cef-2f85-43b9-a601-c625ee426cb7", 2023, "maison"),
    Source2023_Appartement3Plus = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/08871624-ccb5-457a-83d5-fb134cba60da", 2023, "appartement 3 pieces ou plus"),

    // Sources 2022
    Source2022_Appartement = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/bc9d5d13-07cc-4d38-8254-88db065bd42b", 2022, "appartement"),
    Source2022_Appartement12 = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/7141612b-8029-44a4-a048-921a85a47b1f", 2022, "appartement 1-2 pieces"),
    Source2022_Maison = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/dfb542cd-a808-41e2-9157-8d39b5c24edb", 2022, "maison"),
    Source2022_Appartement3Plus = LoadAndNormalizeSource("https://www.data.gouv.fr/fr/datasets/r/b398ede4-75f9-47ac-bfc5-d912c0012880", 2022, "appartement 3 pieces ou plus"),

    // Combinaison de toutes les sources
    CombinedTables = Table.Combine({
        Source2024_Appartement, Source2024_Appartement12, Source2024_Maison, Source2024_Appartement3Plus,
        Source2023_Appartement, Source2023_Appartement12, Source2023_Maison, Source2023_Appartement3Plus,
        Source2022_Appartement, Source2022_Appartement12, Source2022_Maison, Source2022_Appartement3Plus
    }),

    // Réorganisation des colonnes
    #"Reordered Columns" = Table.ReorderColumns(CombinedTables, {"annee", "type_bien"} & List.RemoveItems(Table.ColumnNames(CombinedTables), {"annee", "type_bien"})),
    #"Renamed Columns" = Table.RenameColumns(#"Reordered Columns",{{"loypredm2", "Loyer prix m²"}, {"lwr.IPm2", "Lower 90% Prix m²"}, {"upr.IPm2", "Upper 90% prix m²"}, {"type_bien", "Type de bien"}})
in
    #"Renamed Columns"
