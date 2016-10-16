module Races.List exposing (..)

import Races.Msg as Races exposing (Msg(..))
import Races.Model exposing (Race)

import App.Model 
--exposing (Mdl)
import App.Msg 

import Html exposing (Html, div, text)

import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (Style, css)
import Material.Typography as Typo
import Material.Table as Table

render : List Race -> Html Races.Msg
render races =
  div []
    [ raceTable races
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
