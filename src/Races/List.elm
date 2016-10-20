module Races.List exposing (..)

--import Races.Msg as Races exposing (Msg(..))

import App.Model
import Races.Model exposing (Race)


--exposing (Mdl)

import App.Msg
import App.Page
import Html exposing (Html, div, text, a)
import Html.Attributes exposing (href)
import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (Style, css)
import Material.Typography as Typo
import Material.Table as Table

heading : String -> Html App.Msg.Msg
heading title =
    Options.styled 
        Html.p
        [ Typo.display2 ]
        [ text title ]

render : List Race -> App.Model.Mdl -> Html App.Msg.Msg
render races mdl =
    div []
        [ div []
            [ heading "Races"
            , raceTable races
            ]
        , Button.render App.Msg.Mdl
            [ 0 ]
            mdl
            [ Button.raised
            , Button.onClick (App.Msg.GoTo App.Page.RacesAdd)
            ]
            [ text "Add"
            ]
        ]


raceTable : List Race -> Html App.Msg.Msg
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
            (races
                |> List.map
                    (\race ->
                        Table.tr []
                            [ Table.td [] 
                                [ a 
                                    [ href ("#races/" ++ (toString race.id)) ] 
                                    [ text race.name ]
                                ]
                            , Table.td [] [ text race.name ]
                            , Table.td [] [ text race.name ]
                            , Table.td [ Table.numeric ] [ text race.name ]
                            ]
                    )
            )
        ]
