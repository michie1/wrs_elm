module Races.List exposing (..)

--import Races.Msg as Races exposing (Msg(..))

--import App.Model
import Races.Model exposing (Race, categoryString)
import Results.Model


--exposing (Mdl)

import App.Msg


--import App.Page

import Html exposing (Html, h2, div, text, a, table, tr, td, th, thead, tbody)
import Html.Attributes exposing (href, class)


--import Material.Button as Button

--import Material.Options as Options exposing (Style, css)
--import Material.Typography as Typo
--import Material.Table as Table


render : List Race -> List Results.Model.Result -> Html App.Msg.Msg
render races results =
    div []
        [ h2 [] [ text "races" ]
        , div []
            [ a [ href "#races/add", class "waves-effect waves-light btn" ] [ text "Add race" ] ]
        , raceTable races results
        ]


raceTable : List Race -> List Results.Model.Result -> Html App.Msg.Msg
raceTable races results =
    table []
        [ thead []
            [ tr []
                [ th [] [ text "Naam" ]
                , th [] [ text "Datum" ]
                , th [] [ text "Soort" ]
                , th [] [ text "# Participants" ]
                ]
            ]
        , tbody []
            (races
                |> List.map
                    (\race ->
                        tr []
                            [ td []
                                [ a
                                    [ href ("#races/" ++ (toString race.id)) ]
                                    [ text race.name ]
                                ]
                            , td [] [ text race.date ]
                            , td [] [ text (categoryString race.category) ]
                            , td [ ] [ text (toString (countParticipants race.id results)) ]
                            ]
                    )
            )
        ]

countParticipants : Int -> List Results.Model.Result -> Int
countParticipants raceId results =
    List.length 
        ( List.filter
            (\result -> result.raceId == raceId)
            results
        )

