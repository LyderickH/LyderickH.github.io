//Table correspondance
let
    Source = Excel.Workbook(File.Contents("C:\Users\lydérick\Desktop\Projet suivi comptes\Projet suivi comptes portfolio\table correspondance.xls"), null, true),
    Feuil2 = Source{[Name="Feuil1"]}[Data],
    #"Type modifié" = Table.TransformColumnTypes(Feuil2,{{"Column1", type text}, {"Column2", type text}, {"Column3", type text}}),
    #"En-têtes promus" = Table.PromoteHeaders(#"Type modifié", [PromoteAllScalars=true]),
    #"Type modifié1" = Table.TransformColumnTypes(#"En-têtes promus",{{"Nom à chercher", type text}, {"Nom correspondant", type text}, {"Catégories", type text}}),
    #"Lignes vides supprimées" = Table.SelectRows(#"Type modifié1", each not List.IsEmpty(List.RemoveMatchingItems(Record.FieldValues(_), {"", null})))
in
    #"Lignes vides supprimées"

// Projet suivi comptes
let
    // 1) Charger et filtrer les fichiers
    Source = Folder.Files("C:\Users\lydérick\Desktop\Projet suivi comptes\Projet suivi comptes portfolio"),
    OnlyXlsx = Table.SelectRows(Source, each Text.Lower([Extension]) = ".xlsx"),
    VisibleFiles = Table.SelectRows(OnlyXlsx, each [Attributes]?[Hidden]? <> true),

    // 2) Tri et indexation
    SortedFiles = Table.Sort(VisibleFiles, {{"Name", Order.Ascending}}),
    IndexedFiles = Table.AddIndexColumn(SortedFiles, "IndexFichier", 0, 1, Int64.Type),

    // 3) Appliquer la transformation des fichiers
    TransformedFiles = Table.AddColumn(IndexedFiles, "Données", (row) =>
        let
            RawTable = #"Transformer le fichier"(row[Content]),
            Demoted = Table.DemoteHeaders(RawTable),
            Skipped = Table.Skip(Demoted, 9),
            FinalTable = Table.PromoteHeaders(Skipped, [PromoteAllScalars = true])
        in
            FinalTable
    ),

    // 4) Développement et nettoyage
    ExempleColonnes = Table.ColumnNames(TransformedFiles[Données]{0}),
    RenamedSource = Table.RenameColumns(TransformedFiles, {{"Name", "Source.Name"}}),
    SelectedColumns = Table.SelectColumns(RenamedSource, {"Source.Name", "Données"}),
    ExpandedTable = Table.ExpandTableColumn(SelectedColumns, "Données", ExempleColonnes),
    ChangedTypes = Table.TransformColumnTypes(ExpandedTable, {
        {"Date", type date}, {"Libellé", type text}, {"Débit euros", type number}, {"Crédit euros", type number}
    }),

    // 5) Trier et renommer les colonnes
    SortedRows = Table.Sort(ChangedTypes, {{"Date", Order.Descending}}),
    RenamedColumns = Table.RenameColumns(SortedRows, {{"Débit euros", "Dépenses"}, {"Crédit euros", "Encaissement"}}),
    RemovedSource = Table.RemoveColumns(RenamedColumns, {"Source.Name"}),

    // 6) Libellé retraité
    LibelleRetraite = Table.AddColumn(RemovedSource, "Libellé retraité", each let
            lignes = Text.Split([Libellé], "#(lf)"),
            ligne1 = if List.Count(lignes) >= 1 then lignes{0} else null,
            ligne2 = if List.Count(lignes) >= 2 then lignes{1} else null,
            result = 
                if ligne1 <> null and Text.Contains(ligne1, "PAIEMENT PAR CARTE") and ligne2 <> null then
                    Text.Range(ligne2, 6, 20)
                else if ligne2 <> null and Text.Contains(ligne2, "CARTE X2137") then
                    Text.Range(ligne2, 11, 16)
                else if ligne2 <> null then
                    Text.Start(ligne2, 20)
                else
                    null
        in
            result),

    // 7) Type de paiement
    PaymentType = Table.AddColumn(LibelleRetraite, "Type de paiement", each
        if Text.Contains([Libellé], "CARTE") then "CARTE"
        else if Text.Contains([Libellé], "PRELEVEMENT") then "PRELEVEMENT"
        else if Text.Contains([Libellé], "VIREMENT EN VOTRE FAVEUR") then "VIREMENT"
        else if Text.Contains([Libellé], "VIREMENT EMIS") then "VIREMENT"
        else "AUTRE"
    ),
    ChangedPaymentType = Table.TransformColumnTypes(PaymentType, {{"Type de paiement", type text}}),

    // 8) Remplacer null par 0 pour Dépenses et Encaissement
    FixedNulls = Table.ReplaceValue(ChangedPaymentType, null, 0, Replacer.ReplaceValue, {"Dépenses", "Encaissement"}),

    // 9) Flux net : Encaissement + (-Dépenses)
    WithFluxNet = Table.AddColumn(FixedNulls, "Flux net", each [Encaissement] - [Dépenses], type number)
in
    WithFluxNet

// budget

let
    Source = Excel.Workbook(File.Contents("C:\Users\lydérick\Desktop\Projet suivi comptes\budget.xls"), null, true),
    Feuil2 = Source{[Name="Feuil1"]}[Data],
    #"En-têtes promus" = Table.PromoteHeaders(Feuil2, [PromoteAllScalars=true]),

    // Test si la colonne Mois peut être convertie en date
    TestDates = List.Transform(#"En-têtes promus"[Mois], each try Date.FromText(_) otherwise null),
    TousSontDates = List.NonNullCount(TestDates) = Table.RowCount(#"En-têtes promus"),

    // Selon le résultat, appliquer la conversion directe ou le "truc relou"
    MoisConverti = if TousSontDates then
                        Table.TransformColumnTypes(#"En-têtes promus", {{"Mois", type date}})
                    else
                        let
                            #"Type changé en nombre" = Table.TransformColumnTypes(#"En-têtes promus", {{"Mois", Int64.Type}}),
                            #"Mois en date" = Table.TransformColumns(#"Type changé en nombre", {{"Mois", each Date.AddDays(#date(1899,12,30), _), type date}})
                        in
                            #"Mois en date",

    #"Type modifié" = Table.TransformColumnTypes(MoisConverti, {{"Montant positif", type number}, {"Montant négatif", type number}})
in
    #"Type modifié"
