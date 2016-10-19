module ViewRiders exposing (..)

import Html exposing (Html, button, div, text, span, input, ul, li)
import App.Model exposing (Rider)
import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (css)
import Material.Typography as Typo
import Material.Table as Table
import Material.Chip as Chip


viewRiders : List Rider -> Html msg
viewRiders riders =
    div []
        [ Options.styled Html.p [ Typo.display2 ] [ text "RIDERS" ]
        , riderTable (riders)
        ]


riderTable : List Rider -> Html msg
riderTable riders =
    Table.table []
        [ Table.thead []
            [ Table.tr []
                [ Table.th [] [ text "Naam" ]
                , Table.th [] [ text "Licentie" ]
                ]
            ]
        , Table.tbody []
            (riders
                |> List.map
                    (\rider ->
                        Table.tr []
                            [ Table.td [] [ text rider.name ]
                            , Table.td [] [ text rider.licence ]
                            ]
                    )
            )
        ]
