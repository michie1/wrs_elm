module ViewRaces exposing (..)

import Html exposing (Html, button, div, text, span, input, ul, li)
import Html.Attributes exposing (..)

import App.Model exposing (Rider, Mdl)
import App.Msg exposing (Msg(..))

import Race.Model exposing (Race)

import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (Style, css)
import Material.Typography as Typo
import Material.Table as Table
import Material.Chip as Chip
import Material.Layout as Layout

viewRaces : (List Race) -> Mdl -> Html Msg
viewRaces races mdl =
  div [] 
  [ Options.styled Html.p 
      [ Typo.display2 ]
      [ text "RACES" ] 
    , raceTable (races)
    , div [] 
        [ Layout.link
            [ Layout.href "#races-add" ]
            [ text "Add race" ]
        , Button.render Mdl [0] mdl
            [ Button.raised
            --, Button.onClick GoToRaceAdd 
            ]
            [ text "Add race" ]
        ]
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


