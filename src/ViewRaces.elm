module ViewRaces exposing (..)

import Array exposing (Array, fromList, get)
import Html exposing (Html, button, div, text, span, input, ul, li)
import Types exposing (Model, Race, Rider)

import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (css)
import Material.Typography as Typo
import Material.Table as Table
import Material.Chip as Chip

viewRaces : (Array Race) -> Html msg
viewRaces races =
  div [] 
  [ Options.styled Html.p [ Typo.display2 ] [text "RACES"] 
    , raceTable (Array.toList races)
  ]


raceTable : List Race -> Html msg
raceTable races = 
  Table.table []
    [ Table.thead []
      [ Table.tr [] 
        [ Table.th [] [ text "Naam" ]
        , Table.th [] [ text "Datum" ]
        , Table.th [] [ text "Soort" ]
        , Table.th [] [ text "WTOS-renners" ]
        ]
      ]
    , Table.tbody []
      (races |> List.map (\race ->
          Table.tr []
            [ Table.td [] [ text race.name ] 
            , Table.td [] [ text race.name ] 
            , Table.td [] [ text race.name ] 
            , Table.td [ Table.numeric ] [ text race.name ] 
            ]
        ) 
      )
    ]


