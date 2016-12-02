module Races.List exposing (..)

import Races.Model exposing (Race, categoryString)
import Results.Model
import App.Msg
import Html exposing (Html, h2, div, text, a, table, tr, td, th, thead, tbody)
import Html.Attributes exposing (href, class)


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
                [ th [] [ text "Name" ]
                , th [] [ text "Date" ]
                , th [] [ text "Category" ]
                , th [] [ text "Riders" ]
                ]
            ]
        , tbody []
            (List.map
                (\race ->
                    tr []
                        [ td []
                            [ a
                                [ href ("#races/" ++ (toString race.id)) ]
                                [ text race.name ]
                            ]
                        , td [] [ text race.date ]
                        , td [] [ text (categoryString race.category) ]
                        , td [] [ text (toString (countParticipants race.id results)) ]
                        ]
                )
                races
            )
        ]


countParticipants : Int -> List Results.Model.Result -> Int
countParticipants raceId results =
    List.length
        (List.filter
            (\result -> result.raceId == raceId)
            results
        )
